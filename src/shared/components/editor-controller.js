'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const Router = require('react-router');

module.exports = class EditorController extends React.Component {
  constructor (props, context) {
    super(props, context);

    this.sections = 0;
  }

  render () {
    ++this.sections;
    return (
    <main className="editor" contentEditable="false">
      <Section sectionId={this.sections}></Section>
    </main>
    );
  }
}

class Section extends React.Component {
  constructor ( props, context) {
    super(props, context);

    this.lines = 0;
    const lineData = [this.newLine (this.lines, '')];
    this.state = { lineData: lineData, selectedLine: lineData[0] };
  }

  newLine (id, text) {
    return { lineId: id, text: text }
  }

  handleEnter (text, lineId) {
    ++this.lines;
    const lineData = this.state.lineData;
    const newLine = this.newLine(this.lines, text)
    let selected = this.state.selected;
    if(lineId !== lineData[lineData.length - 1].lineId) {
      const index = lineData.findIndex((e) => { return e.lineId === lineId });
      lineData.splice(index + 1, 0, newLine);
      selected = lineData[index + 1];
    } else {
      lineData.push(newLine);
      selected = lineData[lineData.length - 1];
    }
    this.setState({ lineData: lineData, selectedLine: selected});
  }

  handleDelete () {

  }

  handleUpArrow (offset, lineId) {
    if(this.state.lineData[0].lineId !== lineId){
      const index = this.state.lineData.findIndex((e) => { return e.lineId === lineId });
      this.setState({ selectedLine: this.state.lineData[index - 1], offset: offset });
    }
  }

  handleDownArrow (offset, lineId) {
    if(this.state.lineData[this.state.lineData.length - 1].lineId !== lineId){
      const index = this.state.lineData.findIndex((e) => { return e.lineId === lineId });
      this.setState({ selectedLine: this.state.lineData[index + 1], offset: offset });
    }
  }

  render () {
    const lineElements = this.state.lineData.map((line) => {
      const selected = line.lineId === this.state.selectedLine.lineId;
      const offset = selected ? this.state.offset : null;
      return (<Line key={ line.lineId } lineId={ line.lineId } text={ line.text } selected={ selected } offset={ offset }
        handleEnter={ this.handleEnter.bind(this) }
        handleDelete={ this.handleDelete.bind(this) }
        handleUpArrow={ this.handleUpArrow.bind(this) }
        handleDownArrow={ this.handleDownArrow.bind(this) }></Line>);
    });
    return (
    <div className="section" ref="section" name={ this.props.sectionId }>
      { lineElements }
    </div>
    );
  }
}

class Line extends React.Component {
  constructor (props, context) {
    super(props, context);

    const selected = this.props.selected ? 'selected' : '';
    this.state = { text: this.props.text, selected: selected, caretOffset: 0 };
    this.enterPressed = false;
    this.keyMap = [];
  }

  componentDidMount () {
    if(this.props.selected){
      ReactDOM.findDOMNode(this.refs.line).focus();
    }
  }

  componentDidUpdate () {
    if (this.shouldFocus) {
      ReactDOM.findDOMNode(this.refs.line).focus();
      this.shouldFocus = false;
    }
    if(!this.enterPressed && this.isFocused) {
      this.setCaretPosition.bind(this)();
    } else {
      this.enterPressed = false;
    }
  }

  componentWillReceiveProps (nextProps) {
    const selected = nextProps.selected ? 'selected' : '';
    const offset = nextProps.offset == null ? 0 : nextProps.offset;
    this.shouldFocus = nextProps.selected;
    //const text = this.state.text;
    //if(this.props.text)
    this.setState({ selected: selected, caretOffset: offset });
  }

  setCaretPosition () {
    const element = ReactDOM.findDOMNode(this.refs.line);
    if(element.childNodes.length !== 0 && this.isFocused) {
      const caretPos = this.state.caretOffset > element.firstChild.length ? element.firstChild.length : this.state.caretOffset;
      const selection = window.getSelection();
      const range = document.createRange();
      range.setStart(element.firstChild, caretPos);
      range.setEnd(element.firstChild, caretPos);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  handlePaste (e) {
    console.log('paste');
    e.preventDefault();
  }

  handleKeyPress (e) {
    e.preventDefault();
    const charCode = e.which || e.keyCode;
    const charTyped = String.fromCharCode(charCode);
    const newText = this.state.text + charTyped;
    const offset = window.getSelection().focusOffset + 1;
    this.setState({ text: newText, caretOffset: offset });
  }

  handleKeyDown (e) {
    this.keyMap[e.keyCode] = e.type === 'keydown';
    if(e.keyCode === 13) { //enter
      e.preventDefault();
      this.enterPressed = true;
      const selectionOffset = window.getSelection().baseOffset;
      const movedText = this.state.text.substring(selectionOffset, this.state.text.length);
      const remainingText = this.state.text.substring(0, selectionOffset);
      this.props.handleEnter(movedText, this.props.lineId);
      this.setState({ text: remainingText });
    } else if(e.keyCode === 38) { //upArrow
      e.preventDefault();
      const selectionOffset = window.getSelection().baseOffset;
      this.props.handleUpArrow(selectionOffset, this.props.lineId);
    } else if(e.keyCode === 40) { //downArrow
      e.preventDefault();
      const selectionOffset = window.getSelection().baseOffset;
      this.props.handleDownArrow(selectionOffset, this.props.lineId);
    }
  }

  handleKeyUp (e){
    this.keyMap[e.keyCode] = e.type === 'keydown';
    if (e.keyCode === 8) { //delete
      const newText = ReactDOM.findDOMNode(this.refs.line).innerHTML;
      this.setState({ text: newText });
    }
  }

  handleClick () {
    console.log('clicked');
    if(this.state.selected === '') {
      const selectionOffset = window.getSelection().baseOffset;
      this.setState({ selected: 'selected', caretOffset: selectionOffset });
    }
  }

  handleOnFocus () {
    this.isFocused = true;
  }

  handleOnBlur () {
    this.isFocused = false;
    this.setState({ selected: '' });
  }

  render () {
    return (
      <p
      className={ `editor-line { this.state.selected }` }
      name={ this.props.lineId }
      ref="line"
      onPaste={ this.handlePaste.bind(this) }
      onKeyPress={ this.handleKeyPress.bind(this) }
      onKeyDown={ this.handleKeyDown.bind(this) }
      onKeyUp={ this.handleKeyUp.bind(this) }
      onClick={ this.handleClick.bind(this) }
      onFocus={ this.handleOnFocus.bind(this) }
      onBlur={ this.handleOnBlur.bind(this) }
      contentEditable="true">
        { this.state.text}
      </p>
    );
  }
}
