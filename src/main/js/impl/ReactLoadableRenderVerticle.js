import { AbstractSPARenderVerticle } from '../AbstractSPARenderVerticle';

import React from 'react';
import ReactDOMServer from 'react-dom/server';

import Loadable from 'react-loadable';


// TRY REGULAR SSR WITH THE LOADABLE ON CLIENTSIDE


export class ReactLoadableRenderVerticle extends AbstractSPARenderVerticle {
  /**
   * Render a React component
   *
   * TODO: Support children
   * @param message vert.x event bus message
   * @param name Component name
   * @param props Component props
   */
  renderComponent(message) {
    console.log("RECV REQUEST");
    console.log(message);

    let { name, props } = message.body();
    if (typeof props !== 'object')
      return message.fail(2, 'Props must be object!');

    let relevantBundles = Object.keys(this.settings.reactLoadableStats).find(
      (k) => k.includes(name)
    )
    
    let resolved = this.componentMap.resolveComponent(name);
    if (!resolved) return message.fail(3, 'Component not found!');
    let element = React.createElement(resolved, props);

    message.reply({
      DOM: ReactDOMServer.renderToString(element),
      bundleMeta: this.settings.reactLoadableStats[relevantBundles]
    });
  }
}