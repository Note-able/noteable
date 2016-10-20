import { Editor, EditorState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import React, { Component, PropTypes, cloneElement } from 'react';
import { connect } from 'react-redux';

import AJAX from '../../ajax';
import NavigationSidebar from './navigation-sidebar.js';
import ProfileSettings from './profile-settings.jsx';
import { CogIcon, PencilIcon } from '../icons/common-icons.g';
import { profileActions } from '../../actions';

const {
  loadUser,
  saveProfile,
  updateBio,
  updateInstruments,
  validateBio,
} = profileActions;

const mapStateToProps = (state) => ({
  currentUser: state.currentUser,
  profile: state.profile,
  validation: state.validation,
});

const mapDispatchToProps = (dispatch) => ({
  loadUser: (userId) => dispatch(loadUser(userId)),
  saveProfile: (profile) => dispatch(saveProfile(profile)),
  updateBio: (bio) => dispatch(updateBio(bio)),
  updateInstruments: (instrument) => dispatch(updateInstruments(instrument)),
  validateBio: (bio) => dispatch(validateBio(bio)),
});

class Profile extends Component {
  static propTypes = {
    children: PropTypes.object,
    createEditorState: PropTypes.func,
    currentUser: PropTypes.shape({
      isAuthenticated: PropTypes.bool.isRequired,
      userId: PropTypes.number.isRequired,
    }),
    loadUser: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    profile: PropTypes.shape({
      bio: PropTypes.string,
      id: PropTypes.number.isRequired,
    }),
    saveProfile: PropTypes.func.isRequired,
    updateBio: PropTypes.func.isRequired,
    validation: PropTypes.shape({
      isValidBio: PropTypes.bool.isRequired,
    }),
    validateBio: PropTypes.func.isRequired,

  }

  state = {
    editorState: this.props.profile.bio == null ? EditorState.createEmpty() : EditorState.createWithContent(stateFromHTML(this.props.profile.bio)),
    isEditing: false,
    profile: this.props.profile,
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      profile: nextProps.profile,
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

  onBioChange(editorState) {
    this.setState({
      editorState,
    });

    this.props.validateBio(editorState.getCurrentContent().getPlainText());
    this.props.updateBio(stateToHTML(editorState.getCurrentContent()));
  }

  saveBio() {
    const validstate = Object.keys(this.props.validation).filter(option => {
      return !this.props.validation[option];
    });

    if (validstate.length !== 0) {
      return;
    }

    this.props.saveProfile(this.props.profile);
    this.closeEditor();
  }

  followUser(userId) {
    AJAX.post(`/user/follow?userId=${userId}`, null, (response) => {
      console.log(response);
    });
  }

  profileChange(profile) {
    this.props.saveProfile(profile);
  }

  closeEditor() {
    this.setState({
      editorState: EditorState.createWithContent(stateFromHTML(this.props.profile.bio)),
      isEditing: false,
    });
  }

  render() {
    if (this.props.location.pathname.indexOf('create') !== -1) {
      return (cloneElement(this.props.children, { ...this.props, ...this.state }));
    }

    return (
      <div className="app-container">
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/draft-js/0.7.0/Draft.min.css" />
        <div className="navbar">
          <a href="/"><div className="home-button">Noteable</div></a>
          <button>Messages</button>
          <button>New Document</button>
        </div>
        <div className="profile-container">
          {this.state.settingsView ?
            <ProfileSettings profile={this.state.profile} profileChange={(profile) => this.profileChange(profile)} /> :
            <div className="profile-header">
              <div className="filter" />
              <div className="profile">
                <span className="profile__edit-icon" onClick={() => this.setState({ settingsView: true })}><CogIcon /></span>
                <div className="profile__image" />
                <div className="profile__name">{ this.props.profile.name == null ? 'Michael Nakayama' : this.props.profile.name }</div>
                <div className="profile__title">Studying songwriting &bull; Belmont University</div>
                <div className="profile__title">1 year experience</div>
                <div className="profile__location">{ this.props.profile.location == null ? 'Bellingham, WA' : this.props.profile.location }</div>
                <button className="profile__follow" onClick={() => this.followUser(this.props.profile.id)}>Follow</button>
                <button className="profile__message">Message</button>
              </div>
              <div className="isLooking">{this.props.profile.isLooking == null ? 'I\'m looking to start a band!' : ''}</div>
            </div>
          }
          <div className="profile-about__nav-bar"><a href="#about"><button>About</button></a><button href="#interests">Interests</button><button href="#demos">My demos</button></div>
          <div className="profile-about">
            <div className={`about-tab ${this.props.location.hash === 'about' || this.props.location.hash === '' ? 'about-tab--active' : ''}`}>
              <div className="profile-about__title">About Me{<span className="profile-about__icon" onClick={() => this.setState({ isEditing: true })}><PencilIcon /></span>}{this.props.validation.isValidBio ? '' : <span className="error profile-about__error-message">Your about section is too long.</span>}</div>
              <div className="profile-about__container">
                {this.state.isEditing ?
                  <div className="profile-about__container__actions">
                    <button className="profile-about__container__actions--save" onClick={() => this.saveBio()}>Save</button>
                    <button className="profile-about__container__actions--cancel" onClick={() => this.closeEditor()}>Cancel</button>
                  </div> :
                  null
                }
                <div className={`profile-about__editor-container ${this.state.isEditing ? 'profile-about__editor-container--is-editing' : ''}`}>
                  <Editor
                    editorState={this.state.editorState}
                    onChange={(editorState) => this.onBioChange(editorState)}
                    placeholder={this.state.isEditing ? 'Tell the world who you are.' : ''}
                    readOnly={!this.state.isEditing}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <NavigationSidebar activeTab={this.props.location.hash} navigate={this.navigate}/>
      </div>
    );
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Profile);
