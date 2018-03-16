'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Hydrator = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Hydrator = exports.Hydrator = function () {
  function Hydrator(componentMap) {
    _classCallCheck(this, Hydrator);

    this.componentMap = componentMap;
    this.hydrate();
  }

  _createClass(Hydrator, [{
    key: 'hydrate',
    value: function hydrate() {
      var _this = this;

      document.querySelectorAll("div[id^=cmpnt-").forEach(function (element) {
        var component = _this.componentMap[element.getAttribute('react-kind')];

        _reactDom2.default.hydrate(_react2.default.createElement(component, window.ssrState[element.id]), element);
      });
    }
  }]);

  return Hydrator;
}();