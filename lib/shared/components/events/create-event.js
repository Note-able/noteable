'use-strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

const React = require('react');
const ReactDOM = require('react-dom');
const Router = require('react-router');
const GoogleMaps = require('google-maps');
const Calendar = require('./calendar');
GoogleMaps.LIBRARIES = ['geometry', 'places', 'controls'];
const Moment = require('moment');
const ajax = require('../../ajax');
let Google;

module.exports = function (_React$Component) {
  _inherits(CreateEvent, _React$Component);

  function CreateEvent(props) {
    _classCallCheck(this, CreateEvent);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CreateEvent).call(this, props));

    _this.state = {
      loading: true,
      startDate: Moment().hour(18).minute(0),
      endDate: Moment().hour(19).minute(0),
      dateIsValid: true,
      positionSet: false,
      eventName: '',
      nameSet: false,
      notes: ''
    };

    _this.handleDateChange = _this._handleDateChange.bind(_this);
    _this.changeName = _this._changeName.bind(_this);
    _this.createEvent = _this._createEvent.bind(_this);
    return _this;
  }

  _createClass(CreateEvent, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      navigator.geolocation.getCurrentPosition(position => {
        GoogleMaps.load(google => {
          Google = google;

          const map = new Google.maps.Map(document.getElementById('map'), {
            center: { lat: position.coords.latitude, lng: position.coords.longitude },
            zoom: 10
          });

          this.setState({
            loading: false
          });

          const input = ReactDOM.findDOMNode(this.refs.searchBox);
          const searchBox = new google.maps.places.SearchBox(input);

          const autocomplete = new google.maps.places.Autocomplete(input);
          autocomplete.bindTo('bounds', map);

          //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
          // Bias the SearchBox results towards current map's viewport.
          map.addListener('bounds_changed', () => {
            searchBox.setBounds(map.getBounds());
          });

          let markers = [];
          // Listen for the event fired when the user selects a prediction and retrieve
          // more details for that place.
          searchBox.addListener('places_changed', () => {
            const places = searchBox.getPlaces();

            if (places.length === 0) {
              return;
            }

            // Clear out the old markers.
            markers.forEach(marker => {
              marker.setMap(null);
            });
            markers = [];

            // For each place, get the icon, name and location.
            const bounds = new google.maps.LatLngBounds();
            places.forEach(place => {
              const icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(30, 30)
              };

              const marker = new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
              });

              // Create a marker for each place.
              markers.push(marker);
              this.setState({
                eventLatitude: marker.map.center.lat(),
                eventLongitude: marker.map.center.lng(),
                positionSet: true
              });

              if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
              } else {
                bounds.extend(place.geometry.location);
              }
            });

            map.fitBounds(bounds);

            if (map.getZoom() > 18) {
              map.setZoom(18);
            }
          });
        });
      });
    }
  }, {
    key: '_createEvent',
    value: function _createEvent() {
      ajax.Post('/api/events/create', JSON.stringify(this.state), eventId => {
        window.location.pathname = `/api/events/${ eventId.lastval }`;
      });
    }
  }, {
    key: '_changeName',
    value: function _changeName(event) {
      if (event.target.value.trim().length === 0) {
        this.setState({
          nameSet: false
        });

        return;
      }

      this.setState({
        nameSet: true,
        eventName: event.target.value.trim()
      });
    }
  }, {
    key: '_handleDateChange',
    value: function _handleDateChange(value) {
      this.setState({
        startDate: value.startDate,
        endDate: value.endDate,
        dateIsValid: value.isValid
      });
    }
  }, {
    key: 'renderLoader',
    value: function renderLoader() {
      return React.createElement(
        'div',
        { className: 'loader' },
        React.createElement('div', { className: 'spinner' })
      );
    }
  }, {
    key: 'renderComponent',
    value: function renderComponent() {
      return React.createElement(
        'div',
        { className: 'event-form' },
        React.createElement(
          'div',
          { className: 'event-form-wrapper' },
          React.createElement(
            'label',
            { 'for': 'name' },
            'Name'
          ),
          React.createElement('input', { name: 'name', className: 'event-name', onChange: this.changeName, type: 'text', placeholder: 'Name' }),
          React.createElement(
            'label',
            null,
            'Date'
          ),
          React.createElement(Calendar, { onChange: this.handleDateChange }),
          React.createElement(
            'label',
            { 'for': 'location' },
            'Location'
          ),
          React.createElement('input', { name: 'location', className: 'map-search', ref: 'searchBox', type: 'text', placeholder: 'Search Box' }),
          React.createElement(
            'label',
            { 'for': 'notes' },
            'Notes'
          ),
          React.createElement('textarea', { name: 'notes', className: 'event-notes', type: 'text', placeholder: 'Leave a note or description.' }),
          React.createElement(
            'button',
            { className: 'submit-event', onClick: this.createEvent, disabled: this.state.positionSet && this.state.nameSet && this.state.dateIsValid ? false : 'disabled' },
            'Submit'
          )
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'create-event-container' },
        React.createElement('div', { id: 'map' }),
        this.state.loading ? this.renderLoader() : this.renderComponent()
      );
    }
  }]);

  return CreateEvent;
}(React.Component);