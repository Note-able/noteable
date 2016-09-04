'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const AudioComponent = require('../record-audio-component');

module.exports = class RecordingLine extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return React.createElement(
      'div',
      { className: 'editor-recording' },
      React.createElement(
        'span',
        { contentEditable: 'false' },
        React.createElement(AudioComponent, null)
      )
    );
  }
};