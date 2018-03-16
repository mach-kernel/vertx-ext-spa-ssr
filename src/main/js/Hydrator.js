import React from 'react';
import ReactDOM from 'react-dom';

export class Hydrator {
  constructor(componentMap) {
    this.componentMap = componentMap;
    this.hydrate();
  }

  hydrate() {
    document.querySelectorAll("div[id^=cmpnt-").forEach((element) => {
      let component = this.componentMap[element.getAttribute('react-kind')];

      ReactDOM.hydrate(
        React.createElement(component, window.ssrState[element.id]),
        element
      );
    });
  }
}