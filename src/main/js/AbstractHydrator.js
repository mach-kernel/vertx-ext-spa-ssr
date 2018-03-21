export class AbstractHydrator {
  /**
   * Create a client-side hydration stub
   *
   * @param componentMap
   * @param settings
   */
  constructor(componentMap, settings = {}) {
    this.componentMap = componentMap;

    this.settings = {
      domComponentIdPrefix: 'cmpnt',
      ssrStateName: '_ssrState'
    };

    Object.assign(this.settings, {
      querySelector: `div[id^=${this.settings.domComponentIdPrefix}-`,
      componentKind: `${this.settings.domComponentIdPrefix}-kind`
    });

    Object.assign(this.settings, settings);

    this.hydrate();
  }



  hydrate() {
    document.querySelectorAll(this.settings.querySelector).forEach((element) => {
      let component = this.componentMap[element.getAttribute(this.settings.componentKind)];

      this.attachToComponent(component, element);
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