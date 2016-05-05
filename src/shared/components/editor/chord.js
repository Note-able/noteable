'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
import { KeyCodes } from '../helpers/keyCodes';

module.exports = class Chord extends React.Component {
  constructor (props, context) {
    super(props, context);

    this.state = { contentEditable: true }
  }

  componentDidMount () {
    this.setCaretInEmptyDiv.bind(this)();
  }

  handleKeyDown(e) {
    if(e.keyCode === KeyCodes.enter) { //enter
      e.preventDefault();
      this.props.updateSelectedToTextLine();
    } else if(e.keyCode !== KeyCodes.space && e.keyCode !== KeyCodes.backspace && (e.keyCode < 48 || e.keyCode > 90)){
      e.preventDefault();
    }
    e.stopPropagation();
  }

  setCaretInEmptyDiv () {
    const element = ReactDOM.findDOMNode(this.refs.chord);
    const range = document.createRange();
    range.selectNodeContents(element);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  render() {
    return (
      <span className="editor-chord-container">
        {this.props.character}
        <span contentEditable="false">
          <span
          className="editor-chord"
          ref="chord"
          onKeyDown={ this.handleKeyDown.bind(this) }
          contentEditable={ this.state.contentEditable }>
          </span>
        </span>
      </span>
    );
  }
}
