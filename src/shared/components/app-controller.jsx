import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import Home from './home.jsx';
import './app-styles/app-controller.less';

const mapStateToProps = (state) => ({
  isAuthenticated: state.profile.id !== -1,
  userId: state.profile.id,
});


class AppController extends Component {
  static propTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }),
    children: PropTypes.object,
  }

  renderHome() {
    if (window.location.pathname.indexOf('/profile') !== -1) {
      window.location.pathname = '/';
      return;
    }

    if (this.props.isAuthenticated && this.props.location.pathname !== '/home') {
      window.location.pathname = '/profile';
      return;
    }

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
        { this.props.location.pathname === '/' || this.props.location.pathname === '/home' || this.props.userId === -1 ? this.renderHome() : this.props.children}
      </div>
    );
  }
};


module.exports = connect(mapStateToProps)(AppController);