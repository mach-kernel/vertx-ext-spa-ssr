'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReactLoadableRenderVerticle = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AbstractSPARenderVerticle = require('../AbstractSPARenderVerticle');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _reactLoadable = require('react-loadable');

var _reactLoadable2 = _interopRequireDefault(_reactLoadable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// TRY REGULAR SSR WITH THE LOADABLE ON CLIENTSIDE


var ReactLoadableRenderVerticle = exports.ReactLoadableRenderVerticle = function (_AbstractSPARenderVer) {
  _inherits(ReactLoadableRenderVerticle, _AbstractSPARenderVer);

  function ReactLoadableRenderVerticle() {
    _classCallCheck(this, ReactLoadableRenderVerticle);

    return _possibleConstructorReturn(this, (ReactLoadableRenderVerticle.__proto__ || Object.getPrototypeOf(ReactLoadableRenderVerticle)).apply(this, arguments));
  }

  _createClass(ReactLoadableRenderVerticle, [{
    key: 'renderComponent',

    /**
     * Render a React component
     *
     * TODO: Support children
     * @param message vert.x event bus message
     * @param name Component name
     * @param props Component props
     */
    value: function renderComponent(message) {
      var _this2 = this;

      var _message$body = message.body(),
          name = _message$body.name,
          props = _message$body.props;

      if ((typeof props === 'undefined' ? 'undefined' : _typeof(props)) !== 'object') return message.fail(2, 'Props must be object!');

      var bundleMeta = Object.keys(this.settings.reactLoadableStats).reduce(function (acc, cur) {
        if (cur.includes(name)) acc.push(_this2.settings.reactLoadableStats[cur]);
        return acc;
      }, []);

      var resolved = this.componentMap.resolveComponent(name);
      if (!resolved) return message.fail(3, 'Component not found!');
      var element = _react2.default.createElement(resolved, props);

      var dom = _server2.default.renderToString(element);

      message.reply({
        DOM: this.decorateRenderedComponent(dom, name, "foo"),
        bundleMeta: bundleMeta
      });
    }
  }]);

  return ReactLoadableRenderVerticle;
}(_AbstractSPARenderVerticle.AbstractSPARenderVerticle);