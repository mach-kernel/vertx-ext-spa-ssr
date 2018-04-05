"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AbstractSPARenderVerticle = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ComponentMap = require("./ComponentMap");

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
    var consumerAddress = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "vertx.ext.spa.ssr";

    _classCallCheck(this, AbstractSPARenderVerticle);

    this.componentMap = new _ComponentMap2.default(componentMap);
    vertx.eventBus().consumer(consumerAddress, this.onRenderRequest.bind(this));

    this.vertxLogger = Java.type("io.vertx.core.logging.LoggerFactory").getLogger("vertx-ext-spa-ssr");

    this.vertxLogger.info("SSR verticle ready!");
  }

  /**
   * vert.x event bus handler.
   * @param message
   */


  _createClass(AbstractSPARenderVerticle, [{
    key: "onRenderRequest",
    value: function onRenderRequest(message) {
      var _message$body = message.body(),
          name = _message$body.name;

      if (typeof name !== 'string') return message.fail(1, 'Message name missing!');

      this.renderComponent(message);
    }

    /**
     * Implement in subclasses for your SPA framework.
     * @param message
     */

  }, {
    key: "renderComponent",
    value: function renderComponent(message) {
      throw new TypeError("Children must implement renderComponent()");
    }
  }]);

  return AbstractSPARenderVerticle;
}();