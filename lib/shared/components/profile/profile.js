var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import AJAX from '../../ajax';

let Profile = function (_React$Component) {
  _inherits(Profile, _React$Component);

  function Profile(props, context) {
    _classCallCheck(this, Profile);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Profile).call(this, props, context));

    _this.state = {};
    return _this;
  }

  _createClass(Profile, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      AJAX.Get(`/user/${ this.props.params.id }`, response => {
        this.loadUser(JSON.parse(response));
      });
    }
  }, {
    key: 'loadUser',
    value: function loadUser(user) {
      this.setState({ name: user.name, email: user.email, bio: user.bio, location: user.location, averageEventRating: user.average_event_rating, image: user.profileImage });
    }
  }, {
    key: 'sendImageToServer',
    value: function sendImageToServer(e) {
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
  }, {
    key: 'updated',
    value: function updated(response) {
      const parsedResponse = JSON.parse(response);
      this.setState({ image: parsedResponse.cloudStoragePublicUrl });
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'profile' },
        React.createElement(
          'div',
          null,
          this.state.name
        ),
        React.createElement(
          'div',
          null,
          this.state.email
        ),
        React.createElement(
          'div',
          null,
          this.state.bio
        ),
        React.createElement(
          'div',
          null,
          this.state.location
        ),
        React.createElement(
          'div',
          null,
          this.state.averageEventRating
        ),
        React.createElement(
          'form',
          { ref: 'uploadForm', className: 'uploader', encType: 'multipart/form-data' },
          React.createElement('input', { ref: 'file', type: 'file', name: 'file', className: 'upload-file' }),
          React.createElement('input', { type: 'button', ref: 'button', value: 'Upload', onClick: e => {
              this.sendImageToServer(e);
            } })
        ),
        React.createElement('img', { src: this.state.image })
      );
    }
  }]);

  return Profile;
}(React.Component);

module.exports = Profile;