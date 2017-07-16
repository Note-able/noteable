import React from 'react';
import GoogleMaps from 'google-maps';
import EventsListView from './events-list-view';
import EventsMapView from './events-map-view';
import ajax from '../../ajax';
import styles from './styles.less';

let Google;

const left = {left: 0};
const right = {right: 0};

export default class BrowseEvents extends React.Component {
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
      ajax.Get(`/api/events/nearby?lat=${position.coords.latitude}&lng=${position.coords.longitude}&radius=50`, response => {
        this.setState({
          events: JSON.parse(response),
          position: position
        });
      })
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
      return (
        <div className={styles.eventsListContainer}>
          <EventsListView events={this.state.events}/>
         </div>
      );
    }

    return (
      <div className={styles.eventsMapContainer}>
        <EventsMapView events={this.state.events}/>
       </div>
    );
  }

  render () {
    return (
      <div className={styles.eventContainer}>
        <div className={styles.viewToggleBar}>
          <div className={styles.toggle}>
            <div className={[styles.toggleOption, styles.listView]} onClick={this.selectListView}>List</div>
            <div className={[styles.toggleOption, styles.mapView]} onClick={this.selectMapView}>Map</div>
            <div className={[styles.toggleOption, styles.highlight]} style={this.state.mode === 'list' ? left : right}></div>
          </div>
        </div>
        <div className={styles.eventView}>
          {this.renderView()}
        </div>
      </div>
    );
  }
}