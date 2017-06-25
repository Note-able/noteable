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
        frameRate: 44100,
        channelCount: 1,
        sampleRate: 44100,
        sampleSize: 8
      }
    };
    RecordRTC = require('recordrtc');

    navigator.mediaDevices.getUserMedia(mediaConstraints).then(this.successCallback).catch(this.errorCallback);
  }
  successCallback (stream) {
    const options = {
      bufferSize: 16384,
      type: 'audio/mpeg',
      sampleRate: 44100,
      numberOfAudioChannels: 1,
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
          size: recordedBlob.size / 1000,
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
      formData.append('duration', this.state.duration);
      formData.append('name', 'testing.mp3');
      formData.append('size', `${this.state.size}kb`);
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
