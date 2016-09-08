import React, { PropTypes, Component } from 'react';
import { findDOMNode } from 'react-dom';

const Chord = require('./chord');

class Line extends Component {
  static propTypes = {
    chords: PropTypes.arrayOf(PropTypes.shape({})),
    lineId: PropTypes.number.isRequired,
    updateSelected: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
    text: PropTypes.string,
    type: PropTypes.string,
    updateTextFunction: PropTypes.func.isRequired,
    offset: PropTypes.number,
    selected: PropTypes.bool,
  };

  state = {
    selected: this.props.selected ? 'selected' : '',
    enterPressed: false,
    keyMap: [],
  };

  componentDidMount() {
    if (this.props.selected) {
      this.setCaretPosition(this.props.offset);
    }
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.html !== findDOMNode(this._line).innerHTML;
  }

  componentDidUpdate(prevProps) {
    if (this.props.lineId === prevProps.lineId
      && this.props.text === prevProps.text
      && this.props.selected === prevProps.selected
      && this.props.offset === prevProps.offset) {
      return;
    }

    if (this.props.selected) {
      this.setCaretPosition(this.props.offset);
    }
  }

  componentWillUnmount() {
    if (this.props.handleDelete) {
      this.props.handleDelete(findDOMNode(this._line).innerHTML);
    }
  }

  getDataForPost = () => {
    const chords = [];
    if (this.props.chords) {
      for (const chord of this.props.chords) {
        const chordContent = this[`chord${chord.index}`].getDataForPost();
        chords.push(chordContent);
      }
    }

    const lineContent = this.getLineContent();
    return { lineId: this.props.lineId, type: this.props.type, text: lineContent, chords };
  };

  getLineContent = () => {
    const element = findDOMNode(this._line).cloneNode(true);
    while (element.lastElementChild) {
      element.removeChild(element.lastElementChild);
    }
    return element.innerText;
  };

  setCaretInEmptyDiv = () => {
    const element = findDOMNode(this._line);
    const range = document.createRange();
    range.selectNodeContents(element);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  };

  setCaretPosition = (position) => {
    const element = findDOMNode(this._line);
    if (element.childNodes.length !== 0) {
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
      this.setCaretInEmptyDiv();
    }
  };

  handleClick = () => {
    console.log('click');
    this.props.updateSelected(this.props.lineId);
  };

  compareChords = (a, b) => a.index - b.index;

  render() {
    let lastTextIndex = 0;
    let content = [];
    if (this.props.chords) {
      const sortedChords = this.props.chords;
      sortedChords.sort(this.compareChords);
      const chords = sortedChords.map((chord) => {
        const text = this.props.text.substring(lastTextIndex, chord.index);
        lastTextIndex = chord.index;
        content.push(text);
        return (
          <Chord
            key={`chord${chord.index}`}
            ref={ref => { this[`chord${chord.index}`] = ref; }}
            index={chord.index}
            text={chord.text || ''}
            updateSelectedToTextLine={() => this.props.updateSelected(this.props.lineId)}
          />
        );
      });
      content.push(this.props.text.substring(lastTextIndex, this.props.text.length));
      for (let i = 0; i < chords.length; i++) {
        content.splice((i * 2) + 1, 0, chords[i]);
      }
    } else {
      content = this.props.text;
    }

    return (
      <p
        className={'editor-line'}
        name={this.props.lineId}
        ref={ref => { this._line = ref; }}
        onClick={this.handleClick}
        onChange={this.handleInput}
        suppressContentEditableWarning
      >
        {content}
      </p>
    );
  }
}

module.exports = Line;
