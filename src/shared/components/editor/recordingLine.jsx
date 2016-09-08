import React from 'react';

const AudioComponent = require('../record-audio-component');

const RecordingLine = () => (
  <div className="editor-recording">
    <span contentEditable="false">
      <AudioComponent />
    </span>
  </div>
);

module.exports = RecordingLine;
