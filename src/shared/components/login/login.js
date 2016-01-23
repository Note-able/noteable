'use strict';

var React = require("react");
var Router = require("react-router");

module.exports = class Login extends React.Component {
  loginTry() {
    window.location.href = 'auth/facebook';
  }
  render () {
    return(
      <div className='login-container'>
        <div className='login-container__header'>Sign In</div>
        <button className='login-container__submit-button' onClick={this.loginTry}>Login to Facebook</button>
      </div>
    );
  }
}
