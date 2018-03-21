import React from 'react';
import ReactDOM from 'react-dom';

import { AbstractHydrator } from '../AbstractHydrator';

export class ReactHydrator extends AbstractHydrator {
  attachToComponent(component, element) {
    ReactDOM.hydrate(
        React.createElement(component, window[this.settings.ssrStateName][element.id]),
        element
    );
  }
}