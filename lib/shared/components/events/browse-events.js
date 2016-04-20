'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

module.exports = function (_React$Component) {
  _inherits(BrowseEvents, _React$Component);

  function BrowseEvents(props) {
    _classCallCheck(this, BrowseEvents);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BrowseEvents).call(this, props));

    _this.selectListView = _this._selectListView.bind(_this);
    _this.selectMapView = _this._selectMapView.bind(_this);

    _this.state = {
      mode: 'list',
      events: [],
      position: null
    };
    return _this;
  }

  _createClass(BrowseEvents, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
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
  }, {
    key: '_selectListView',
    value: function _selectListView() {
      this.setState({
        mode: 'list'
      });
    }
  }, {
    key: '_selectMapView',
    value: function _selectMapView() {
      this.setState({
        mode: 'map'
      });
    }
  }, {
    key: 'renderView',
    value: function renderView() {
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
  }, {
    key: 'render',
    value: function render() {
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
  }]);

  return BrowseEvents;
}(React.Component);