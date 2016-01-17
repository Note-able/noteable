'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require("react");
var Router = require("react-router");

module.exports = function (_React$Component) {
  _inherits(Login, _React$Component);

  function Login() {
    _classCallCheck(this, Login);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Login).apply(this, arguments));
  }

  _createClass(Login, [{
    key: "checkLoginState",
    value: function checkLoginState() {
      FB.getLoginStatus(function (response) {
        if (response.status === 'not_authorized') {
          alert('Login failed, please try again.');
        } else {
          window.location.href = '/success';
        }
      });
    }
  }, {
    key: "login",
    value: function login() {
      FB.login(this.checkLoginState, { scope: 'public_profile, email' });
    }
  }, {
    key: "loginTry",
    value: function loginTry() {
      /**var xhr = new XMLHttpRequest();
      xhr.onload = function(response) {
      if (response.status == 200) {
      console.log('wow');
      }
      }
      xhr.open('GET', '/auth/facebook', true);
      xhr.send(null);**/
      window.location.href = '/auth/facebook';
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "login-container" },
        React.createElement("input", { className: "login-container__username" }),
        React.createElement("input", { className: "login-container__password" }),
        React.createElement(
          "button",
          { className: "login-container__submit-button", onClick: this.loginTry.bind(this) },
          "Login to Facebook"
        )
      );
    }
  }]);

  return Login;
}(React.Component);