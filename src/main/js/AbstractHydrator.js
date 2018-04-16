import ComponentMap from './ComponentMap'

export class AbstractHydrator {
  /**
   * Create a client-side hydration stub
   *
   * @param componentMap
   * @param settings
   */
  constructor(componentMap, settings = {}) {
    this.componentMap = new ComponentMap(componentMap);

    this.settings = {
      domComponentIdPrefix: 'cmpnt',
      ssrStateName: '_ssrState'
    };

    Object.assign(this.settings, {
      querySelector: `div[id^=${this.settings.domComponentIdPrefix}-`,
      componentKind: `${this.settings.domComponentIdPrefix}-kind`
    });

    Object.assign(this.settings, settings);
    if (!window[this.settings.ssrStateName]) window[this.settings.ssrStateName] = {};

    this.hydrate();
  }

  /**
   * Hydrate components on page
   */
  hydrate() {
    document.querySelectorAll(this.settings.querySelector).forEach((element) => {
      let kind = element.getAttribute(this.settings.componentKind);
      let component = this.componentMap.resolveComponent(kind);

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