'use strict';

const React = require(`react`);
const ReactDOM = require('react-dom');
const ajax = require('../../ajax');

module.exports = class Register extends React.Component {
  constructor(props) {
    super(props);

    this.registerUser = this._registerUser.bind(this);
  }

  componentDidMount() {
    ReactDOM.findDOMNode(this.refs.email).value = '';
    ReactDOM.findDOMNode(this.refs.password).value = '';
    ReactDOM.findDOMNode(this.refs.submit).onclick = () => {
      this.registerUser();
      return false;
    };
  }

  facebookLogin() {
    window.location.href = `auth/facebook`;
  }

  _registerUser() {
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

  render() {
    return React.createElement(
      'div',
      { className: 'register-container' },
      React.createElement(
        'div',
        { className: 'register-container__header' },
        'Register'
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
};