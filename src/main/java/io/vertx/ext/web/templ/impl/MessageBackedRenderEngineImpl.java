package io.vertx.ext.web.templ.impl;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import io.vertx.core.Future;
import io.vertx.core.Vertx;
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.json.Json;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.templ.MessageBackedRenderEngine;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Element;
import org.jsoup.nodes.Node;
import org.jsoup.parser.Parser;

import java.util.AbstractList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

/**
 * "Render" SPA components by messaging Nashorn verticles responsible
 * for doing server-side rendering.
 *
 * @author David Stancu
 */
public class MessageBackedRenderEngineImpl implements MessageBackedRenderEngine {
  private final EventBus eventBus;

  private final Cache<String, String> cache =
      Caffeine.newBuilder()
          .maximumSize(DEFAULT_CACHE_SIZE)
          .build();


  private String rendererAddress = DEFAULT_RENDERER_ADDRESS;
  private String domComponentIdPrefix = DEFAULT_DOM_COMPONENT_ID_PREFIX;
  private String componentContextKey = DEFAULT_COMPONENT_CONTEXT_KEY;
  private String ssrStateName = DEFAULT_SSR_STATE_NAME;
  private Boolean cacheEnabled = CACHE_ENABLED;

  public MessageBackedRenderEngineImpl(Vertx vertx) {
    this.eventBus = vertx.eventBus();
  }

  @Override
  public MessageBackedRenderEngine setSsrStateName(String ssrStateName) {
    this.ssrStateName = ssrStateName;
    return this;
  }

  /**
   * The component hydration stub relies on this key to associate initial state of a component
   * to its server-side rendered DOM.
   * @param domComponentIdPrefix
   * @return
   */
  public MessageBackedRenderEngine setDomComponentIdPrefix(String domComponentIdPrefix) {
    this.domComponentIdPrefix = domComponentIdPrefix;
    return this;
  }

  /**
   * What message address can render this component?
   * @param rendererAddress
   * @return
   */
  public MessageBackedRenderEngine setRendererAddress(String rendererAddress) {
    this.rendererAddress = rendererAddress;
    return this;
  }

  /**
   * Specify the key within RoutingContext that stores all of the components.
   * @param componentContextKey The key
   * @return
   */
  public MessageBackedRenderEngine setComponentContextKey(String componentContextKey) {
    this.componentContextKey = componentContextKey;
    return this;
  }

  /**
   * Toggle cache
   *
   * @param enabled
   * @return
   */
  public MessageBackedRenderEngine setCacheEnabled(boolean enabled) {
    this.cacheEnabled = enabled;
    return this;
  }

  /**
   * Render components by publishing messages to SSR services.
   * @param context Routing context object
   */
  @SuppressWarnings("unchecked")
  public Future render(RoutingContext context) {
    Object components = context.data().get(this.componentContextKey);
    if (!(components instanceof AbstractList)) return Future.failedFuture("components must be an AbstractList");

    List<Object> componentList = (AbstractList) components;
    ConcurrentHashMap<String, JsonObject> initialState = new ConcurrentHashMap<>();

    Future renderJob = Future.future();

    // TODO: Is this still true?
    // https://groups.google.com/forum/#!topic/vertx/3qJS_nK-J6M
    componentList.parallelStream().parallel().forEach(meta -> {
      if (!(meta instanceof JsonObject)) return;
      JsonObject metaObject = (JsonObject) meta;

      String token = metaObject.getString("token");
      JsonObject props = metaObject.getJsonObject("props");
      String propsKey = Integer.toString(props.toString().hashCode());
      String elementKey = domComponentIdPrefix + "-" + token;

      initialState.put(elementKey, props);

      if (this.cacheEnabled) {
        String alreadyRendered = cache.getIfPresent(propsKey);
        if (alreadyRendered != null) {
          context.put(token, alreadyRendered);
          renderJob.complete();
          return;
        }
      }

      eventBus.send(this.rendererAddress, meta, ssr_response -> {
        if (ssr_response.failed()) {
          context.put(token, "");
          renderJob.fail(ssr_response.cause());
          return;
        }

        // To aid hydration
        Element component = Jsoup.parse(ssr_response.result().body().toString(), "", Parser.xmlParser());
        Node componentDiv = component.childNode(0);

        componentDiv.attr("id", elementKey);
        componentDiv.attr(domComponentIdPrefix + "-kind", metaObject.getString("name"));

        String rendered = component.toString();
        if (this.cacheEnabled) cache.put(propsKey, rendered);
        context.put(token, rendered);

        renderJob.complete();
      });
    });

    context.put(ssrStateName, Json.encode(initialState));

    return renderJob;
  }
}