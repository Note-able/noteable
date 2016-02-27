'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

const React = require(`react`);
const Router = require('react-router');
const Login = require(`./auth/login`);
const Register = require('./auth/register');

module.exports = function (_React$Component) {
  _inherits(SigninController, _React$Component);

  function SigninController(props) {
    _classCallCheck(this, SigninController);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SigninController).call(this, props));

    _this.state = {
      isRegistering: false
    };
    return _this;
  }

  _createClass(SigninController, [{
    key: 'toggleDialog',
    value: function toggleDialog() {
      this.setState({
        isRegistering: !this.state.isRegistering
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'auth-container', style: this.state.isRegistering ? { height: '350px' } : { height: '300px' } },
        this.state.isRegistering ? React.createElement(Register, { switchToLogin: () => this.toggleDialog() }) : React.createElement(Login, { switchToRegister: () => this.toggleDialog() })
      );
    }
  }]);

  return SigninController;
}(React.Component);