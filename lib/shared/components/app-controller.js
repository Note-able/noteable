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
    return React.createElement(Home, null);
  }

  renderGrid() {
    return React.createElement(
      'div',
      null,
      React.createElement('div', { className: 'testing-vertical' }),
      React.createElement('div', { className: 'testing-horizontal' })
    );
  }

  render() {
    return React.createElement(
      'div',
      null,
      React.createElement('link', { href: '/css/bundle.css', rel: 'stylesheet', type: 'text/css' }),
      this.props.location.pathname === '/' ? this.renderHome() : this.props.children
    );
  }
};