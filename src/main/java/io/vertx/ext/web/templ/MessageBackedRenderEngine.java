package io.vertx.ext.web.templ;

import io.vertx.core.Vertx;
import io.vertx.ext.web.templ.impl.MessageBackedRenderEngineImpl;

/**
 * Render components from a context object as backed by rendering services
 * available on the message bus.
 *
 * @author David Stancu
 */
public interface MessageBackedRenderEngine extends TemplateEngine {
  String COMPONENT_CONTEXT_KEY = "components";
  int DEFAULT_CACHE_SIZE = 1000;
}
