package io.vertx.ext.web.templ.impl;

import io.vertx.core.AsyncResult;
import io.vertx.core.Future;
import io.vertx.core.Handler;
import io.vertx.core.Vertx;
import io.vertx.core.buffer.Buffer;
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
public class MessageBackedRenderEngineImpl extends CachingTemplateEngine<String> implements MessageBackedRenderEngine {
  private final EventBus eventBus;

  private String rendererAddress = DEFAULT_RENDERER_ADDRESS;
  private String domComponentIdPrefix = DEFAULT_DOM_COMPONENT_ID_PREFIX;
  private String componentContextKey = DEFAULT_COMPONENT_CONTEXT_KEY;
  private String ssrStateName = DEFAULT_SSR_STATE_NAME;

  public MessageBackedRenderEngineImpl(Vertx vertx) {
    super(".nop", DEFAULT_CACHE_SIZE);
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
   * Change size of LRU cache from CachingTemplateEngine<T>
   *
   * @param max Max size
   * @return
   */
  public MessageBackedRenderEngine setMaxCacheSize(int max) {
    this.cache.setMaxSize(max);
    return this;
  }

  /**
   * Render components by publishing messages to SSR services.
   * @param context Routing context object
   * @param _tDir (Unused)
   * @param _tFileName
   * @param handler
   */
  @SuppressWarnings("unchecked")
  public void render(RoutingContext context, String _tDir, String _tFileName, Handler<AsyncResult<Buffer>> handler) {
    Object components = context.data().get(this.componentContextKey);
    if (!(components instanceof AbstractList)) return;

    List<Object> componentList = (AbstractList) components;
    ConcurrentHashMap<String, JsonObject> initialState = new ConcurrentHashMap<>();

    // TODO: Is this still true?
    // https://groups.google.com/forum/#!topic/vertx/3qJS_nK-J6M
    componentList.parallelStream().parallel().forEach(meta -> {
      if (!(meta instanceof JsonObject)) return;
      JsonObject metaObject = (JsonObject) meta;

      String token = metaObject.getString("token");
      JsonObject props = metaObject.getJsonObject("props");
      // TODO: look at hashCode() for JsonObject maybe you're doing
      // TODO: too much work here
      String propsKey = Integer.toString(props.toString().hashCode());
      String elementKey = domComponentIdPrefix + "-" + token;

      initialState.put(elementKey, props);

      if (isCachingEnabled()) {
        String alreadyRendered = cache.get(propsKey);
        if (alreadyRendered != null) {
          context.put(token, alreadyRendered);
          return;
        }
      }

      eventBus.send(this.rendererAddress, meta, response -> {
        if (response.failed()) {
          context.put(token, "");
          handler.handle(Future.failedFuture(response.cause()));
          return;
        }

        // To aid hydration
        Element component = Jsoup.parse(response.result().body().toString(), "", Parser.xmlParser());
        Node componentDiv = component.childNode(0);

        componentDiv.attr("id", elementKey);
        componentDiv.attr("react-kind", metaObject.getString("name"));

        String rendered = component.toString();
        if (isCachingEnabled()) cache.put(propsKey, rendered);
        context.put(token, rendered);
      });
    });

    context.put(ssrStateName, Json.encode(initialState));
  }

  public void render(RoutingContext context, Handler<AsyncResult<Buffer>> handler) {
    render(context, null, null, handler);
  }
}