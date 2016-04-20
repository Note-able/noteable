'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const Router = require('react-router');
let Google;

module.exports = class Event extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      event: props.event
    };
  }

  render() {
    return (
      <div className="event-container">
        <span>{this.state.event.name}</span>
        <span>{this.state.event.latitude}+{this.state.event.longitude}</span>
        <span>{this.state.event.notes}</span>
      </div>
    );
  }
};