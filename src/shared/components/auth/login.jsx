import React, { Component, PropTypes } from 'react';
import { fetchJson } from '../helpers/request';
import { KeyCodes } from '../helpers/keyCodes';
import styles from './styles.less';

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

  facebookLogin = () => {
    window.location.href = 'auth/facebook';
  }

  login() {
    const { email, password } = this.state;
    fetchJson('auth/local', { method: 'POST', body: { email, password } })
    .then((response) => {
      this.setState({ user: response });
    })
    .catch((error) => {
      console.log(error);
      this.setState({ loginFailed: true });
    });
  }

  keyDown = (event) => {
    if (event.keyCode === KeyCodes.enter) {
      this.login();
    }
  }

  focusPassword = (event) => {
    if (event.keyCode === KeyCodes.enter) {
      this._password.focus();
    }
  }

  render() {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginContainerHeader}>Sign In</div>
        <div className={styles.signinForm}>
          { this.state.loginFailed ? <div className={styles.signinFormErrorMessage}>Invalid username or password</div> : null }
          <input
            className={styles.signinFormUsername}
            name="email"
            onKeyDown={(event) => this.focusPassword}
            onChange={(event) => { this.setState({ email: event.target.value }); }}
            placeholder="Email"
            ref={(ref) => { this._email = ref; }}
          />
          <input
            className={styles.signinFormPassword}
            name="password"
            onKeyDown={(event) => this.keyDown}
            onChange={(event) => { this.setState({ password: event.target.value }); }}
            type="password"
            placeholder="Password"
            ref={(ref) => { this._password = ref; }}
          />
          <button className={styles.signinFormSubmitButton} onClick={() => this.login()}>Submit</button>
        </div>
        <div className={styles.buttonContainer}>
          <a href="auth/facebook"><button className={styles.buttonContainerSubmitButton} onClick={() => this.facebookLogin()}>Login with Facebook</button></a>
        </div>
        <div className={styles.buttonContainer}>
          <div className={styles.buttonContainerOpenRegister} onClick={() => this.props.switchToRegister()}>Create an account</div>
        </div>
      </div>
    );
  }
};