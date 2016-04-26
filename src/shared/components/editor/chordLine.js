'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const AudioComponent = require('../record-audio-component');

module.exports = class ChordLine extends React.Component {
  constructor (props, context) {
    super(props, context);

    this.state = { contentEditable: true, text: new Array(props.offset + 1).join(' ') };
  }

  handleKeyDown(e) {
    if(e.keyCode === 13) { //enter
      e.preventDefault();
      this.setState({ contentEditable: false });
    }
  }

  componentWillReceiveProps(nextProps) {
    let text = this.state.text;
    if(text.length < nextProps.offset)
      text += new Array(props.offset - text.length + 1).join(' ');
    this.setState({ contentEditable: true, text: text });
  }

  render() {
    return (
      <p
      className={ 'editor-chord-line' }
      name={ this.props.lineId }
      ref="chordLine"
      contentEditable={ this.state.contentEditable }>
        {this.state.text}
      </p>
    );
  }
}
