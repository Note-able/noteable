'use strict';

const React = require(`react`);
const Login = require(`./login/login.js`);
const Logout = require(`./login/logout.js`);
const RecordRTC = require('recordrtc');
let recorder;

module.exports = class AudioComponent extends React.Component {
  constructor (props, context) {
    super(props, context);

    this.state = { };
  }
  componentDidMount () {
    const mediaConstraints = {
      audio: {
        mandatory: {
          echoCancellation: true,
          googAutoGainControl: true,
          googNoiseSuppression: true,
          googHighpassFilter: true
        }
      }
    };

    navigator.webkitGetUserMedia(mediaConstraints, this.successCallback, this.errorCallback);
  }
  successCallback (stream) {
    const options = {
      bufferSize: 16384,
      type: 'audio',
      audioBitsPerSecond: 128000,
    };

    recorder = RecordRTC(stream, options);
  }
  errorCallback (error) {
    window.alert(error);
  }
  startRecording () {
    recorder.startRecording();
  }
  stopRecording () {
    recorder.stopRecording((audioURL) => {
      console.log(audioURL);

      const recordedBlob = recorder.getBlob();

      recorder.getDataURL((dataURL) => {
        this.setState({
          audioUrl: audioURL,
          dataUrl: dataURL,
          blob: recordedBlob
        });
      });
    });
  }
  sendAudioToServer () {
    const formData = new FormData();
    formData.append('file', this.state.blob);

    const request = new XMLHttpRequest();
    request.open('POST', '/post-blob');
    request.send(formData);
  }
  renderGrid () {
    return (
      <div>
        <div className="testing-vertical"></div>
        <div className="testing-horizontal"></div>
      </div>
    );
  }
  render () {
    return(
      <div>
        <link href="/css/bundle.css" rel="stylesheet" type="text/css"/>
        <div>
          <div onClick={ () => {this.startRecording()} } className="record-button">Record</div>
          <div onClick={ () => {this.stopRecording()} } className="stop-button">Stop Recording</div>
          <button onClick= { () => { this.sendAudioToServer() } } >Send</button>
          <audio controls>
            <source src={this.state.audioUrl} type="audio/mpeg"/>
          </audio>
        </div>
      </div>
    );
  }
}
