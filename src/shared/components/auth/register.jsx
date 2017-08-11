import React, { Component, PropTypes } from 'react';
import { validateEmail, validatePassword } from '../../../util/util';
import styles from './styles.less';

import { fetchJson } from '../helpers/request';

export default class Register extends Component {
  static propTypes = {
    switchToLogin: PropTypes.func.isRequired,
  };

  state = {
    registerFailed: false,
  };

  facebookLogin = () => {
    window.location.href = 'auth/facebook';
  }

  updateForm() {
    this.setState({
      email: this._email.value,
      password: this._password.value,
      firstName: this._firstName.value,
      lastName: this._lastName.value,
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
    const firstName = this.state.firstName;
    const lastName = this.state.lastName
    const email = this.state.email;

    if (!this.state.validEmail || !this.state.validPassword) {
      this.setState({
        registerFailed: !this.state.validEmail ? 'Invalid email.' : 'Invalid password. Password must consist of',
      });
      return;
    }

    ajax.post('/api/v1/register', { email, password, firstName, lastName })
      .then(() =>
      ajax.post('auth/local', { username: this.state.email, password: this.state.password }).then(
        (junk, response) => {
          if (response.status === 200) {
            window.location = '/profile/create';
            return;
          }
        }))
      .catch((error) => {
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
