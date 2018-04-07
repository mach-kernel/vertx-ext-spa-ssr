'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VueSPARenderVerticle = undefined;

var _AbstractSPARenderVerticle = require('../AbstractSPARenderVerticle');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import Vue from 'vue';
// import VueServerRenderer from 'vue-server-renderer';

var VueSPARenderVerticle = exports.VueSPARenderVerticle = function (_AbstractSPARenderVer) {
  _inherits(VueSPARenderVerticle, _AbstractSPARenderVer);

  function VueSPARenderVerticle() {
    _classCallCheck(this, VueSPARenderVerticle);

    return _possibleConstructorReturn(this, (VueSPARenderVerticle.__proto__ || Object.getPrototypeOf(VueSPARenderVerticle)).apply(this, arguments));
  }

  return VueSPARenderVerticle;
}(_AbstractSPARenderVerticle.AbstractSPARenderVerticle);