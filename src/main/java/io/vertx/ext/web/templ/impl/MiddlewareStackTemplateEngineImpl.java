package io.vertx.ext.web.templ.impl;

import io.vertx.core.AsyncResult;
import io.vertx.core.CompositeFuture;
import io.vertx.core.Future;
import io.vertx.core.Handler;
import io.vertx.core.buffer.Buffer;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.templ.MiddlewareStackTemplateEngine;
import io.vertx.ext.web.templ.StackableMiddleware;
import io.vertx.ext.web.templ.TemplateEngine;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Stack multiple template engines together.
 *
 * @author David Stancu
 */
public class MiddlewareStackTemplateEngineImpl implements MiddlewareStackTemplateEngine {
  private final ArrayList<StackableMiddleware> middlewares = new ArrayList<>();
  private TemplateEngine outputEngine;

  /**
   * Add preprocessing middleware to the
   * @param middleware
   * @return
   */
  public MiddlewareStackTemplateEngine addMiddleware(StackableMiddleware middleware) {
    middlewares.add(middleware);
    return this;
  }

  /**
   * Add template engines to the list. The output of the last will be passed to the
   * handler as a successful render.
   * @param templateEngine
   * @return
   */
  public MiddlewareStackTemplateEngineImpl setOutputEngine(TemplateEngine templateEngine) {
    this.outputEngine = templateEngine;
    return this;
  }

  /**
   * Render stack
   * @param context
   * @param templateDirectory
   * @param templateFileName
   * @param handler
   */
  @Override
  public void render(RoutingContext context, String templateDirectory, String templateFileName, Handler<AsyncResult<Buffer>> handler) {
    List<Future> futures = middlewares.parallelStream()
        .map(middleware -> middleware.render(context))
        .collect(Collectors.toList());

    CompositeFuture.all(futures)
        .setHandler(__ -> outputEngine.render(context, templateDirectory, templateFileName, handler));
  }
}
