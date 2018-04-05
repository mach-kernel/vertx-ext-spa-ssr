/**
 * Component map
 */
export default class ComponentMap {
  constructor(componentMap) {
    Object.assign(this, componentMap);
  }

  /**
   * Resolve a component by its name string. Supports nested
   * components delimited by a "/"
   * @param name 
   */
  resolveComponent(name) {
    if (typeof name !== "string") return false;
    name = name.split("/");
    name.reduce((acc, chunk) => acc[chunk], this.componentMap);
  }
}