import ComponentMap from './ComponentMap';

/**
 * Thin "interface" for SPA render support.
 */
export class AbstractSPARenderVerticle {
  /**
   * Create a new SPA render service.
   * @param componentMap
   * @param consumerAddress
   */
  constructor(componentMap, consumerAddress = "vertx.ext.spa.ssr") {
    this.componentMap = new ComponentMap(componentMap);

    vertx.eventBus().consumer(
      consumerAddress,
      this.onRenderRequest.bind(this)
    );
    vertx.eventBus().consumer(
      "vertx.ext.spa.get_components",
      this.onComponentMapRequest.bind(this)
    );

    this.vertxLogger = Java.type("io.vertx.core.logging.LoggerFactory")
                           .getLogger("vertx-ext-spa-ssr");

    this.vertxLogger.info("SSR verticle ready!");
  }

  /**
   * vert.x event bus handler.
   * @param message
   */
  onRenderRequest(message) {
    let { name } = message.body();

    if (typeof name !== 'string')
      return message.fail(1, 'Message name missing!');

    this.renderComponent(message);
  }

  /**
   * Ask the SSR service for what components can be
   * rendered
   * @param message
   */
  onComponentMapRequest(message) {
    message.reply(this.componentMap);
  }

  /**
   * Implement in subclasses for your SPA framework.
   * @param message
   */
  renderComponent(message) {
    throw new TypeError("Children must implement renderComponent()");
  }
}