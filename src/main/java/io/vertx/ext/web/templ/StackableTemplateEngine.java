package io.vertx.ext.web.templ;

public interface StackableTemplateEngine extends TemplateEngine {
  StackableTemplateEngine addEngine(TemplateEngine templateEngine);
}
