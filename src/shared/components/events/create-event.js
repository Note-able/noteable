'use-strict';

const React = require('react');
const ReactDOM = require('react-dom');
const Router = require('react-router');
const GoogleMaps = require('google-maps');
GoogleMaps.LIBRARIES = ['geometry', 'places', 'controls'];
let Google;

module.exports = class CreateEvent extends React.Component {
  componentDidMount () {
    navigator.geolocation.getCurrentPosition( position => {
      GoogleMaps.load( google => {
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
          markers.forEach( marker => {
            marker.setMap(null);
          });
          markers = [];

          // For each place, get the icon, name and location.
          const bounds = new google.maps.LatLngBounds();
          places.forEach( place => {
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

            marker.addListener('click', (event) => {
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

  displayEventForm (event) {
    console.log(event);
  }

  render () {
    return (
      <div className="create-event-container">
        <input className="event-name" type="text" placeholder="Name"/>
        <input className="event-date" type="text" placeholder="Need a date picker"/>
        <input className="map-search" ref="searchBox" type="text" placeholder="Search Box"/>
        <div id="map" />
      </div>
    );
  }
}