'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const Router = require('react-router');
const GoogleMaps = require('google-maps');
let Google;

module.exports = class BrowseEvents extends React.Component {
  componentDidMount () {
    navigator.geolocation.getCurrentPosition( position => {
      GoogleMaps.load( google => {
        Google = google;
        new Google.maps.Map(document.getElementById('map'), {
          center: {lat: position.coords.latitude, lng: position.coords.longitude },
          zoom: 4
        });
      });
    });
  }

  render () {
    return (
      <div id="map" style={{width: '100%', height: '100%' }}/>
    );
  }
}