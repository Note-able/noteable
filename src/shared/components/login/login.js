'use strict';

var React = require("react");
var Router = require("react-router");

module.exports = class Login extends React.Component {
  checkLoginState () {
   FB.getLoginStatus(function(response) {
     if (response.status === 'not_authorized') {
       alert('Login failed, please try again.');
     } else {
       window.location.href = '/success';
     }
   });
  }
  login () {
    FB.login(this.checkLoginState, {scope: 'public_profile, email'});
  }
  loginTry() {
    /**var xhr = new XMLHttpRequest();
		xhr.onload = function(response) {
			if (response.status == 200) {
				console.log('wow');
			}
		}
		xhr.open('GET', '/auth/facebook', true);
		xhr.send(null);**/
    window.location.href = '/auth/facebook';
  }
  render () {
    return(
      <div className='login-container'>
        <input className='login-container__username'/>
        <input className='login-container__password'/>
        <button className='login-container__submit-button' onClick={this.loginTry.bind(this)}>Login to Facebook</button>
      </div>
    );
  }
}
