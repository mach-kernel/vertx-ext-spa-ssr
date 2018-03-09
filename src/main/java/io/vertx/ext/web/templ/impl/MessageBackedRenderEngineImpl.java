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

import java.util.AbstractList;
import java.util.stream.Stream;

/**
 * MBRE implementation
 *
 * @author David Stancu
 */
public class MessageBackedRenderEngineImpl extends CachingTemplateEngine<String> implements MessageBackedRenderEngine {
  private final Vertx vertx;
  private final EventBus eventBus;
  private String rendererAddress;

  private String componentContextKey = COMPONENT_CONTEXT_KEY;

  public MessageBackedRenderEngineImpl(Vertx vertx) {
    super(".nop", DEFAULT_CACHE_SIZE);
    this.vertx = vertx;
    this.eventBus = vertx.eventBus();
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
   * Specify the key within RoutingContext that stores all of the components
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
  public void render(RoutingContext context, String _tDir, String _tFileName, Handler<AsyncResult<Buffer>> handler) {
    Object components = context.data().get(this.componentContextKey);
    if (!(components instanceof AbstractList)) return;
    Stream<Object> componentStream = Stream.of(components);

    // TODO: There has to be a more elegant way to do this, maybe
    // TODO: filtering to expected shape is cheaper?
    componentStream.parallel().forEach(meta -> {
      if (!(meta instanceof JsonObject)) return;
      JsonObject metaObject = (JsonObject) meta;

      String componentName = metaObject.getString("name");
      JsonObject props = metaObject.getJsonObject("props");
      // TODO: look at hashCode() for JsonObject maybe you're doing
      // TODO: too much work here
      String propsKey = Integer.toString(props.toString().hashCode());

      if (isCachingEnabled()) {
        String alreadyRendered = cache.get(propsKey);
        if (alreadyRendered != null) {
          context.put(componentName, alreadyRendered);
          return;
        }
      }

      eventBus.send(this.rendererAddress, meta, response -> {
        if (response.failed()) {
          context.put(componentName, "");
          handler.handle(Future.failedFuture(response.cause()));
          return;
        }

        String rendered = response.result().body().toString();
        if (isCachingEnabled()) cache.put(propsKey, rendered);
        context.put(componentName, rendered);
      });
    });
  }

  public void render(RoutingContext context, Handler<AsyncResult<Buffer>> handler) {
    render(context, null, null, handler);
  }
}
