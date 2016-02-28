'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

const React = require('react');
const Login = require(`./login/login.js`);
const Logout = require(`./login/logout.js`);
const RecordRTC = require('recordrtc');
const Moment = require('moment');
let recorder;

module.exports = function (_React$Component) {
  _inherits(AudioComponent, _React$Component);

  function AudioComponent(props) {
    _classCallCheck(this, AudioComponent);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AudioComponent).call(this, props));

    _this.state = { isRecording: false };
    return _this;
  }

  _createClass(AudioComponent, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
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
  }, {
    key: 'successCallback',
    value: function successCallback(stream) {
      const options = {
        bufferSize: 16384,
        type: 'audio',
        audioBitsPerSecond: 128000
      };

      recorder = RecordRTC(stream, options);
    }
  }, {
    key: 'errorCallback',
    value: function errorCallback(error) {
      window.alert(error);
    }
  }, {
    key: 'startRecording',
    value: function startRecording() {
      recorder.startRecording();
      this.setState({
        isRecording: true
      });
    }
  }, {
    key: 'stopRecording',
    value: function stopRecording() {
      recorder.stopRecording(audioURL => {
        const recordedBlob = recorder.getBlob();

        recorder.getDataURL(dataURL => {
          this.setState({
            audioUrl: audioURL,
            dataUrl: dataURL,
            blob: recordedBlob,
            isRecording: false
          });
        });

        this.recordButtonFunction = () => {
          this.startRecording();
        };
      });
    }
  }, {
    key: 'sendAudioToServer',
    value: function sendAudioToServer() {
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
  }, {
    key: 'renderGrid',
    value: function renderGrid() {
      return React.createElement(
        'div',
        null,
        React.createElement('div', { className: 'testing-vertical' }),
        React.createElement('div', { className: 'testing-horizontal' })
      );
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          null,
          React.createElement('div', { onClick: this.state.isRecording ? () => {
              this.stopRecording();
            } : () => {
              this.startRecording();
            }, className: 'record-button' }),
          React.createElement('div', { onClick: () => {
              this.stopRecording();
            }, className: 'stop-button' }),
          React.createElement('audio', { src: this.state.audioUrl, className: 'audio-player', controls: true }),
          React.createElement(
            'button',
            { onClick: () => {
                this.sendAudioToServer();
              } },
            'Send'
          )
        )
      );
    }
  }]);

  return AudioComponent;
}(React.Component);