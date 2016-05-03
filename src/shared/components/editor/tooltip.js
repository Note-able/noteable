'use strict';

const React = require('react');

module.exports = class Tooltip extends React.Component {
  constructor (props, context) {
    super(props, context);
  }

  render() {
    const tooltipStyle = {
      position: 'absolute',
      top: this.props.rect.top - 30,
      left: this.props.rect.left
    };

    return (
      <div ref="tooltip" className = "editor-tooltip" style={tooltipStyle}>
        <div className="tooltip-option" onClick={ this.props.recordingLine }>Record</div>
        <div className="tooltip-option" onClick={ this.props.ChordLine }>Chord</div>
      </div>
    );
  }
}
