import { React, Component, PropTypes } from 'react';

module.exports = class Tooltip extends Component {
  static propTypes = {
    addChord: PropTypes.func.isRequired,
    addRecordingLine: PropTypes.func.isRequired,
    rect: PropTypes.shape({
      top: PropTypes.number,
      left: PropTypes.number,
    }),
  }

  handleMouseDown(handler, e) {
    handler();
    e.preventDefault();
  }

  render() {
    const tooltipStyle = {
      position: 'absolute',
      top: this.props.rect.top - 30,
      left: this.props.rect.left,
    };

    return (
      <div ref="tooltip" className="editor-tooltip" style={tooltipStyle}>
        <div className="tooltip-option" onMouseDown={() => this.handleMouseDown(this.props.addRecordingLine)}>Record</div>
        <div className="tooltip-option" onMouseDown={() => this.handleMouseDown(this.props.addChord)}>Chord</div>
      </div>
    );
  }
};
