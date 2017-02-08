'use strict';

const React = require('react');
let RecordRTC;
const Moment = require('moment');
let recorder;

module.exports = class AudioComponent extends React.Component {
  constructor (props) {
    super(props);

    this.state = { isRecording: false };
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
    RecordRTC = require('recordrtc');

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
    this.setState({
      isRecording: true
    });
  }
  stopRecording () {
    recorder.stopRecording((audioURL) => {
      const recordedBlob = recorder.getBlob();

      recorder.getDataURL((dataURL) => {
        this.setState({
          audioUrl: audioURL,
          dataUrl: dataURL,
          blob: recordedBlob,
          isRecording: false, 
          duration: recordedBlob.size / (176000),
        });
      });

      this.recordButtonFunction = () => { this.startRecording() };
    });
  }
  sendAudioToServer () {
    const reader = new FileReader();

    reader.onload = () => {
      const dataUrl = reader.result;
      const base64 = dataUrl.split(',')[1];
      const formData = new FormData();
      formData.append('name', 'testing.wav');
      formData.append('file', base64);

      const request = new XMLHttpRequest();
      request.open('POST', '/post-blob');
      request.send(formData);
    };

    reader.readAsDataURL(this.state.blob);
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
        <div>
          <div onClick={ this.state.isRecording ? () => { this.stopRecording() } : () => { this.startRecording() } } className="record-button"></div>
          <div onClick={ () => { this.stopRecording() } } className="stop-button"></div>
          <audio src={ this.state.audioUrl } ref={ref => { this._thing = ref; }} className="audio-player" controls/>
          <button onClick= { () => { this.sendAudioToServer() } } >Send</button>
        </div>
      </div>
    );
  }
}
