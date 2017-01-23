import React, { Component, PropTypes } from 'react';
import { validateEmail, validatePassword } from '../../../util/util.js';
import styles from '../app-styles/auth.less';

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
      registerFailed: false,
    });

    this.validateFields();
  }

  validateFields() {
    this.setState({
      validEmail: validateEmail(this.state.email || ''),
      validPassword: validatePassword(this.state.password || ''),
    });
  }

  registerUser() {
    const password = this.state.password;
    const username = this.state.username;
    const email = this.state.email;

    if (!this.state.validEmail || !this.state.validPassword) {
      this.setState({
        registerFailed: !this.state.validEmail ? 'Invalid email.' : 'Invalid password. Password must consist of',
      });
      return;
    }

    ajax.post('/register',{ email, password, username })
      .then(() =>
        ajax.postNoBody(`auth/local?username=${email}&password=${password}`)
          .then(() => {
            window.location = '/profile/setup';
          })
          .catch(error => {
            this.props.switchToLogin();
          })
        )
      .catch(error => {
        this.setState({
          registerFailed: 'An account with that email already exists.',
        });
      });

    
    return false;
  }

  render() {
    return (
      <div className={styles.registerContainer}>
        <div className={styles.header}>Register</div>
        <div className={styles.registerForm}>
          { this.state.registerFailed != null && this.state.registerFailed !== '' ? <div className="register-form__error-message">{this.state.registerFailed}</div> : null}
          <input className={styles.email} name="email" onChange={() => this.updateForm()} placeholder="Email" ref={ref => { this._email = ref; }} />
          <input className={styles.password} name="password" onChange={() => this.updateForm()} type="password" placeholder="Password" ref={ref => { this._password = ref; }} />
          <input className={styles.firstname} name="firstname" onChange={() => this.updateForm()} type="text" placeholder="First name" ref={ref => { this._firstName = ref; }} />
          <input className={styles.lastname} name="lastname" onChange={() => this.updateForm()} type="text" placeholder="Last name" ref={ref => { this._lastName = ref; }} />
          <button className={styles.submitButton} onClick={() => this.registerUser()}>Submit</button>
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.submitButtonContainer} onClick={() => this.facebookLogin()}>Sign up with Facebook</button>
        </div>
        <div className={styles.buttonContainer}>
          <div className={styles.openRegister} onClick={() => this.props.switchToLogin()}>Sign in</div>
        </div>
      </div>
    );
  }
};
