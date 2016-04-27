'use strict';

const React = require(`react`);
const ReactDOM = require('react-dom');
const ajax = require('../../ajax');

module.exports = class Register extends React.Component {
  constructor(props) {
    super(props);

    this.registerUser = this._registerUser.bind(this);
  }

  componentDidMount() {
    ReactDOM.findDOMNode(this.refs.submit).onclick = () => {
      this.registerUser();
      return false;
    }
  }

  facebookLogin () {
    window.location.href = `auth/facebook`;
  }

  _registerUser() {
    const password = ReactDOM.findDOMNode(this.refs.password).value;
    const verify = ReactDOM.findDOMNode(this.refs.verify).value;
    const email = ReactDOM.findDOMNode(this.refs.email).value;

    if (password !== verify) {
      this.setState({
        passwordMatch: false
      });
    }

    //use diffie helman to encrypt password before sending it.
    ajax.Post('/register', JSON.stringify({email: email, password: password}), (response) => {
      if (response.name === 'error') {
        this.setState({
          registerFailed: true
        });
      }

      window.location.href = `auth/local`;
    });
    return false;
  }

  render () {
    return(
      <div className="register-container">
        <div className="register-container__header">Sign In</div>
        <form className="register-form">
          <input className="register-form__username" name="email" placeholder="Email" ref="email"/>
          <input className="register-form__password" name="password" type="password" placeholder="Password" ref="password"/>
          <input className="register-form__password__verify" name="verification" type="password" placeholder="Verify your password" ref="verify"/>
          <input className="register-form__submit-button" type="submit" ref="submit"/>
        </form>
        <div className="button-container">
          <button className="button-container__submit-button" onClick={this.facebookLogin}>Sign up with Facebook</button>
        </div>
        <div className="button-container">
          <div className="button-container__open-register" onClick={() => this.props.switchToLogin()}>Register</div>
        </div>
      </div>
    );
  }
}
