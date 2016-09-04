'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const Router = require('react-router');
const GoogleMaps = require('google-maps');
const EventsListView = require('./events-list-view');
const EventsMapView = require('./events-map-view');
const ajax = require('../../ajax');
let Google;

const left = { left: 0 };
const right = { right: 0 };

module.exports = class BrowseEvents extends React.Component {
  constructor(props) {
    super(props);

    this.selectListView = this._selectListView.bind(this);
    this.selectMapView = this._selectMapView.bind(this);

    this.state = {
      mode: 'list',
      events: [],
      position: null
    };
  }

  componentDidMount() {
    if (this.state.events.length !== 0) {
      return;
    }

    navigator.geolocation.getCurrentPosition(position => {
      ajax.Get(`/api/events/nearby?lat=${ position.coords.latitude }&lng=${ position.coords.longitude }&radius=50`, response => {
        this.setState({
          events: JSON.parse(response),
          position: position
        });
      });
    });
  }

  _selectListView() {
    this.setState({
      mode: 'list'
    });
  }

  _selectMapView() {
    this.setState({
      mode: 'map'
    });
  }

  renderView() {
    if (this.state.mode === 'list') {
      return React.createElement(
        'div',
        { className: 'events-list-container' },
        React.createElement(EventsListView, { events: this.state.events })
      );
    }

    return React.createElement(
      'div',
      { className: 'events-map-container' },
      React.createElement(EventsMapView, { events: this.state.events })
    );
  }

  render() {
    return React.createElement(
      'div',
      { className: 'events-container' },
      React.createElement(
        'div',
        { className: 'view-toggle-bar' },
        React.createElement(
          'div',
          { className: 'toggle' },
          React.createElement(
            'div',
            { className: 'toggle__option list-view', onClick: this.selectListView },
            'List'
          ),
          React.createElement(
            'div',
            { className: 'toggle__option map-view', onClick: this.selectMapView },
            'Map'
          ),
          React.createElement('div', { className: 'toggle__option highlight', style: this.state.mode === 'list' ? left : right })
        )
      ),
      React.createElement(
        'div',
        { className: 'events-view' },
        this.renderView()
      )
    );
  }
};