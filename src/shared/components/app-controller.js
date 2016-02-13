'use strict';

const React = require(`react`);
const Router = require('react-router');
const Login = require(`./login/login.js`);
const Logout = require(`./login/logout.js`);

module.exports = class AppController extends React.Component {
  componentDidMount() {
    if (this.props.route.isLoggedIn === `true` && this.props.location.pathname !== '/') {
      window.location.href = '/';
    }
  }
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
        <div className="testing-vertical"></div>
        <div className="testing-horizontal"></div>
      </div>
    );
  }
  render() {
    return(
      <div>
        <link href="/css/bundle.css" rel="stylesheet" type="text/css"/>
        <div>
          { this.props.location.pathname === '/' ? this.renderLogin() : null }
          { this.props.route.isLoggedIn === `false` ? null : this.renderLogout()}
          { this.props.route.isLoggedIn === `false` ? this.props.children : null}
        </div>
      </div>
    );
  }
}
