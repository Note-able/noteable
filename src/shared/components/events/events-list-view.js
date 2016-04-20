'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const Router = require('react-router');
const Event = require('./event');
let Google;

module.exports = class EventsListView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="events-list-container">
        {this.props.events.map(event => {
          return (
            <Event key={event.id} event={event}/>
          );
        })}
      </div>
    );
  }
};