import React, { Component, PropTypes } from 'react';
import Home from './home.jsx';
import './app-styles/app-controller.less';

module.exports = class AppController extends Component {
  static propTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }),
    children: PropTypes.object,
  }

  renderHome() {
    return (
      <Home />
    );
  }

  renderGrid() {
    return (
      <div>
        <div className="testing-verticals" />
        <div className="testing-horizontal" />
      </div>
    );
  }

  render() {
    return (
      <div>
        <link href="/css/bundle.css" rel="stylesheet" type="text/css" />
        <link href="https://fonts.googleapis.com/css?family=Lobster" rel="stylesheet" />
        { this.props.location.pathname === '/' ? this.renderHome() : this.props.children}
      </div>
    );
  }
};
