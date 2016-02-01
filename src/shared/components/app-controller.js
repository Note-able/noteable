'use strict';

const React = require(`react`);

module.exports = class AppController extends React.Component {
  renderLogin () {
    return (
      <Login/>
    );
  }
  renderLogout () {
    return (
      <Logout/>
    );
  }
  renderGrid () {
    return (
      <div>
        <div className="testing-vertical"></div>
        <div className="testing-horizontal"></div>
      </div>
    );
  }
  render () {
    return(
      <div>
        <link href="/css/bundle.css" rel="stylesheet" type="text/css"/>
        <div>
          { this.props.route.isLoggedIn === `false` ? this.renderLogin() : this.renderLogout()}
          { this.props.children }
        </div>
      </div>
    );
  }
}
