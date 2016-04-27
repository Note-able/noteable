'use strict';

const React = require(`react`);
const ReactDOM = require('react-dom');

module.exports = class Login extends React.Component {
  constructor(props) {
    super(props);

    this.login = this._login.bind(this);
  }

  componentDidMount() {
    ReactDOM.findDOMNode(this.refs.submit).onclick = () => {
      this.login();
      return false;
    }
  }

  facebookLogin () {
    window.location.href = `auth/facebook`;
  }

  _login() {
    window.location.href = `auth/local?username=${ReactDOM.findDOMNode(this.refs.email).value}&password=${ReactDOM.findDOMNode(this.refs.password).value}`;
  }

  render () {
    return(
      <div className="login-container">
        <div className="login-container__header">Sign In</div>
        <form className="signin-form">
          <input className="signin-form__username" name="email" placeholder="Email" ref="email"/>
          <input className="signin-form__password" name="password" type="password" placeholder="Password" ref="password"/>
          <input className="signin-form__submit-button" type="submit" ref="submit"/>
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
