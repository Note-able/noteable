import { Editor, EditorState } from 'draft-js';
import React, { Component, PropTypes, cloneElement } from 'react';
import { connect } from 'react-redux';

import AJAX from '../../ajax';
import NavigationSidebar from './navigation-sidebar.js';
import { PencilIcon } from '../icons/common-icons.g';
import { profileActions } from '../../actions';

const {
  loadUser,
  savePreferences,
  updateInstruments,
} = profileActions;

const mapStateToProps = (state) => ({
  currentUser: state.currentUser,
  profile: state.profile,
});

const mapDispatchToProps = (dispatch) => ({
  loadUser: (userId) => dispatch(loadUser(userId)),
  savePreferences: (userId) => dispatch(savePreferences(userId)),
  updateInstruments: (instrument) => dispatch(updateInstruments(instrument)),
});

class Profile extends Component {
  static propTypes = {
    children: PropTypes.object,
    currentUser: PropTypes.shape({
      isAuthenticated: PropTypes.bool.isRequired,
      userId: PropTypes.number.isRequired,
    }),
    loadUser: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    profile: PropTypes.shape({
      bio: PropTypes.string,
    }),
  }

  componentDidMount() {
    this.props.loadUser(this.props.params != null && this.props.params.profileId != null ? this.props.params.profileId : this.props.currentUser.userId);
  }

  followUser(userId) {
    AJAX.post(`/user/follow?userId=${userId}`, null, (response) => {
      console.log(response);
    });
  }

  sendImageToServer(e) {
    const reader = new FileReader();

    const file = this.refs.file.files[0];
    reader.onload = () => {
      const dataUrl = reader.result;
      const base64 = dataUrl.split(',')[1];
      const formData = new FormData();
      formData.append('name', file.name);
      formData.append('file', base64);

      AJAX.postBlob('/user/edit/picture/new', formData, (response) => this.updated(response));
    };

    reader.readAsDataURL(this.refs.file.files[0]);

    e.preventDefault();
  }

  updated(response) {
    const parsedResponse = JSON.parse(response);
    this.setState({ image: parsedResponse.cloudStoragePublicUrl });
  }

  navigate(hashLocation) {
    this.props.history.pushState(`${this.props.location.pathname}${hashLocation}`);
  }

  render() {
    if (this.props.location.pathname.indexOf('create') !== -1) {
      return (cloneElement(this.props.children, { ...this.props, ...this.state }));
    }

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
              <div className="profile__name">{ this.props.profile.name == null ? 'Michael Nakayama' : this.props.profile.name }</div>
              <div className="profile__title">Studying songwriting &bull; Belmont University</div>
              <div className="profile__title">1 year experience</div>
              <div className="profile__location">{ this.props.profile.location == null ? 'Bellingham, WA' : this.props.profile.location }</div>
              <button className="profile__follow" onClick={() => this.followUser(this.props.profile.id)}>Follow</button>
              <button className="profile__message">Message</button>
              <form ref="uploadForm" className="uploader" encType="multipart/form-data" >
                <input ref="file" type="file" name="file" className="upload-file"/>
                <input type="button" ref="button" value="Upload" onClick={(e) => { this.sendImageToServer(e) }} />
              </form>
            </div>
            <div className="isLooking">{this.props.profile.isLooking == null ? 'I\'m looking to start a band!' : ''}</div>
          </div>
          <div className="profile-about__nav-bar"><a href="#about"><button>About</button></a><button href="#interests">Interests</button><button href="#demos">My demos</button></div>
          <div className="profile-about">
            <div className={`about-tab ${this.props.location.hash === 'about' || this.props.location.hash === '' ? 'about-tab--active' : ''}`}>
              <div className="profile-about__title">About Me{<span className="profile-about__icon"><PencilIcon /></span>}</div>
              <div>{this.props.profile.bio}</div>
            </div>
          </div>
        </div>
        <NavigationSidebar activeTab={this.props.location.hash} navigate={this.navigate}/>
      </div>
    );
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Profile);
