'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReactSPARenderVerticle = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AbstractSPARenderVerticle = require('../AbstractSPARenderVerticle');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReactSPARenderVerticle = exports.ReactSPARenderVerticle = function (_AbstractSPARenderVer) {
  _inherits(ReactSPARenderVerticle, _AbstractSPARenderVer);

  function ReactSPARenderVerticle() {
    _classCallCheck(this, ReactSPARenderVerticle);

    return _possibleConstructorReturn(this, (ReactSPARenderVerticle.__proto__ || Object.getPrototypeOf(ReactSPARenderVerticle)).apply(this, arguments));
  }

  _createClass(ReactSPARenderVerticle, [{
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
      var _message$body = message.body(),
          name = _message$body.name,
          props = _message$body.props;

      if ((typeof props === 'undefined' ? 'undefined' : _typeof(props)) !== 'object') return message.fail(2, 'Props must be object!');

      var resolved = this.componentMap.resolveComponent(name);
      if (!resolved) return message.fail(3, 'Component not found!');

      var element = _react2.default.createElement(resolved, props);
      message.reply(_server2.default.renderToString(element));
    }
  }]);

  return ReactSPARenderVerticle;
}(_AbstractSPARenderVerticle.AbstractSPARenderVerticle);