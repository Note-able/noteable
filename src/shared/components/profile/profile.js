import React from 'react';
import AJAX from '../../ajax';

class Profile extends React.Component {
  constructor (props, context) {
    super(props, context);

    this.state = {}
  }

  componentDidMount () {
    AJAX.Get(`/me`, (response) => {
      this.loadUser(JSON.parse(response));
    });
  }

  loadUser (user) {
    this.setState({ name: user.name, email: user.email, bio: user.bio, location: user.location, averageEventRating: user.average_event_rating, image: user.profileImage });
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
      <div className="profile">
        <div>{ this.state.name }</div>
        <div>{ this.state.email }</div>
        <div>{ this.state.bio }</div>
        <div>{ this.state.location }</div>
        <div>{ this.state.averageEventRating }</div>
        <form ref="uploadForm" className="uploader" encType="multipart/form-data" >
          <input ref="file" type="file" name="file" className="upload-file"/>
          <input type="button" ref="button" value="Upload" onClick={ (e) => { this.sendImageToServer(e) }} />
        </form>
        <img src={this.state.image}></img>
      </div>
    );
  }
}

module.exports = Profile;