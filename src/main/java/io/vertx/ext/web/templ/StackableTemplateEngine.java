package io.vertx.ext.web.templ;

import io.vertx.ext.web.templ.impl.StackableTemplateEngineImpl;

public interface StackableTemplateEngine extends TemplateEngine {
  static StackableTemplateEngine create() {
    return new StackableTemplateEngineImpl();
  }

  StackableTemplateEngine addEngine(TemplateEngine templateEngine);
}
