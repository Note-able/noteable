'use strict';

const React = require(`react`);

module.exports = class Register extends React.Component {
  facebookLogin () {
    window.location.href = `auth/facebook`;
  }
  render () {
    return(
      <div className="register-container">
        <div className="register-container__header">Sign In</div>
        <form className="register-form">
          <input className="register-form__username" name="username" placeholder="Username"/>
          <input className="register-form__password" name="password" type="password" placeholder="Password"/>
          <input className="register-form__password__verify" name="verification" type="password" placeholder="Verify your password"/>
          <input className="register-form__submit-button" type="submit"/>
        </form>
        <div className="button-container">
          <button className="button-container__submit-button" onClick={this.facebookLogin}>Sign up with Facebook</button>
        </div>
        <div className="button-container">
          <div className="button-container__open-register" onClick={() => this.props.switchToLogin()}>Signin</div>
        </div>
      </div>
    );
  }
}
