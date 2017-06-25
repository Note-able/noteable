import React, { Component, PropTypes } from 'react';
import styles from './styles.less';
import AJAX from '../../../../ajax.js';
import Calendar from '../../../events/calendar.js';
import { DatePicker } from '../../../shared/index.js';

export default class CreateEvent extends Component {
  state = {
    activeLabel: '',
    description: '',
    eventDate: '',
    eventPhoto: '',
    location: '',
    name: '',
  };

  componentDidMount() {
    window.onbeforeunload = () => this.saveState();
    this.setState(JSON.parse(window.localStorage.getItem('create') || '{}'), this.initMap);
  }

  componentWillUnmount() {
    this.saveState();
  }

  saveState() {
    window.localStorage.setItem('create', JSON.stringify(this.state));
  }

  validateForm() {
    
  }

  markers = [];

  initMap() {
    var map = new google.maps.Map(this._map, {
      center:{lat: this.state.lat || -33.8688, lng: this.state.lng || 151.2195},
      zoom: 13,
      mapTypeId: 'roadmap'
    });

    if (this.state.marker != null) {
      this.markers.push(new google.maps.Marker({
          ...this.state.marker,
          map: map,
          icon: {
              ...this.state.marker.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25),
          },
          position: {lat: this.state.lat, lng: this.state.lng},
        }));
    }

    const autocomplete = new google.maps.places.Autocomplete(this._search, { types: ['geocode'] });

    autocomplete.addListener('place_changed', () => { 
      const place = autocomplete.getPlace();
      map.setCenter(place.geometry.location);
      this.markers.forEach(marker => marker.setMap(null));
      this.markers.push(new google.maps.Marker({
          map: map,
          icon: {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          },
          title: place.name,
          position: place.geometry.location
        }));

      this.setState({
        location: place.formatted_address,
        marker: {
          icon: {
            url: place.icon,
          },
          title: place.name,
        },
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    });
  }

  sendImageToServer(file) {
    const reader = new FileReader();

    reader.onload = () => {
      const dataUrl = reader.result;
      const base64 = dataUrl.split(',')[1];
      const formData = new FormData();
      formData.append(file.name, base64);

      AJAX.postBlob('/user/edit/picture/new', formData, (response) => {
        this.setState({
          eventPhoto: JSON.parse(response).cloudStoragePublicUrl,
        });
      });
    };

    reader.readAsDataURL(file);

    event.preventDefault();
  }

  updateName = (event) => this.setState({ name: event.target.value });
  updateLocation = (event) => this.setState({ location: event.target.value });
  updateDescription = (event) => this.setState({ description: event.target.value });
  updateDate = (date) => this.setState({ eventDate: date })

  render() {
    return (
      <div className={styles.createEventContainer}>
        <div className={styles.formControls}>
          <div className={styles.createButton}>Create</div>
          <div className={styles.cancelAction}>Cancel</div>
        </div>
        <input className={styles.fileUpload} ref={ref => { this._file = ref; }} type="file" name="file" onChange={() => this.sendImageToServer(this._file.files[0])} />
        <div className={`${styles.input} ${styles.photoContainer}`} onClick={this.state.eventPhoto ? null : () => { this._file.click(); }}>
          <div className={`${styles.inputLabel} ${styles.activeLabel}`}>Cover photo</div>
          <div className={styles.photoForm} style={this.state.eventPhoto === '' ? null : { backgroundImage: `url('${this.state.eventPhoto}')`, cursor: 'initial' }}>
            {this.state.eventPhoto !== '' ? null : <span><i className="material-icons">photo_camera</i> Upload</span>}
          </div>
        </div>
        <div className={styles.formContainer}>
          <div>
            <div className={styles.input}>
              <div className={`${styles.inputLabel} ${this.state.label === 'name' || this.state.name !== '' ? styles.activeLabel : ''}`}>Event name</div>
              <input className={styles.inputContainer} onBlur={() => this.setState({ label: '' })} onChange={this.updateName} onFocus={() => this.setState({ label: 'name' })} value={this.state.name} />
            </div>
            <div className={styles.input}>
              <div className={`${styles.inputLabel} ${this.state.label === 'location' || this.state.location !== '' ? styles.activeLabel : ''}`}>Location</div>
              <input className={styles.inputContainer} onBlur={() => this.setState({ label: '' })} onChange={this.updateLocation} onFocus={() => this.setState({ label: 'location' })} ref={ref => { this._search = ref; }} value={this.state.location} placeholder="" />
            </div>
            <div className={styles.input} style={{ position: 'initial', zIndex: 10 }}>
              <DatePicker
                className={styles.datePicker}
                onChange={this.updateDate}
                onBlur={() => this.setState({ label: '' })}
                onFocus={() => this.setState({ label: 'datepicker' })}
              />
            </div>
            <div className={styles.input}>
              <div className={`${styles.inputLabel} ${this.state.label === 'description' || this.state.description !== '' ? styles.activeLabel : ''}`}>Description</div>
              <textarea className={`${styles.inputContainer} ${styles.description}`} onBlur={() => this.setState({ label: '' })} onChange={this.updateDescription} onFocus={() => this.setState({ label: 'description' })} value={this.state.description} />
            </div>
          </div>
          <div id="map" className={styles.map} ref={ref => { this._map = ref; }}></div>
        </div>
      </div>
    );
  }
}
