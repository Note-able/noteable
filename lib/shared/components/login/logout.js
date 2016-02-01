'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

const React = require(`react`);

module.exports = function (_React$Component) {
  _inherits(Logout, _React$Component);

  function Logout() {
    _classCallCheck(this, Logout);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Logout).apply(this, arguments));
  }

  _createClass(Logout, [{
    key: "logout",
    value: function logout() {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        if (this.status === 200) {
          window.location.href = `/`;
        } else {
          window.alert(`sorry you failed to log out`);
        }
      };
      xhr.open(`GET`, `/logout`, true);
      xhr.send(null);
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "login-container" },
        React.createElement(
          "button",
          { className: "login-container__submit-button", onClick: this.logout },
          "Logout of Facebook"
        )
      );
    }
  }]);

  return Logout;
}(React.Component);