import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { validateEmail, validatePassword } from '../../../util/util';
import styles from './styles.less';

import { fetchJson } from '../helpers/request';

export default class Register extends Component {
  static propTypes = {
    switchToLogin: PropTypes.func.isRequired,
    onLogin: PropTypes.func.isRequired,
  };

  state = {
    registerFailed: false,
  };

  facebookLogin = () => {
    window.location.href = 'auth/facebook';
  }

  validateFields() {
    this.setState({
      validEmail: validateEmail(this.state.email || ''),
      validPassword: validatePassword(this.state.password || ''),
    });
  }

  registerUser() {
    const { password, email, firstName, lastName, validEmail, validPassword } = this.state;

    if (validEmail || validPassword) {
      this.setState({
        registerFailed: !this.state.validEmail ? 'Invalid email.' : 'Invalid password. Password must consist of',
      });
      return;
    }

    fetchJson('/api/v1/register', { method: 'POST', body: { email, password, firstName, lastName } })
    .then(() => {
      fetchJson('auth/local', { method: 'POST', body: { username: this.state.email, password: this.state.password } })
      .then(() => {
        window.location.reload();
      });
    }).catch((error) => {
      this.setState({
        registerFailed: 'An account with that email already exists.',
      });
    });
  }

  render() {
    return (
      <div className={styles.registerContainer}>
        <div className={styles.registerForm}>
          { this.state.registerFailed != null && this.state.registerFailed !== '' ? <div className="register-form__error-message">{this.state.registerFailed}</div> : null}
          <input className={styles.email} name="email" onChange={(event) => { this.setState({ email: event.target.value }); }} placeholder="Email" />
          <input className={styles.password} name="password" onChange={(event) => { this.setState({ password: event.target.value }); }} type="password" placeholder="Password" />
          <input className={styles.firstname} name="firstname" onChange={(event) => { this.setState({ firstName: event.target.value }); }} type="text" placeholder="First name" />
          <input className={styles.lastname} name="lastname" onChange={(event) => { this.setState({ lastName: event.target.value }); }} type="text" placeholder="Last name" />
          <button className={styles.openRegister} onClick={() => this.registerUser()}>Submit</button>
          <button className={styles.facebookButton} onClick={() => this.facebookLogin()}>Sign up with Facebook</button>
          <div className={styles.signinOr}>or</div>
          <div className={styles.buttonContainer}>
            <button className={styles.submitButton} onClick={() => this.props.switchToLogin()}>Sign in</button>
          </div>
        </div>
      </div>
    );
  }
}
