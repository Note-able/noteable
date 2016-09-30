import React, { Component, PropTypes } from 'react';

const ajax = require('../../ajax');

module.exports = class Register extends Component {
  static propTypes = {
    switchToLogin: PropTypes.func.isRequired,
  };

  state = {
    registerFailed: false,
  };

  facebookLogin() {
    window.location.href = 'auth/facebook';
  }

  updateForm() {
    this.setState({
      email: this._email.value,
      password: this._password.value,
      user: this._username.value,
      registerFailed: false,
    });
  }

  registerUser() {
    const password = this.state.password;
    const username = this.state.username;
    const email = this.state.email;

    ajax.post('/register', JSON.stringify({ email, password, username }), (response) => {
      if (response && JSON.parse(response).name === 'error') {
        this.setState({
          registerFailed: true,
        });

        return;
      }

      ajax.post(`auth/local?username=${email}&password=${password}`, null, (stuff, resp) => {
        if (resp.status === 200) {
          window.location = '/profile';
          return;
        }

        this.setState({
          registerFailed: true,
        });
      });
    });
    return false;
  }

  render() {
    return (
      <div className="register-container">
        <div className="register-container__header">Register</div>
        <div className="register-form">
          {this.state.registerFailed ? <div className="register-form__error-message">Email already exists</div> : null}
          <input className="register-form__username" name="name" onChange={() => this.updateForm()} type="text" placeholder="Name" ref={ref => { this._username = ref; }} />
          <input className="register-form__password__verify" name="email" onChange={() => this.updateForm()} placeholder="Email" ref={ref => { this._email = ref; }} />
          <input className="register-form__password" name="password" onChange={() => this.updateForm()} type="password" placeholder="Password" ref={ref => { this._password = ref; }} />
          <button className="signin-form__submit-button" onClick={() => this.registerUser()}>Submit</button>
        </div>
        <div className="button-container">
          <button className="button-container__submit-button" onClick={() => this.facebookLogin()}>Sign up with Facebook</button>
        </div>
        <div className="button-container">
          <div className="button-container__open-register" onClick={() => this.props.switchToLogin()}>Sign in</div>
        </div>
      </div>
    );
  }
};
