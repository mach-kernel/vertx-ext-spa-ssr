'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AbstractHydrator = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ComponentMap = require('./ComponentMap');

var _ComponentMap2 = _interopRequireDefault(_ComponentMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AbstractHydrator = exports.AbstractHydrator = function () {
  /**
   * Create a client-side hydration stub
   *
   * @param componentMap
   * @param settings
   */
  function AbstractHydrator(componentMap) {
    var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, AbstractHydrator);

    this.componentMap = new _ComponentMap2.default(componentMap);

    this.settings = {
      domComponentIdPrefix: 'cmpnt',
      ssrStateName: '_ssrState'
    };

    Object.assign(this.settings, {
      querySelector: 'div[id^=' + this.settings.domComponentIdPrefix + '-',
      componentKind: this.settings.domComponentIdPrefix + '-kind'
    });

    Object.assign(this.settings, settings);
    if (!window[this.settings.ssrStateName]) window[this.settings.ssrStateName] = {};

    this.hydrate();
  }

  /**
   * Hydrate components on page
   */


  _createClass(AbstractHydrator, [{
    key: 'hydrate',
    value: function hydrate() {
      var _this = this;

      document.querySelectorAll(this.settings.querySelector).forEach(function (element) {
        var kind = element.getAttribute(_this.settings.componentKind);
        var component = _this.componentMap.resolveComponent(kind);

        _this.attachToComponent(component, element);
      });
    }

    /**
     * Attach client-side SPA library to its DOM
     *
     * @param component
     * @param element
     */

  }, {
    key: 'attachToComponent',
    value: function attachToComponent(component, element) {
      throw new TypeError("Children must implement attachToComponent()");
    }
  }]);

  return AbstractHydrator;
}();