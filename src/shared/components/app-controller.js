'use strict';

const React = require(`react`);
const Router = require('react-router');
const Home = require('./home');

import { appReducer } from '../reducers';
import { compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

module.exports = class AppController extends React.Component {

  store = {

  }

  componentDidMount() {
    if (this.props.route.isLoggedIn === `true` && this.props.location.pathname !== '/') {
      window.location.href = '/';
    }
  }

  renderApp() {
    return (
      <div>
        {this.props.children}
      </div>
    );
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
    return (
      <div>
        <link href="/css/bundle.css" rel="stylesheet" type="text/css"/>
        <link href="https://fonts.googleapis.com/css?family=Lobster" rel="stylesheet" />
        { this.props.location.pathname === '/' ? this.renderHome() : this.renderApp()}
      </div>
    );
  }
}
