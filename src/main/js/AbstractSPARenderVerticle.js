/**
 * Thin "interface" for SPA render support.
 */
export class AbstractSPARenderVerticle {
  /**
   * Create a new SPA render service.
   * @param componentMap
   */
  constructor(componentMap) {
    this.componentMap = componentMap;
    vertx.eventBus().consumer(
      "vertx.spa.render",
      this.onRenderRequest.bind(this)
    );
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
   * Implement in subclasses for your SPA framework.
   * @param message
   */
  renderComponent(message) {
    throw new TypeError("Children must implement renderComponent()");
  }
}