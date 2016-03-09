'use-strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

const React = require('react');
const ReactDOM = require('react-dom');
const Router = require('react-router');
const GoogleMaps = require('google-maps');
GoogleMaps.LIBRARIES = ['geometry', 'places', 'controls'];
let Google;

module.exports = function (_React$Component) {
  _inherits(CreateEvent, _React$Component);

  function CreateEvent() {
    _classCallCheck(this, CreateEvent);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(CreateEvent).apply(this, arguments));
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

          const input = ReactDOM.findDOMNode(this.refs.searchBox);
          const searchBox = new google.maps.places.SearchBox(input);
          map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
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
                scaledSize: new google.maps.Size(25, 25)
              };

              const marker = new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
              });

              marker.addListener('click', event => {
                this.displayEventForm(event);
              });

              // Create a marker for each place.
              markers.push(marker);

              if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
              } else {
                bounds.extend(place.geometry.location);
              }
            });
            map.fitBounds(bounds);
          });
        });
      });
    }
  }, {
    key: 'displayEventForm',
    value: function displayEventForm(event) {
      console.log(event);
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'create-event-container' },
        React.createElement('input', { className: 'event-name', type: 'text', placeholder: 'Name' }),
        React.createElement('input', { className: 'event-date', type: 'text', placeholder: 'Need a date picker' }),
        React.createElement('input', { className: 'map-search', ref: 'searchBox', type: 'text', placeholder: 'Search Box' }),
        React.createElement('div', { id: 'map' })
      );
    }
  }]);

  return CreateEvent;
}(React.Component);