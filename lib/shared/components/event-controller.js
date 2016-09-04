'use strict';

const React = require(`react`);
const Router = require('react-router');
const Register = require('./auth/register');

module.exports = class EventController extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return React.createElement(
      'div',
      { className: 'event-controller-container' },
      this.props.children
    );
  }
};