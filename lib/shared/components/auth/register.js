'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

const React = require(`react`);
const ReactDOM = require('react-dom');
const ajax = require('../../ajax');

module.exports = function (_React$Component) {
  _inherits(Register, _React$Component);

  function Register(props) {
    _classCallCheck(this, Register);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Register).call(this, props));

    _this.registerUser = _this._registerUser.bind(_this);
    return _this;
  }

  _createClass(Register, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      ReactDOM.findDOMNode(this.refs.email).value = '';
      ReactDOM.findDOMNode(this.refs.password).value = '';
      ReactDOM.findDOMNode(this.refs.submit).onclick = () => {
        this.registerUser();
        return false;
      };
    }
  }, {
    key: 'facebookLogin',
    value: function facebookLogin() {
      window.location.href = `auth/facebook`;
    }
  }, {
    key: '_registerUser',
    value: function _registerUser() {
      const password = ReactDOM.findDOMNode(this.refs.password).value;
      const username = ReactDOM.findDOMNode(this.refs.username).value;
      const email = ReactDOM.findDOMNode(this.refs.email).value;

      //use diffie helman to encrypt password before sending it.
      ajax.Post('/register', JSON.stringify({ email: email, password: password, username: username }), response => {
        if (response && JSON.parse(response).name === 'error') {
          this.setState({
            registerFailed: true
          });

          return;
        }

        window.location.href = `auth/local?username=${ email }&password=${ password }`;
      });
      return false;
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'register-container' },
        React.createElement(
          'div',
          { className: 'register-container__header' },
          'Sign In'
        ),
        React.createElement(
          'form',
          { className: 'register-form' },
          React.createElement('input', { className: 'register-form__username', name: 'username', type: 'text', placeholder: 'Username', ref: 'username' }),
          React.createElement('input', { className: 'register-form__password__verify', name: 'email', placeholder: 'Email', ref: 'email' }),
          React.createElement('input', { className: 'register-form__password', name: 'password', type: 'password', placeholder: 'Password', ref: 'password' }),
          React.createElement('input', { className: 'register-form__submit-button', type: 'submit', ref: 'submit' })
        ),
        React.createElement(
          'div',
          { className: 'button-container' },
          React.createElement(
            'button',
            { className: 'button-container__submit-button', onClick: this.facebookLogin },
            'Sign up with Facebook'
          )
        ),
        React.createElement(
          'div',
          { className: 'button-container' },
          React.createElement(
            'div',
            { className: 'button-container__open-register', onClick: () => this.props.switchToLogin() },
            'Sign in'
          )
        )
      );
    }
  }]);

  return Register;
}(React.Component);