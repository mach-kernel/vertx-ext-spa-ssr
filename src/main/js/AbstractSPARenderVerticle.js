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
  constructor(componentMap, settings = {}) {
    this.settings = Object.assign({
      baseAddress: 'vertx.ext.spa',
      ssrAddress: 'ssr',
      getComponentsAddress: 'get_components'
    }, settings);

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
      if (!object[cur]) return acc;

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
   * Adds extra HTML attributes the hydrator uses to find
   * components on page.
   * @param domString 
   * @param componentName
   * @param token
   */
  decorateRenderedComponent(domString, componentName, token) {
    let domPieces = domString.split(" data-reactroot");
    domPieces.splice(1, 0, "data-reactroot");
    domPieces.splice(1, 0, `cmpnt-kind="${componentName}"`);
    domPieces.splice(1, 0, `id="cmpnt-${token}"`);
    return domPieces.join(" ");
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