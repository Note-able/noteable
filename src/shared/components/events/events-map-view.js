'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const Router = require('react-router');
const EventsListView = require('./events-list-view');
const Event = require('./event');
const GoogleMaps = require('google-maps');
GoogleMaps.LIBRARIES = ['geometry', 'places', 'controls'];
let Google;

//script(async defer src='https://maps.googleapis.com/maps/api/js?key=AIzaSyAKVBUoH34uEatkaHIhMcB7c3ejf1nLyYc&libraries=places&callback=initMap')

module.exports = class EventsListView extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(position => {
      GoogleMaps.load( google => {
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
        const bounds = new google.maps.LatLngBounds();
        this.props.events.forEach(event => {
          const icon = {
            url: 'https://maps.gstatic.com/mapfiles/ms2/micons/red.png',
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(30, 30)
          };

          const marker = new google.maps.Marker({
            map: map,
            icon: icon,
            title: event.name,
            position: {lat: parseFloat(event.latitude), lng: parseFloat(event.longitude)}
          });

          // Create a marker for each place.
          markers.push(marker);
        });

        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', () => {
          const places = searchBox.getPlaces();

          if (places.length === 0) {
            return;
          }

          // Clear out the old markers.
          markers.forEach( marker => {
            marker.setMap(null);
          });
          markers = [];

          // For each place, get the icon, name and location.
        });
      });
    });
  }

  render() {
    return (
      <div className="events-map-container">
        <input name="location" className="map-search" ref="searchBox" type="text" placeholder="Search Box"/>
        <div id="map"/>
        <div className="events-list-container">
          {this.props.events.map(event => {
            console.log(event);
            return (
              <Event key={event.id} event={event}/>
            );
          })}
        </div>
      </div>
    );
  }
};