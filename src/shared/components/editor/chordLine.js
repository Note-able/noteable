'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const AudioComponent = require('../record-audio-component');
import { KeyCodes } from '../helpers/keyCodes';

module.exports = class ChordLine extends React.Component {
  constructor (props, context) {
    super(props, context);

    this.state = { contentEditable: true, text: props.text == null ? new Array(props.offset + 1).join(' ') : props.text };
    this.updateOffset = true;
  }

  componentDidMount () {
    this.setCaretPosition.bind(this)(this.props.offset);
  }

  componentDidUpdate () {
    if(this.updateOffset) {
      this.setCaretPosition.bind(this)(this.props.offset);
    }
    this.updateOffset = true;
  }

  componentWillReceiveProps(nextProps) {
    let text = this.state.text;
    if(text.length < nextProps.offset) {
      text += new Array(nextProps.offset - text.length + 1).join(' ');
    }
    this.setState({ contentEditable: true, text: text });
  }

  handleKeyDown(e) {
    if(e.keyCode === KeyCodes.enter) { //enter
      e.preventDefault();
      this.props.updateSelectedToTextLine();
      this.setState({ contentEditable: false });
    } else if(e.keyCode !== KeyCodes.space && e.keyCode !== KeyCodes.backspace (e.keyCode < 48 || e.keyCode > 90)){
      e.preventDefault();
    }
    e.stopPropagation();
  }

  handleClick () {
    this.props.updateSelected(this.props.lineId);
    this.setState({ contentEditable: true });
    this.updateOffset = false;
  }

  getDataForPost () {
    return this.getLineContent();
  }

  getLineContent () {
    const element = ReactDOM.findDOMNode(this.refs.chordLine);
    return { lineId: this.props.lineId, type: this.props.type, text: element.innerHTML };
  }

  setCaretInEmptyDiv () {
    const element = ReactDOM.findDOMNode(this.refs.chordLine);
    const range = document.createRange();
    range.selectNodeContents(element);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  setCaretPosition (position) {
    const element = ReactDOM.findDOMNode(this.refs.chordLine);
    if(element.childNodes.length !== 0) {
      const caretPos = position > element.firstChild.length ? element.firstChild.length : position;
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(element);
      range.collapse(false);
      range.setStart(element.firstChild, caretPos);
      range.setEnd(element.firstChild, caretPos);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      this.setCaretInEmptyDiv.bind(this)();
    }
  }

  render() {
    return (
      <span contentEditable="false">
        <p
        className={ 'editor-chord-line' }
        name={ this.props.lineId }
        ref="chordLine"
        onKeyDown={ this.handleKeyDown.bind(this) }
        onClick= { this.handleClick.bind(this) }
        contentEditable={ this.state.contentEditable }>
          {this.state.text}
        </p>
      </span>
    );
  }
}
