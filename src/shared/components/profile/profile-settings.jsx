import React, { Component, PropTypes } from 'react';
import { CameraIcon, CrossIcon } from '../icons/common-icons.g';
import styles from '../app-styles/profile-settings.less';

class ProfileSettings extends Component {
  static propTypes = {
    closeSettings: PropTypes.func.isRequired,
    profile: PropTypes.shape({
      avatarUrl: PropTypes.string,
      name: PropTypes.string,
      location: PropTypes.string,
      profession: PropTypes.string,
    }),
    profileChange: PropTypes.func.isRequired,
    sendImageToServer: PropTypes.func.isRequired,
  };

  state = {
    profile: this.props.profile,
  }

  saveDebounce = (debounceFunc) => {
    if (this.changeTimeout != null) {
      window.clearTimeout(this.changeTimeout);
    }

    this.changeTimeout = window.setTimeout(() => {
      this.changeTimeout = null;
      debounceFunc();
    }, 1000);
  }

  saveProfile = () => {
    this.props.profileChange(this.state.profile);
  }

  nameChange = () => {
    this.setState({
      profile: {
        ...this.state.profile,
        name: this._name.value,
      },
    });
  }

  professionChange = () => {
    this.setState({
      profile: {
        ...this.state.profile,
        profession: this._profession.value,
      },
    });
  }

  locationChange = () => {
    this.setState({
      profile: {
        ...this.state.profile,
        location: this._location.value,
      },
    });
  }

  changeAvatar = (file) => {
    this.props.sendImageToServer(file, (url) => {
      this.setState({
        profile: {
          ...this.state.profile,
          avatarUrl: url,
        },
      });
    });
  }

  render() {
    return (
      <div className={styles.profileSettings}>
        <div className={styles.profileSettingsContainer}>
          <div className={styles.closeIcon} onClick={() => this.props.closeSettings()}>
            <CrossIcon />
          </div>
          <form className={styles.uploaders} encType="multipart/form-data" >
            <div className={styles.avatar} style={{ backgroundImage: `url('${this.state.profile.avatarUrl}'` }} />
            <div className={styles.uploadButton} onClick={() => { this._file.click(); }}><CameraIcon /></div>
            <input className={styles.fileUpload} ref={ref => { this._file = ref; }} type="file" name="file" onChange={() => this.changeAvatar(this._file.files[0])} />
          </form>
          <div className={styles.inputSettings}>
            <label htmlFor="name">Name: </label>
            <input
              className={styles.settingsName}
              type="text"
              onChange={this.nameChange}
              placeholder="Like John Lennon or something"
              name="name"
              value={this.state.profile.name}
              ref={ref => { this._name = ref; }}
            />
          </div>
          <div className={styles.inputSettings}>
            <label htmlFor="title">Profession: </label>
            <input
              className={styles.settingsTitle}
              type="text"
              onChange={this.professionChange}
              placeholder="Student at Belmont or Lonnie's karaoke winner"
              name="title" value={this.state.profile.profession}
              ref={ref => { this._profession = ref; }}
            />
          </div>
          <div className={styles.inputSettings}>
            <label htmlFor="location">Location: </label>
            <input
              className={styles.settingsLocation}
              type="text"
              onChange={this.locationChange}
              placeholder="Location"
              name="location"
              value={this.state.profile.location}
              ref={ref => { this._location = ref; }}
            />
          </div>
          <div className={styles.saveSettings} onClick={() => this.saveProfile()}>Save</div>
        </div>
      </div>
    );
  }
}

module.exports = ProfileSettings;
