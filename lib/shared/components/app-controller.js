'use strict';

const React = require(`react`);
const Router = require('react-router');
const Home = require('./home');

import { appReducer } from '../reducers';
import { compose, applyMiddleware, Provider } from 'redux';
import thunk from 'redux-thunk';

module.exports = class AppController extends React.Component {

  componentDidMount() {
    if (this.props.route.isLoggedIn === `true` && this.props.location.pathname !== '/') {
      window.location.href = '/';
    }
  }

  renderApp() {
    return this.props.children;
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
      React.createElement('link', { href: 'https://fonts.googleapis.com/css?family=Lobster', rel: 'stylesheet' }),
      this.props.location.pathname === '/' ? this.renderHome() : this.renderApp()
    );
  }
};