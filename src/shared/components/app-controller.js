'use strict';

const React = require(`react`);
const Router = require('react-router');

module.exports = class AppController extends React.Component {
  componentDidMount() {
    if (this.props.route.isLoggedIn === `true` && this.props.location.pathname !== '/') {
      window.location.href = '/';
    }
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
    console.log(this.props);
    return(
      <div>
        <link href="/css/bundle.css" rel="stylesheet" type="text/css"/>
        <div>
          { this.props.children }
        </div>
      </div>
    );
  }
}
