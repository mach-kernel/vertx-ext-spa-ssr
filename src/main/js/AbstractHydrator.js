import React from 'react';
import ReactDOM from 'react-dom';

export class AbstractHydrator {
  /**
   * Create a client-side hydration stub
   *
   * @param componentMap
   * @param settings
   */
  constructor(componentMap, settings = {}) {
    this.componentMap = componentMap;
    this.hydrate();
  }

  settings = {
    domComponentIdPrefix: 'cmpnt',
    querySelector: `div[id^=${this.settings.domComponentIdPrefix}-`,
    componentKind: `${this.settings.domComponentIdPrefix}-kind`
  };

  hydrate() {
    document.querySelectorAll(this.settings.querySelector).forEach((element) => {
      let component = this.componentMap[element.getAttribute(this.settings.componentKind)];

      attachToComponent(component, element);
    });
  }

  /**
   * Attach client-side SPA library to its DOM
   *
   * @param component
   * @param element
   */
  attachToComponent(component, element) {
    throw new TypeError("Children must implement attachToComponent()");
  }
}