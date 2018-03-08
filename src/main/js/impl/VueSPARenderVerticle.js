import { AbstractSPARenderVerticle } from '../AbstractSPARenderVerticle';

import Vue from 'vue';
import VueServerRenderer from 'vue-server-renderer';

export class VueSPARenderVerticle extends AbstractSPARenderVerticle {
  /**
   * Create a Vue SPA render service.
   * @param componentMap
   */
  constructor(componentMap) {
    super(componentMap);
    this.renderer = VueServerRenderer.createRenderer();
  }

  /**
   * Render a Vue component
   * @param message
   */
  renderComponent(message) {
    let { name, data, el } = message.body();

    if (typeof data !== 'object')
      return message.fail(2, 'Data must be object!');

    let resolved = this.componentMap[name];
    if (typeof resolved === 'undefined')
      return message.fail(3, 'Component not found!');

    if (typeof el !== 'string')
      el = Java.type('UUID').randomUUID().toString();

    // TODO: finish this
  }
}