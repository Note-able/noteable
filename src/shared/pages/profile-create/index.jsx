import React, { Component, PropTypes } from 'react';
import { Editor, EditorState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import GoogleMaps from 'google-maps';

import instruments from '../../components/profile-settings/instruments.json';
import styles from './styles.less';
import { CameraIcon } from '../../components/icons/common-icons.g';
import { validateProfile } from '../../../util/util';

GoogleMaps.KEY = 'AIzaSyAKVBUoH34uEatkaHIhMcB7c3ejf1nLyYc';
GoogleMaps.LIBRARIES = ['geometry', 'places', 'controls'];
let Google;

export default class ProfileCreate extends Component {
  static propTypes = {
    bio: PropTypes.object,
    onBioChange: PropTypes.func.isRequired,
    profile: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      id: PropTypes.number.isRequired,
      preferences: PropTypes.shape({
        instruments: PropTypes.arrayOf(PropTypes.string),
      }),
      zipCode: PropTypes.number,
    }).isRequired,
    saveProfile: PropTypes.func.isRequired,
    updateProfile: PropTypes.func.isRequired,
    updateInstruments: PropTypes.func.isRequired,
  };

  state = {
    editorState: this.props.bio,
    invalidState: {},
  };

  componentWillUnmount() {
    this.props.saveProfile(this.props.profile.id);
  }

  componentWillReceiveProps = (props) => {
    if (props.profile.zipCode != this.props.profile.zipCode && props.profile.zipCode.toString().length === 5) {
      navigator.geolocation.getCurrentPosition(position => {
        GoogleMaps.load(google => {
          const service = new google.maps.Geocoder().geocode({ address: props.profile.zipCode.toString() },
            (result => {
              if (result == null) {
                return;
              }

              this.props.updateProfile({
                ...this.props.profile,
                location: `${result[0].address_components[1].long_name}, ${result[0].address_components[2].short_name}`,
              });
            })
          );
        })
      });
    }

    if (props.profile && props.profile.isSaved) {
      window.location = '/profile';
    }

    this.setState({
      editorState: props.bio,
      invalidState: {},
    });
  }

  toggleInput(instrument) {
    this.props.updateInstruments(instrument);
  }

  updateProfile = () => {
    this.props.updateProfile({
      ...this.props.profile,
      firstName: this._firstName.value,
      lastName: this._lastName.value,
      zipCode: parseInt(this._zipCode.value),
      profession: this._profession.value,
      preferences: {
        ...this.props.profile.preferences,
        isLooking: this._isLooking.checked,
        displayLocation: this._shareLocation.checked,
      }
    });
  }

  saveProfile = () => {
    const invalidState = validateProfile({ firstName: this._firstName.value, lastName: this._lastName.value, zipCode: this._zipCode.value });
    if (Object.keys(invalidState).length > 0) {
      this.setState({
        invalidState,
      });
      return;
    }

    this.setState({
      invalidState: {},
    });

    this.props.saveProfile(this.props.profile);
  }

  render() {
    const instrumentList = instruments.instruments;
    const instrumentKeys = Object.keys(instrumentList);
    const stuff = this.props.profile.preferences.instruments;
    return (
      <div className={styles.editContainer}>
        <div className={styles.submitButton} onClick={this.saveProfile}>Finish</div>
        <h1 className={styles.header}>Hey {this.props.profile.firstName}, let's create your first impression<div className={styles.subheader}>(You can change this later.)</div></h1>
        <div className={styles.publicInfo}>
          <div className={styles.publicInfoInput}>
            <form className={styles.uploaders} encType="multipart/form-data" >
              <div className={styles.avatar} style={{ backgroundImage: `url('${this.props.profile.avatarUrl}'` }} />
              <div className={styles.uploadButton} onClick={() => { this._file.click(); }}><CameraIcon /></div>
              <input className={styles.fileUpload} ref={ref => { this._file = ref; }} type="file" name="file" onChange={() => this.props.changeAvatar(this._file.files[0])} />
            </form>
            <div className={styles.input}>
              <div className={styles.inputLabel}>First name<div className={styles.error}>{this.state.invalidState.firstName}</div></div>
              <input className={`${styles.inputName}`} onChange={this.updateProfile} type="text" name="firstName" value={this.props.profile.firstName} ref={ref => { this._firstName = ref; }} />
            </div>
            <div className={styles.input}>
              <div className={styles.inputLabel}>Last name<div className={styles.error}>{this.state.invalidState.lastName}</div></div>
              <input className={`${styles.inputName}`} onChange={this.updateProfile} type="text" name="lastName" value={this.props.profile.lastName} ref={ref => { this._lastName = ref; }} />
            </div>
            <div className={styles.input}>
              <div className={styles.inputLabel}>Profession<div className={styles.error}>{this.state.invalidState.profession}</div></div>
              <input className={`${styles.inputName}`} onChange={this.updateProfile} type="text" name="profession" value={this.props.profile.profession} ref={ref => { this._profession = ref; }} />
            </div>
            <div className={styles.input}>
              <div className={styles.inputLabel}>Zip code <div className={styles.error}>{this.state.invalidState.zipCode}</div></div>
              <input className={`${styles.inputZip}`} onChange={this.updateProfile} type="tel" name="zipCode" value={this.props.profile.zipCode} ref={ref => { this._zipCode = ref; }} />
            </div>
            <div className={styles.input}>
              <div className={styles.checkboxLabel}>Looking for a band?<div className={styles.error}>{this.state.invalidState.firstName}</div></div>
              <input className={`${styles.isLooking}`} onChange={this.updateProfile} type="checkbox" name="isLooking" checked={this.props.profile.preferences.isLooking} ref={ref => { this._isLooking = ref; }} />
            </div>
            <div className={styles.input}>
              <div className={styles.checkboxLabel}>Display my location <div className={styles.error}>{this.state.invalidState.firstName}</div></div>
              <input className={`${styles.isLooking}`} onChange={this.updateProfile} type="checkbox" name="shareLocation" checked={this.props.profile.preferences.displayLocation} ref={ref => { this._shareLocation = ref; }} />
            </div>
          </div>
          <div className={styles.aboutEditorContainer}>
            <div className={styles.inputLabel}>About</div>
            <div className={styles.editorContainer}>
              <Editor
                editorState={this.state.editorState}
                onChange={(editorState) => this.props.onBioChange(editorState)}
                readOnly={false}
              />
            </div>
          </div>
        </div>
        <div className={styles.header}>What instruments do you play?</div>
        <ul className={styles.instruments}>
          {instrumentKeys.map(key => {
            const instrument = instrumentList[key];

            return (
              <li className={styles.instrument} key={instrument} onClick={() => this.toggleInput(instrument)}>
                <input
                  className={styles.checkbox}
                  type="checkbox"
                  name={instrument}
                  checked={stuff.indexOf(instrument) !== -1 ? instrument : null}
                />
                <label htmlFor={instrument}>{instrument}</label>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
};
