import React from 'react';
import AJAX from '../../ajax';
const NewsfeedSideBar = require('./newsfeed-sidebar.js');

class Profile extends React.Component {
  constructor (props, context) {
    super(props, context);

    this.state = {
      profile: {},
    };
  }

  componentDidMount () {
    AJAX.Get(`/me`, (response) => {
      console.log(response);
      this.loadUser(JSON.parse(response));
    });
  }

  loadUser (user) {
    console.log(user);
    this.setState({ profile: { name: user.name, email: user.email, bio: user.bio, location: user.location, averageEventRating: user.average_event_rating, image: user.profileImage } });
  }

  followUser (userId) {
    AJAX.Post(`/user/follow?userId=${userId}`, null, (response) => {
      console.log(response);
    });
  }

  sendImageToServer (e) {
    const reader = new FileReader();

    const file = this.refs.file.files[0];
    reader.onload = () => {
      const dataUrl = reader.result;
      const base64 = dataUrl.split(',')[1];
      const formData = new FormData();
      formData.append('name', file.name);
      formData.append('file', base64);

      AJAX.PostBlob(`/user/edit/picture/new`, formData, (response) => this.updated(response));
    };

    reader.readAsDataURL(this.refs.file.files[0]);

    e.preventDefault();
  }

  updated (response) {
    const parsedResponse = JSON.parse(response);
    this.setState({ image: parsedResponse.cloudStoragePublicUrl });
  }

  render () {
    return (
      <div className="app-container">
        <div className="navbar">
          <a href="/"><div className="home-button">Noteable</div></a>
          <button>Messages</button>
          <button>New Document</button>
        </div>
        <div className="profile-container">
          <div className="profile-header">
            <div className="filter" />
            <div className="profile">
              <div className="profile__image"/>
              <div className="profile__name">{ this.state.profile.name == null ? 'Michael Nakayama' : this.state.profile.name }</div>
              <div className="profile__title">Studying songwriting &bull; Belmont University</div>
              <div className="profile__title">1 year experience</div>
              <div className="profile__location">{ this.state.profile.location == null ? 'Bellingham, WA' : this.state.profile.location }</div>
              <button className="profile__follow" onClick={() => this.followUser(this.state.profile.id)}>Follow</button>
              <button className="profile__message">Message</button>
              <form ref="uploadForm" className="uploader" encType="multipart/form-data" >
                <input ref="file" type="file" name="file" className="upload-file"/>
                <input type="button" ref="button" value="Upload" onClick={ (e) => { this.sendImageToServer(e) }} />
              </form>
            </div>
            <div className="isLooking">{this.state.profile.isLooking == null ? 'I\'m looking to start a band!' : ''}</div>
          </div>
          <div className="profile-about__nav-bar"><a href="#about"><button>About</button></a><button href="#interests">Interests</button><button href="#demos">My demos</button></div>
          <div className="profile-about">
            <div className={`about-tab ${this.props.location.hash === 'about' || this.props.location.hash === '' ? 'about-tab--active' : ''}`}>
              <div className="profile-about__title">About Me</div>
              <div>{this.state.profile.bio === null ? '' : this.state.profile.bio }</div>
            </div>
          </div>
        </div>
        <NewsfeedSideBar />
      </div>
    );
  }
}

module.exports = Profile;