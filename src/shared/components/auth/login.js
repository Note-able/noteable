'use strict';

const React = require(`react`);

module.exports = class Login extends React.Component {
  facebookLogin () {
    window.location.href = `auth/facebook`;
  }
  render () {
    return(
      <div className="login-container">
        <div className="login-container__header">Sign In</div>
        <form className="signin-form">
          <input className="signin-form__username" name="username" placeholder="Username"/>
          <input className="signin-form__password" name="password" type="password" placeholder="Password"/>
          <input className="signin-form__submit-button" type="submit"/>
        </form>
        <div className="button-container">
          <button className="button-container__submit-button" onClick={this.facebookLogin}>Login with Facebook</button>
        </div>
        <div className="button-container">
          <div className="button-container__open-register" onClick={() => this.props.switchToRegister()}>Create an account</div>
        </div>
      </div>
    );
  }
}
