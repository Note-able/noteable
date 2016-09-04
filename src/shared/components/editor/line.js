'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const Chord = require('./chord');
import { moveChords} from './actions/editor-actions';

class Line extends React.Component {
  constructor (props, context) {
    super(props, context);
    const selected = this.props.selected ? 'selected' : '';
    this.state = {};
    this.enterPressed = false;
    this.keyMap = [];
  };

  componentDidMount () {
    if(this.props.selected){
      this.setCaretPosition.bind(this)(this.props.offset);
    }
  };

  componentWillUpdate (nextProps) {
    this.updateTextFunction = nextProps.updateTextFunction;
  };

  componentDidUpdate (prevProps) {
    if (this.props.lineId === prevProps.lineId
      && this.props.text === prevProps.text
      && this.props.selected === prevProps.selected
      && this.props.offset === prevProps.offset) {
      return;
    }

    if(this.props.selected){
      this.setCaretPosition.bind(this)(this.props.offset);
    }
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.html !== ReactDOM.findDOMNode(this.refs.line).innerHTML;
  };

  componentWillUnmount() {
    if(this.props.handleDelete) {
      this.props.handleDelete(ReactDOM.findDOMNode(this.refs.line).innerHTML);
    }
  };

  getDataForPost = () => {
    const chords = [];
    if (this.props.chords) {
      for (const chord of this.props.chords) {
        const chordContent = this.refs[`chord${chord.index}`].getDataForPost();
        chords.push(chordContent);
      }
    }

    const lineContent = this.getLineContent();
    return { lineId: this.props.lineId, type: this.props.type, text: lineContent, chords: chords };
  };

  getLineContent = () => {
    const element = ReactDOM.findDOMNode(this.refs.line).cloneNode(true);
    while (element.lastElementChild) {
      element.removeChild(element.lastElementChild);
    }
    return element.innerText;
  };

  setCaretInEmptyDiv = () => {
    const element = ReactDOM.findDOMNode(this.refs.line);
    const range = document.createRange();
    range.selectNodeContents(element);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  };

  setCaretPosition = (position) => {
    const element = ReactDOM.findDOMNode(this.refs.line);
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
      this.setCaretInEmptyDiv();
    }
  };

  handleClick = () => {
    console.log('click');
    this.props.updateSelected(this.props.lineId);
  };

  compareChords = (a, b) => {
    return a.index - b.index;
  };

  render () {
    let lastTextIndex = 0;
    let content = [];
    if(this.props.chords){
      const sortedChords = this.props.chords;
      sortedChords.sort(this.compareChords);
      const chords = sortedChords.map((chord) => {
        const text = this.props.text.substring(lastTextIndex, chord.index);
        lastTextIndex = chord.index;
        content.push(text);
        return (<Chord key={`chord${chord.index}`} ref={`chord${chord.index}`} index={chord.index} text={ chord.text || '' } updateSelectedToTextLine={ () => this.props.updateSelected(this.props.lineId) }/>);
      });
      content.push(this.props.text.substring(lastTextIndex, this.props.text.length));
      for(let i = 0; i < chords.length; i++) {
        content.splice(i*2+1,0,chords[i]);
      }
    } else {
      content = this.props.text;
    }

    return (
      <p
      className={ 'editor-line' }
      name={ this.props.lineId }
      ref="line"
      onClick={ this.handleClick }
      onChange={ this.handleInput }
      suppressContentEditableWarning>
        {content}
      </p>
    );
  };
}

Line.propTypes = {
  lineId: React.PropTypes.number.isRequired,
  updateSelected: React.PropTypes.func.isRequired,
  handleDelete: React.PropTypes.func.isRequired,
  type: React.PropTypes.string,
  updateTextFunction: React.PropTypes.func,
  offset: React.PropTypes.number,
};

module.exports = Line;