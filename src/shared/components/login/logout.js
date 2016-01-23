'use strict';

var React = require("react");
var Router = require("react-router");

module.exports = class Logout extends React.Component {
  logout () {
    var xhr = new XMLHttpRequest();
		xhr.onload = function() {
			if (this.status == 200) {
				window.location.href = '/';
			} else {
        window.alert('sorry you failed to log out');
      }
		}
		xhr.open('GET', '/logout', true);
		xhr.send(null);
  }
  render () {
    return(
      <div className='login-container'>
        <button className='login-container__submit-button' onClick={this.logout}>Logout of Facebook</button>
      </div>
    );
  }
}
