import { AbstractSPARenderVerticle } from '../AbstractSPARenderVerticle';

import React from 'react';
import ReactDOMServer from 'react-dom/server';

export class ReactSPARenderVerticle extends AbstractSPARenderVerticle {
  /**
   * Render a React component
   *
   * TODO: Support children
   * @param message vert.x event bus message
   * @param name Component name
   * @param props Component props
   */
  renderComponent(message) {
    let { name, props } = message.body();
    if (typeof props !== 'object')
      return message.fail(2, 'Props must be object!');

    let resolved = this.componentMap[name];
    if (typeof resolved === 'undefined')
      return message.fail(3, 'Component not found!');

    let element = React.createElement(resolved, props);
    message.reply(ReactDOMServer.renderToString(element));
  }
}