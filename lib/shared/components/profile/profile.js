import React from 'react';
import AJAX from '../../ajax';
const NavigationSidebar = require('./navigation-sidebar.js');

class Profile extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      profile: {}
    };
  }

  componentDidMount() {
    AJAX.Get(`/me`, response => {
      console.log(response);
      this.loadUser(JSON.parse(response));
    });
  }

  loadUser(user) {
    console.log(user);
    this.setState({ profile: { name: user.name, email: user.email, bio: user.bio, location: user.location, averageEventRating: user.average_event_rating, image: user.profileImage } });
  }

  followUser(userId) {
    AJAX.Post(`/user/follow?userId=${ userId }`, null, response => {
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

      AJAX.PostBlob(`/user/edit/picture/new`, formData, response => this.updated(response));
    };

    reader.readAsDataURL(this.refs.file.files[0]);

    e.preventDefault();
  }

  updated(response) {
    const parsedResponse = JSON.parse(response);
    this.setState({ image: parsedResponse.cloudStoragePublicUrl });
  }

  navigate(hashLocation) {
    this.props.history.pushState(`${ this.props.location.pathname }${ hashLocation }`);
  }

  render() {
    return React.createElement(
      'div',
      { className: 'app-container' },
      React.createElement(
        'div',
        { className: 'navbar' },
        React.createElement(
          'a',
          { href: '/' },
          React.createElement(
            'div',
            { className: 'home-button' },
            'Noteable'
          )
        ),
        React.createElement(
          'button',
          null,
          'Messages'
        ),
        React.createElement(
          'button',
          null,
          'New Document'
        )
      ),
      React.createElement(
        'div',
        { className: 'profile-container' },
        React.createElement(
          'div',
          { className: 'profile-header' },
          React.createElement('div', { className: 'filter' }),
          React.createElement(
            'div',
            { className: 'profile' },
            React.createElement('div', { className: 'profile__image' }),
            React.createElement(
              'div',
              { className: 'profile__name' },
              this.state.profile.name == null ? 'Michael Nakayama' : this.state.profile.name
            ),
            React.createElement(
              'div',
              { className: 'profile__title' },
              'Studying songwriting • Belmont University'
            ),
            React.createElement(
              'div',
              { className: 'profile__title' },
              '1 year experience'
            ),
            React.createElement(
              'div',
              { className: 'profile__location' },
              this.state.profile.location == null ? 'Bellingham, WA' : this.state.profile.location
            ),
            React.createElement(
              'button',
              { className: 'profile__follow', onClick: () => this.followUser(this.state.profile.id) },
              'Follow'
            ),
            React.createElement(
              'button',
              { className: 'profile__message' },
              'Message'
            ),
            React.createElement(
              'form',
              { ref: 'uploadForm', className: 'uploader', encType: 'multipart/form-data' },
              React.createElement('input', { ref: 'file', type: 'file', name: 'file', className: 'upload-file' }),
              React.createElement('input', { type: 'button', ref: 'button', value: 'Upload', onClick: e => {
                  this.sendImageToServer(e);
                } })
            )
          ),
          React.createElement(
            'div',
            { className: 'isLooking' },
            this.state.profile.isLooking == null ? 'I\'m looking to start a band!' : ''
          )
        ),
        React.createElement(
          'div',
          { className: 'profile-about__nav-bar' },
          React.createElement(
            'a',
            { href: '#about' },
            React.createElement(
              'button',
              null,
              'About'
            )
          ),
          React.createElement(
            'button',
            { href: '#interests' },
            'Interests'
          ),
          React.createElement(
            'button',
            { href: '#demos' },
            'My demos'
          )
        ),
        React.createElement(
          'div',
          { className: 'profile-about' },
          React.createElement(
            'div',
            { className: `about-tab ${ this.props.location.hash === 'about' || this.props.location.hash === '' ? 'about-tab--active' : '' }` },
            React.createElement(
              'div',
              { className: 'profile-about__title' },
              'About Me'
            ),
            React.createElement(
              'div',
              null,
              this.state.profile.bio === null ? '' : this.state.profile.bio
            )
          )
        )
      ),
      React.createElement(NavigationSidebar, { activeTab: this.props.location.hash, navigate: this.navigate })
    );
  }
}

module.exports = Profile;