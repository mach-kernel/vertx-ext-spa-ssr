package io.vertx.ext.web.templ;

import io.vertx.core.AsyncResult;
import io.vertx.core.Handler;
import io.vertx.core.Vertx;
import io.vertx.core.buffer.Buffer;
import io.vertx.core.eventbus.Message;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.templ.impl.MessageBackedRenderEngineImpl;

/**
 * Render components from a context object as backed by rendering services
 * available on the message bus.
 *
 * @author David Stancu
 */
public interface MessageBackedRenderEngine extends TemplateEngine {
  String DEFAULT_COMPONENT_CONTEXT_KEY = "components";
  int DEFAULT_CACHE_SIZE = 10000;
  String DEFAULT_DOM_COMPONENT_ID_PREFIX = "cmpnt";
  String DEFAULT_RENDERER_ADDRESS = "vertx.ext.spa.ssr";
  String DEFAULT_SSR_STATE_NAME = "_ssrState";

  static MessageBackedRenderEngine create(Vertx vertx) {
    return new MessageBackedRenderEngineImpl(vertx);
  }

  MessageBackedRenderEngine setSsrStateName(String ssrStateName);
  MessageBackedRenderEngine setDomComponentIdPrefix(String domComponentIdPrefix);
  MessageBackedRenderEngine setRendererAddress(String rendererAddress);
  MessageBackedRenderEngine setComponentContextKey(String componentContextKey);
  MessageBackedRenderEngine setMaxCacheSize(int max);

  // Maybe someone will want to use it explicitly for some reason?
  void render(RoutingContext context, Handler<AsyncResult<Buffer>> handler);
}
