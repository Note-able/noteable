'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const Router = require('react-router');
const ajax = require('../../ajax');
let Google;

module.exports = class EventsListView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(position => {
      ajax.Get(`/api/events/nearby?lat=${position.latitude}&lng=${position.longitude}&radius=50`)
    });
  }
  render() {
    return ();
  }
};