import React, { Component, PropTypes } from 'react';

class ProfileSettings extends Component {
  static propTypes = {
    profile: PropTypes.shape({
      name: PropTypes.string,
      location: PropTypes.string,
      profession: PropTypes.string,
    }),
    profileChange: PropTypes.func.isRequired,
  };

  state = {
    profile: this.props.profile,
  }

  nameChange = () => {
    if (this.changeTimeout != null) {
      window.clearTimeout(this.changeTimeout);
    }

    this.changeTimeout = window.setTimeout(() => {
      this.changeTimeout = null;
      this.props.profileChange({ ...this.props.profile, name: this._name.value });
    }, 500);

    this.setState({
      profile: {
        ...this.state.profile,
        name: this._name.value,
      },
    });
  }

  professionChange = () => {
    this.props.profileChange({ ...this.props.profile, profession: this._profession.value });
  }

  locationChange = () => {
    this.props.profileChange({ ...this.props.profile, location: this._location.value });
  }

  render() {
    return (
      <div className="profile-settings">
        <div className="profile__image" />
        <div className="profile-settings__input-container">
          <label htmlFor="name">Name: </label>
          <input className="profile-settings__name" type="text" onChange={this.nameChange} placeholder="Like John Lennon or something" name="name" value={this.state.profile.name} ref={ref => {this._name = ref;}} />
        </div>
        <div className="profile-settings__input-container">
          <label htmlFor="title">Profession: </label>
          <input className="profile-settings__title" type="text" placeholder="Student at Belmont or Lonnie's karaoke winner" name="title" value={this.state.profile.profession} />
        </div>
        <div className="profile-settings__input-container">
          <label htmlFor="location">Location: </label>
          <input className="profile-settings__location" type="text" placeholder="Location" name="location" value={this.state.profile.location} />
        </div>
        <form ref="uploadForm" className="uploader" encType="multipart/form-data" >
          <input ref="file" type="file" name="file" className="upload-file"/>
          <input type="button" ref="button" value="Upload" onClick={(e) => { this.sendImageToServer(e) }} />
        </form>
      </div>
    );
  }
}

module.exports = ProfileSettings;