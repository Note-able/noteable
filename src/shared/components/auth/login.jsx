import React, { Component, PropTypes } from 'react';
import ajax from '../../ajax';

module.exports = class Login extends Component {
  static propTypes = {
    switchToRegister: PropTypes.func.isRequired,
  };

  state = {
    emaill: '',
    password: '',
    loginFailed: false,
  }

  login() {
    ajax.post(`auth/local?username=${this.state.email}&password=${this.state.password}`,
      null,
      (junk, response) => {
        if (response.status === 200) {
          window.location = '/profile';
          return;
        }

        this.setState({
          loginFailed: true,
        });
      });
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
          <input className="signin-form__username" name="email" onChange={() => this.updateForm()} placeholder="Email" ref={ref => { this._email = ref; }} />
          <input className="signin-form__password" name="password" onChange={() => this.updateForm()} type="password" placeholder="Password" ref={ref => { this._password = ref; }} />
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
