'use strict';

const React = require('react');

module.exports = class Tooltip extends React.Component {
  constructor (props, context) {
    super(props, context);
  }

  handleMouseDown(handler, e) {
    console.log('mousedown');
    handler();
    e.preventDefault();
  }

  render() {
    const tooltipStyle = {
      position: 'absolute',
      top: this.props.rect.top - 30,
      left: this.props.rect.left
    };

    return (
      <div ref="tooltip" className = "editor-tooltip" style={tooltipStyle}>
        <div className="tooltip-option" onMouseDown={ this.handleMouseDown.bind(this, this.props.addRecordingLine) }>Record</div>
        <div className="tooltip-option" onMouseDown={ this.handleMouseDown.bind(this, this.props.addChord) }>Chord</div>
      </div>
    );
  }
}
