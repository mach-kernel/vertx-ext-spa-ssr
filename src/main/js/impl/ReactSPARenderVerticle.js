import { AbstractSPARenderVerticle } from '../AbstractSPARenderVerticle';

import React from 'react';
import ReactDOMServer from 'react-dom/server';

import flushChunks from 'webpack-flush-chunks';
import { flushChunkNames } from 'react-universal-component/server';

export class ReactSPARenderVerticle extends AbstractSPARenderVerticle {
  constructor(componentMap, settings = {}) {
    Object.assign(settings, {
      webpackFlushChunks: {
        enabled: false,
        stats: undefined
      }
    });

    super(componentMap, settings);
  }

  /**
   * Render a React component
   *
   * @param message vert.x event bus message
   * @param name Component name
   * @param props Component props
   */
  renderComponent(message) {
    let { name, props } = message.body();
    if (typeof props !== 'object')
      return message.fail(2, 'Props must be object!');

    let resolved = this.componentMap.resolveComponent(name);
    if (!resolved) return message.fail(3, 'Component not found!');

    let element = React.createElement(resolved, props);
    let reply = {
      rendered: ReactDOMServer.renderToString(element)
    }

    if (this.settings.webpackFlushChunks.enabled) {
      const { js, styles, cssHash } = flushChunks(
        this.settings.webpackFlushChunks.stats,
        { chunkNames: flushChunkNames() }
      )

      reply = {...reply, js: js, styles: styles, cssHash: cssHash}
    }

    message.reply(reply);
  }
}