import React, { Component, PropTypes } from 'react';
import ajax from '../../ajax';
import { KeyCodes } from '../helpers/keyCodes';

module.exports = class Login extends Component {
  static propTypes = {
    switchToRegister: PropTypes.func.isRequired,
  };

  state = {
    emaill: '',
    password: '',
    loginFailed: false,
  }

  componentDidMount() {
    this._email.focus();
  }

  login() {
    ajax.postOld(`auth/local?username=${this.state.email}&password=${this.state.password}`,
      null,
      (junk, response) => {
        if (response.status === 200) {
          window.location = '/profile/create';
          return;
        }

        this.setState({
          loginFailed: true,
        });
      });
  }

  keyDown(event) {
    if (event.keyCode === KeyCodes.enter) {
      this.login();
    }
  }

  updateForm() {
    this.setState({
      email: this._email.value,
      password: this._password.value,
    });
  }

  render() {
    return (
      <div className="login-container">
        <div className="login-container__header">Sign In</div>
        <div className="signin-form">
          { this.state.loginFailed ? <div className="signin-form__error-message">Invalid username or password</div> : null }
          <input className="signin-form__username" name="email" onKeyDown={(event) => this.keyDown(event)} onChange={() => this.updateForm()} placeholder="Email" ref={ref => { this._email = ref; }} />
          <input className="signin-form__password" name="password" onKeyDown={(event) => this.keyDown(event)} onChange={() => this.updateForm()} type="password" placeholder="Password" ref={ref => { this._password = ref; }} />
          <button className="signin-form__submit-button" onClick={() => this.login()}>Submit</button>
        </div>
        <div className="button-container">
          <a href="auth/facebook"><button className="button-container__submit-button" onClick={() => this.facebookLogin()}>Login with Facebook</button></a>
        </div>
        <div className="button-container">
          <div className="button-container__open-register" onClick={() => this.props.switchToRegister()}>Create an account</div>
        </div>
      </div>
    );
  }
};