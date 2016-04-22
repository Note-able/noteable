'use strict';

const React = require(`react`);
const Router = require('react-router');
const Home = require('./home');

module.exports = class AppController extends React.Component {
  componentDidMount() {
    if (this.props.route.isLoggedIn === `true` && this.props.location.pathname !== '/') {
      window.location.href = '/';
    }
  }

  renderHome() {
    return (
      <Home />
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
        { this.props.location.pathname === '/' ? this.renderHome() : this.props.children }
      </div>
    );
  }
}
