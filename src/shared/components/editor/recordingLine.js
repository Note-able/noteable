'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const AudioComponent = require('../record-audio-component');

module.exports = class RecordingLine extends React.Component {
  constructor (props, context) {
    super(props, context);
  }

  render() {
    return (
      <div className = "editor-recording" contentEditable="false">
        <AudioComponent />
      </div>
    );
  }
}
