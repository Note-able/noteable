import { React, Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';

import { KeyCodes } from '../helpers/keyCodes';

module.exports = class Chord extends React.Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    updateSelectedToTextLine: PropTypes.func.isRequired,
  }

  state = {
    contentEditable: true
  };

  componentDidMount() {
    this.setCaretInEmptyDiv();
  }

  handleKeyDown = e => {
    if (e.keyCode === KeyCodes.enter) {
      e.preventDefault();
      this.props.updateSelectedToTextLine();
    } else if (e.keyCode !== KeyCodes.space && e.keyCode !== KeyCodes.backspace && (e.keyCode < 48 || e.keyCode > 90)) {
      e.preventDefault();
    }

    e.stopPropagation();
  };

  getDataForPost = () => {
    const element = findDOMNode(this.refs.chord);
    return { index: this.props.index, text: element.innerHTML };
  };

  setCaretInEmptyDiv = () => {
    const element = findDOMNode(this.refs.chord);
    const range = document.createRange();
    range.selectNodeContents(element);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  };

  render() {
    return (
      <span className="editor-chord-container">
        <span contentEditable="false">
          <span
            className="editor-chord"
            ref="chord"
            onKeyDown={this.handleKeyDown}
            contentEditable={this.state.contentEditable}
            suppressContentEditableWarning
          >
            {this.props.text}
          </span>
        </span>
      </span>
    );
  }
};
