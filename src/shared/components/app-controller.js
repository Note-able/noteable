'use strict';

var React = require('react');
var Router = require('react-router');
var Login = require('./login/login');
var Logout = require('./login/logout');

module.exports = class AppController extends React.Component {
  renderLogin() {
    return (
      <Login/>
    );
  }
  renderLogout() {
    return (
      <Logout/>
    );
  }
  renderGrid() {
    return (
      <div>
        <div className='testing-vertical'></div>
        <div className='testing-horizontal'></div>
      </div>
    );
  }
  render() {
    return(
      <div>
        <link href='/css/bundle.css' rel='stylesheet' type='text/css'/>
        <div className=''>
          { this.props.route.isLoggedIn === 'false' ? this.renderLogin() : this.renderLogout()}
          { this.props.children }
        </div>
      </div>
    );
  }
}
