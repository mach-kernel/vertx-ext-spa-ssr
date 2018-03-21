package io.vertx.ext.web.templ;

import io.vertx.ext.web.templ.impl.MiddlewareStackTemplateEngineImpl;

/**
 * Template engine with output + stack of middleware to decorate
 * routing context
 *
 * @author David Stancu
 */
public interface MiddlewareStackTemplateEngine extends TemplateEngine {
  static MiddlewareStackTemplateEngine create() {
    return new MiddlewareStackTemplateEngineImpl();
  }

  MiddlewareStackTemplateEngine addMiddleware(StackableMiddleware middleware);
  MiddlewareStackTemplateEngine setOutputEngine(TemplateEngine templateEngine);
}
