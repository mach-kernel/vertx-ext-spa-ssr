'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AbstractSPARenderVerticle = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ComponentMap = require('./ComponentMap');

var _ComponentMap2 = _interopRequireDefault(_ComponentMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Thin "interface" for SPA render support.
 */
var AbstractSPARenderVerticle = exports.AbstractSPARenderVerticle = function () {
  /**
   * Create a new SPA render service.
   * @param componentMap
   * @param consumerAddress
   */
  function AbstractSPARenderVerticle(componentMap) {
    var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, AbstractSPARenderVerticle);

    this.settings = Object.assign({
      baseAddress: 'vertx.ext.spa',
      ssrAddress: 'ssr',
      getComponentsAddress: 'get_components'
    }, settings);

    this.componentMap = new _ComponentMap2.default(componentMap);

    var _settings = this.settings,
        baseAddress = _settings.baseAddress,
        ssrAddress = _settings.ssrAddress,
        getComponentsAddress = _settings.getComponentsAddress;


    vertx.eventBus().consumer(baseAddress + '.' + ssrAddress, this.onRenderRequest.bind(this));
    vertx.eventBus().consumer(baseAddress + '.' + getComponentsAddress, this.onComponentMapRequest.bind(this));

    this.vertxLogger = Java.type("io.vertx.core.logging.LoggerFactory").getLogger("vertx-ext-spa-ssr");

    this.vertxLogger.info("SSR verticle ready!");
  }

  /**
   * vert.x event bus handler.
   * @param message
   */


  _createClass(AbstractSPARenderVerticle, [{
    key: 'onRenderRequest',
    value: function onRenderRequest(message) {
      var _message$body = message.body(),
          name = _message$body.name;

      if (typeof name !== 'string') return message.fail(1, 'Message name missing!');

      this.renderComponent(message);
    }

    /**
     * Recursively sweeps component map to find all leaves.
     * @param object 
     * @param parentName 
     * @param found 
     */

  }, {
    key: 'buildModuleList',
    value: function buildModuleList(object) {
      var _this = this;

      var parentName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var found = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

      return Object.keys(object).reduce(function (acc, cur) {
        if (!object[cur]) return acc;

        if (Object.keys(object[cur]).length > 0) {
          return _this.buildModuleList(object[cur], parentName === '' ? cur : parentName + '/' + cur, acc);
        }

        acc.push(parentName + '/' + cur);
        return acc;
      }, found);
    }

    /**
     * Adds extra HTML attributes the hydrator uses to find
     * components on page.
     * @param domString 
     * @param componentName
     * @param token
     */

  }, {
    key: 'decorateRenderedComponent',
    value: function decorateRenderedComponent(domString, componentName, token) {
      var domPieces = domString.split(" data-reactroot");
      domPieces.splice(1, 0, "data-reactroot");
      domPieces.splice(1, 0, 'cmpnt-kind="' + componentName + '"');
      domPieces.splice(1, 0, 'id="cmpnt-' + token + '"');
      return domPieces.join(" ");
    }

    /**
     * Ask the SSR service for what components can be
     * rendered
     * @param message
     */

  }, {
    key: 'onComponentMapRequest',
    value: function onComponentMapRequest(message) {
      message.reply(this.buildModuleList(this.componentMap.components));
    }

    /**
     * Implement in subclasses for your SPA framework.
     * @param message
     */

  }, {
    key: 'renderComponent',
    value: function renderComponent(message) {
      throw new TypeError("Children must implement renderComponent()");
    }
  }]);

  return AbstractSPARenderVerticle;
}();