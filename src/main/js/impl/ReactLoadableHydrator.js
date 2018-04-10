import React from 'react';
import ReactDOM from 'react-dom';

import { AbstractHydrator } from '../AbstractHydrator';

export class ReactLoadableHydrator extends AbstractHydrator {
  attachToComponent(component, element) {
    component.preload().then(() => {
      ReactDOM.hydrate(
        React.createElement(component, window[this.settings.ssrStateName][element.id]),
        element
      );
    })
  }
}