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
  // constructor(componentMap, consumerAddress = "vertx.ext.spa.ssr"
  constructor(componentMap, settings = {
    baseAddress: 'vertx.ext.spa',
    ssrAddress: 'ssr',
    getComponentsAddress: 'get_components'
  }) {
    this.settings = settings;
    this.componentMap = new ComponentMap(componentMap);

    const { baseAddress, ssrAddress, getComponentsAddress } = this.settings;

    vertx.eventBus().consumer(
      `${baseAddress}.${ssrAddress}`,
      this.onRenderRequest.bind(this)
    );
    vertx.eventBus().consumer(
      `${baseAddress}.${getComponentsAddress}`,
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
   * Recursively sweeps component map to find all leaves.
   * @param object 
   * @param parentName 
   * @param found 
   */
  buildModuleList(object, parentName = '', found = []) {
    return Object.keys(object).reduce((acc, cur) => {
      if (typeof object[cur] === "undefined") return acc;

      if (Object.keys(object[cur]).length > 0) {
        return this.buildModuleList(
          object[cur],
          parentName === '' ? cur : `${parentName}/${cur}`,
          acc
        );
      }

      acc.push(`${parentName}/${cur}`);
      return acc;
    }, found);
  }

  /**
   * Ask the SSR service for what components can be
   * rendered
   * @param message
   */
  onComponentMapRequest(message) {
    message.reply(
      this.buildModuleList(this.componentMap.components)
    );
  }

  /**
   * Implement in subclasses for your SPA framework.
   * @param message
   */
  renderComponent(message) {
    throw new TypeError("Children must implement renderComponent()");
  }
}