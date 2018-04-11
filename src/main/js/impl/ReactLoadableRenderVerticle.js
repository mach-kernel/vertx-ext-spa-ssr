import { AbstractSPARenderVerticle } from '../AbstractSPARenderVerticle';

import React from 'react';
import ReactDOMServer from 'react-dom/server';

import Loadable from 'react-loadable';

export class ReactLoadableRenderVerticle extends AbstractSPARenderVerticle {
  constructor(componentMap, settings = {}) {
    super(componentMap, settings);
    this.settings = Object.assign({
      decorateComponent: true
    }, this.settings);
  }

  /**
   * Render a React component
   * @param message
   */
  renderComponent(message) {
    let { name, props, token = "" } = message.body();
    if (typeof props !== 'object')
      return message.fail(2, 'Props must be object!');

    let bundleMeta = Object.keys(this.settings.reactLoadableStats).reduce((acc, cur) => {
      if (cur.includes(name)) acc.push(this.settings.reactLoadableStats[cur]);
      return acc;
    }, [])
    
    let resolved = this.componentMap.resolveComponent(name);
    if (!resolved) return message.fail(3, 'Component not found!');
    let element = React.createElement(resolved, props);

    let dom = ReactDOMServer.renderToString(element);
    if (this.settings.decorateComponent) dom = this.decorateRenderedComponent(dom, name, token);

    message.reply({
      DOM: dom,
      bundleMeta: bundleMeta
    });
  }
}