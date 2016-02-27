'use strict';

const React = require(`react`);
const Router = require('react-router');
const Login = require(`./auth/login`);
const Register = require('./auth/register');

module.exports = class SigninController extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isRegistering: false
    }
  }
  toggleDialog() {
    this.setState({
      isRegistering: !this.state.isRegistering
    });
  }
  render() {
    return (
      <div className="auth-container" style={ this.state.isRegistering ? {height: '350px'} : {height: '300px'}}>
        { this.state.isRegistering ? <Register switchToLogin={() => this.toggleDialog()}/> : <Login switchToRegister={() => this.toggleDialog()}/> }
      </div>
    );
  }
}
