import { Editor, EditorState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import React, { Component, PropTypes, cloneElement } from 'react';
import { connect } from 'react-redux';

import AJAX from '../../ajax';
import NavigationSidebar from './navigation-sidebar.jsx';
import ProfileSettings from './profile-settings.jsx';
import { CameraIcon, CogIcon, PencilIcon } from '../icons/common-icons.g';
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
    location: PropTypes.shape({
      hash: PropTypes.string,
    }),
    loadUser: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    profile: PropTypes.shape({
      avatarUrl: PropTypes.string,
      bio: PropTypes.string,
      coverImage: PropTypes.string,
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
    settingsView: this.props.location.hash.indexOf('settings') !== -1,
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      profile: nextProps.profile,
      settingsView: nextProps.location.hash.indexOf('settings') !== -1,
    });
  }

  onBioChange(editorState) {
    this.setState({
      editorState,
    });

    this.props.validateBio(editorState.getCurrentContent().getPlainText());
    this.props.updateBio(stateToHTML(editorState.getCurrentContent()));
  }

  sendImageToServer(file, callback) {
    const reader = new FileReader();

    reader.onload = () => {
      const dataUrl = reader.result;
      const base64 = dataUrl.split(',')[1];
      const formData = new FormData();
      formData.append(file.name, base64);

      AJAX.postBlob('/user/edit/picture/new', formData, (response) => {
        callback(JSON.parse(response).cloudStoragePublicUrl);
      });
    };

    reader.readAsDataURL(file);

    event.preventDefault();
  }

  navigate(hashLocation) {
    if (window.location.hash === `#${hashLocation}`) {
      window.location.hash = '';
    } else {
      window.location.hash = hashLocation;
    }
  }

  saveBio() {
    const validstate = Object.keys(this.props.validation).filter(option => !this.props.validation[option]);

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

  changeCoverImage(file) {
    this.sendImageToServer(file, (url) => {
      this.profileChange({
        ...this.props.profile,
        coverImage: url,
      });
    });
  }

  render() {
    if (this.props.location.pathname.indexOf('create') !== -1) {
      return (cloneElement(this.props.children, { ...this.props, ...this.state }));
    }

    return (
      <div className="app-container">
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/draft-js/0.7.0/Draft.min.css" />
        <div className="navbar navbar__no-home">
          <a href="/"><div className="home-button">Noteable</div></a>
        </div>
        {this.state.settingsView ?
          <ProfileSettings
            closeSettings={() => this.navigate('profile')}
            profile={this.state.profile}
            profileChange={(profile) => this.profileChange(profile)}
            sendImageToServer={(event, callback) => this.sendImageToServer(event, callback)}
          /> :
          <div className="profile-container">
            <div className="profile-header">
              <div className="filter" style={{ backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.45)), url("${this.props.profile.coverImage}")` }} />
              <div className="profile">
                <span className="profile__edit-icon" onClick={() => { this.setState({ settingsView: true }); this.navigate('profilesettings'); }}><CogIcon /></span>
                <form className="uploader" encType="multipart/form-data" >
                  <input className="profile-settings__file-upload" ref={ref => { this._coverImage = ref; }} type="file" name="file" onChange={() => this.changeCoverImage(this._coverImage.files[0])} />
                </form>
                <span className="profile__camera-icon" alt="Change cover image" onClick={() => this._coverImage.click()}><CameraIcon /></span>
                <div className="profile__image" style={{ backgroundImage: `url('${this.props.profile.avatarUrl}'` }} />
                <div className="profile__name">{ this.props.profile.name == null ? 'Michael Nakayama' : this.props.profile.name }</div>
                <div className="profile__title">Studying songwriting &bull; Belmont University</div>
                <div className="profile__title">1 year experience</div>
                <div className="profile__location">{ this.props.profile.location == null ? 'Bellingham, WA' : this.props.profile.location }</div>
                <button className="profile__follow" onClick={() => this.followUser(this.props.profile.id)}>Follow</button>
                <button className="profile__message">Message</button>
              </div>
              <div className="isLooking">{this.props.profile.isLooking == null ? 'I\'m looking to start a band!' : ''}</div>
            </div>
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
        }
        <NavigationSidebar activeTab={this.props.location.hash} navigate={(hashLocation) => this.navigate(hashLocation)} />
      </div>
    );
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Profile);
