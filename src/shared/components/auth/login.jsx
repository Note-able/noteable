import React, { Component, PropTypes } from 'react';
import ajax from '../../ajax';
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

  login() {
    ajax.postOld(`auth/local?username=${this.state.email}&password=${this.state.password}`,
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
      <div className={styles.loginContainer}>
        <div className={styles.loginContainerHeader}>Sign In</div>
        <div className={styles.signinForm}>
          { this.state.loginFailed ? <div className={styles.signinFormErrorMessage}>Invalid username or password</div> : null }
          <input className={styles.signinFormUsername} name="email" onKeyDown={(event) => this.keyDown(event)} onChange={() => this.updateForm()} placeholder="Email" ref={ref => { this._email = ref; }} />
          <input className={styles.signinFormPassword} name="password" onKeyDown={(event) => this.keyDown(event)} onChange={() => this.updateForm()} type="password" placeholder="Password" ref={ref => { this._password = ref; }} />
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