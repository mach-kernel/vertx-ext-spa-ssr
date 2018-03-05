package io.vertx.ext.web.templ;

import io.vertx.core.Vertx;
import io.vertx.ext.web.templ.impl.MessageBackedRenderEngineImpl;

/**
 * Render components from a context object as backed by rendering services
 * available on the message bus
 *
 * @author David Stancu
 */
public interface MessageBackedRenderEngine extends TemplateEngine {
  int MAX_CACHE_SIZE = 10000;
  boolean EXCEPTION_ON_RENDER_MISS = false;

  static MessageBackedRenderEngine create(Vertx vertx) {
    return new MessageBackedRenderEngineImpl(vertx);
  }
}
