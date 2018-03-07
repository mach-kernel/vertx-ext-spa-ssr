package io.vertx.ext.web.templ.impl;

import io.vertx.core.AsyncResult;
import io.vertx.core.Handler;
import io.vertx.core.buffer.Buffer;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.templ.StackableTemplateEngine;
import io.vertx.ext.web.templ.TemplateEngine;

import java.util.ArrayList;

/**
 * Stack multiple template engines together.
 *
 * @author David Stancu
 */
public class StackableTemplateEngineImpl implements StackableTemplateEngine {
  private final ArrayList<TemplateEngine> engines = new ArrayList<>();

  /**
   * Add template engines to the list. The output of the last will be passed to the
   * handler as a successful render.
   * @param templateEngine
   * @return
   */
  public StackableTemplateEngineImpl addEngine(TemplateEngine templateEngine) {
    engines.add(templateEngine);
    return this;
  }

  @Override
  public void render(RoutingContext context, String templateDirectory, String templateFileName, Handler<AsyncResult<Buffer>> handler) {
    engines.forEach(engine -> engine.render(context, templateDirectory, templateFileName, handler));
  }
}
