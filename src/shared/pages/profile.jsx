import { Editor, EditorState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import React, { Component, PropTypes, cloneElement } from 'react';
import { connect } from 'react-redux';

import AJAX from '../ajax';
import { NavigationSidebar } from '../components/shared';
import ProfileSettings from '../components/profile-settings';
import { CameraIcon, CogIcon, PencilIcon } from '../components/icons/common-icons.g';
import { profileActions } from '../actions';
import styles from '../styles/profile.less';
import CreateProfile from './profile-create';

const {
  loadUser,
  saveProfile,
  updateBio,
  updateInstruments,
  updateProfile,
  validateBio,
} = profileActions;

const mapStateToProps = (state) => ({
  currentUser: {
    isAuthenticated: state.currentUser.userId !== -1,
    userId: state.currentUser.userId,
  },
  profile: state.profile,
  validation: state.validation,
});

const mapDispatchToProps = (dispatch) => ({
  loadUser: (userId) => dispatch(loadUser(userId)),
  saveProfile: (profile) => dispatch(saveProfile(profile)),
  updateBio: (bio) => dispatch(updateBio(bio)),
  updateInstruments: (instrument) => dispatch(updateInstruments(instrument)),
  updateProfile: (profile) => dispatch(updateProfile(profile)),
  validateBio: (bio) => dispatch(validateBio(bio)),
});

class Profile extends Component {
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

  changeAvatar = (file) => {
    this.sendImageToServer(file, (url) => {
      this.props.updateProfile({
        ...this.props.profile,
        avatarUrl: url,
      });
    });
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

  navigate(location) {
    window.location.pathname = location;
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
      editorState: EditorState.createWithContent(stateFromHTML(this.props.profile.bio || ' ')),
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
      return (
        <div className={styles.appContainer}>
          <div className="navbar navbar__no-home">
            <a href="#"><div className="home-button">Noteable</div></a>
          </div>
          <CreateProfile
            bio={this.state.editorState}
            changeAvatar={(file) => this.changeAvatar(file)}
            name={this.props.profile.name}
            onBioChange={(editorState) => this.onBioChange(editorState)}
            profile={this.props.profile}
            saveProfile={this.props.saveProfile}
            updateProfile={this.props.updateProfile}
            updateInstruments={this.props.updateInstruments}
          />
        </div>
      );
    }

    return (
      <div className={styles.appContainer}>
        {this.state.settingsView ?
          <CreateProfile
            bio={this.state.editorState}
            changeAvatar={(file) => this.changeAvatar(file)}
            name={this.props.profile.name}
            onBioChange={(editorState) => this.onBioChange(editorState)}
            profile={this.props.profile}
            saveProfile={this.props.saveProfile}
            updateProfile={this.props.updateProfile}
            updateInstruments={this.props.updateInstruments}
          /> :
          <div className={styles.profileContainer}>
            <div className={styles.profileHeader}>
              <div className={styles.filter} style={{ backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.45)), url("${this.props.profile.coverImage}")` }} />
              <div className={styles.profile}>
                <span className={styles.editIcon} onClick={() => { this.setState({ settingsView: true }); this.navigate('profilesettings'); }}><CogIcon /></span>
                <form className={styles.fileUpload} encType="multipart/form-data" >
                  <input className={styles.uploadButton} ref={ref => { this._coverImage = ref; }} type="file" name="file" onChange={() => this.changeCoverImage(this._coverImage.files[0])} />
                </form>
                <span className={styles.cameraIcon} alt="Change cover image" onClick={() => this._coverImage.click()}><CameraIcon /></span>
                <div className={styles.image} style={{ backgroundImage: `url('${this.props.profile.avatarUrl}'` }} />
                <div className={styles.name}>{`${this.props.profile.firstName} ${this.props.profile.lastName}`}</div>
                <div className={styles.title}>{this.props.profile.profession}</div>
                <div className={styles.location}>{this.props.profile.location}</div>
                <button className={styles.follow} onClick={() => this.followUser(this.props.profile.id)}>Follow</button>
                <button className={styles.message}>Message</button>
              </div>
              <div className={styles.isLooking}>{this.props.profile.isLooking == null ? 'I\'m looking to start a band!' : ''}</div>
            </div>
            <div className={styles.profileAbout}>
              <div className={styles.aboutSection}>
                <div className={styles.aboutTitle}>About Me{<span className={styles.aboutIcon} onClick={() => this.setState({ isEditing: true })}><PencilIcon /></span>}{this.props.validation.isValidBio ? '' : <span className={`error ${styles.aboutErrorMessage}`}>Your about section is too long.</span>}</div>
                <div className={styles.aboutContainer}>
                  {this.state.isEditing ?
                    <div>
                      <button className={styles.aboutSave} onClick={() => this.saveBio()}>Save</button>
                      <button className={styles.aboutCancel} onClick={() => this.closeEditor()}>Cancel</button>
                    </div> :
                    null
                  }
                  <div className={`${styles.aboutEditorContainer} ${this.state.isEditing ? styles.isEditing : ''}`}>
                    <Editor
                      editorState={this.state.editorState}
                      onChange={(editorState) => this.onBioChange(editorState)}
                      placeholder={this.state.isEditing ? 'Tell the world who you are.' : ' '}
                      readOnly={!this.state.isEditing}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.interestSection}>
                {this.props.profile.preferences.instruments}
                {this.props.profile.preferences.preferredGenres}
              </div>
            </div>
          </div>
        }
        <NavigationSidebar
          activeTab={this.props.location.hash}
          currentUser={this.state.profile}
          navigate={(hashLocation) => this.navigate(hashLocation)}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
