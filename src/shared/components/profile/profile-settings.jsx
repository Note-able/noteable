import React, { Component, PropTypes } from 'react';
import { CrossIcon } from '../icons/common-icons.g';

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
      <div className="profile-settings">
        <div className="profile-settings__close-icon" onClick={() => this.props.closeSettings()}>
          <CrossIcon />
        </div>
        <form className="uploader" encType="multipart/form-data" >
          <div className="profile-settings__avatar" style={{ backgroundImage: `url('${this.state.profile.avatarUrl}'` }} />
          <div className="profile-settings__upload-button" onClick={() => { this._file.click(); }} />
          <input className="profile-settings__file-upload" ref={ref => { this._file = ref; }} type="file" name="file" onChange={() => this.changeAvatar(this._file.files[0])} />
        </form>
        <div className="profile-settings__input-container">
          <label htmlFor="name">Name: </label>
          <input
            className="profile-settings__name"
            type="text"
            onChange={this.nameChange}
            placeholder="Like John Lennon or something"
            name="name"
            value={this.state.profile.name}
            ref={ref => { this._name = ref; }}
          />
        </div>
        <div className="profile-settings__input-container">
          <label htmlFor="title">Profession: </label>
          <input
            className="profile-settings__title"
            type="text"
            onChange={this.professionChange}
            placeholder="Student at Belmont or Lonnie's karaoke winner"
            name="title" value={this.state.profile.profession}
            ref={ref => { this._profession = ref; }}
          />
        </div>
        <div className="profile-settings__input-container">
          <label htmlFor="location">Location: </label>
          <input
            className="profile-settings__location"
            type="text"
            onChange={this.locationChange}
            placeholder="Location"
            name="location"
            value={this.state.profile.location}
            ref={ref => { this._location = ref; }}
          />
        </div>
        <div className="profile-settings__save" onClick={() => this.saveProfile()}>Save</div>
      </div>
    );
  }
}

module.exports = ProfileSettings;
