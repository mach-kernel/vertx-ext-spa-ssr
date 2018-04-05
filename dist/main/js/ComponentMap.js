"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Component map
 */
var ComponentMap = function () {
  function ComponentMap(componentMap) {
    _classCallCheck(this, ComponentMap);

    this.componentMap = componentMap;
  }

  /**
   * Resolve a component by its name string. Supports nested
   * components delimited by a "/"
   * @param name 
   */


  _createClass(ComponentMap, [{
    key: "resolveComponent",
    value: function resolveComponent(name) {
      if (typeof name !== "string") return false;
      name = name.split("/");
      return name.reduce(function (acc, chunk) {
        return acc[chunk];
      }, this.componentMap);
    }
  }]);

  return ComponentMap;
}();

exports.default = ComponentMap;