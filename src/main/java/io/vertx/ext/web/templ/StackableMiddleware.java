package io.vertx.ext.web.templ;

import io.vertx.core.Future;
import io.vertx.ext.web.RoutingContext;

/**
 * Middleware interface for MiddlewareStackTemplateEngine
 *
 * @author David Stancu
 */
public interface StackableMiddleware {
  Future render(RoutingContext context);
}
