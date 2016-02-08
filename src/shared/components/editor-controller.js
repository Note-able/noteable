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
    this.state = { lineData: lineData, selectedLine: lineData[0], selectedLineIndex: 0 };
    this.enterPressed = false;
    this.keyMap = [];
  }

  newLine (id, text) {
    return { lineId: id, text: text }
  }

  handleClick () {
    console.log('clicked');
  }

  handlePaste (e) {
    console.log('paste');
    e.preventDefault();
  }

  handleKeyPress (e) {
    e.preventDefault();
    const charCode = e.which || e.keyCode;
    const charTyped = String.fromCharCode(charCode);
    const newText = this.state.selectedLine.text + charTyped;
    const offset = window.getSelection().focusOffset + 1;
    const newLine = this.state.selectedLine;
    newLine.text = newText;
    const newLineData = this.setTextOfChild.bind(this)(newText);
    this.setState({ lineData: newLineData, selectedLine: newLine, offset: offset });
  }

  setTextOfChild (text) {
    const lineData = this.state.lineData;
    lineData[this.state.selectedLineIndex].text = text;
    return lineData;
  }

  handleKeyDown (e) {
    this.keyMap[e.keyCode] = e.type === 'keydown';
    if(e.keyCode === 13) { //enter
      e.preventDefault();
      this.enterPressed = true;
      const selectionOffset = window.getSelection().baseOffset;
      const movedText = this.state.selectedLine.text.substring(selectionOffset, this.state.selectedLine.text.length);
      const remainingText = this.state.selectedLine.text.substring(0, selectionOffset);
      this.handleEnter.bind(this)(remainingText, movedText);
    } else if(e.keyCode === 38) { //upArrow
      e.preventDefault();
      const selectionOffset = window.getSelection().baseOffset;
      this.handleUpArrow(selectionOffset, this.state.selectedLine.lineId);
    } else if(e.keyCode === 40) { //downArrow
      e.preventDefault();
      const selectionOffset = window.getSelection().baseOffset;
      this.handleDownArrow(selectionOffset, this.state.selectedLine.lineId);
    }
  }

  handleKeyUp (e){
    this.keyMap[e.keyCode] = e.type === 'keydown';
    if (e.keyCode === 8) { //delete
      if(window.getSelection().baseOffset === 0) {
        this.handleDelete(this.state.selectedLine.text);
      }
      const newText = ReactDOM.findDOMNode(this.refs.line).innerHTML;
      this.setState({ text: newText });
    }
  }

  handleOnFocus () {
    this.isFocused = true;
  }

  handleOnBlur () {
    this.isFocused = false;
  }

  handleEnter (oldText, movedText) {
    ++this.lines;
    const lineData = this.state.lineData;
    const newLine = this.newLine(this.lines, movedText)
    let selectedIndex = this.state.selectedLineIndex;
    let selected = this.state.selectedLine;
    if(selectedIndex !== (lineData.length - 1)) {
      lineData[selectedIndex].text = oldText;
      lineData.splice(selectedIndex + 1, 0, newLine);
      selectedIndex = selectedIndex + 1;
      selected = lineData[selectedIndex];
    } else {
      lineData[lineData.length - 1].text = oldText;
      lineData.push(newLine);
      selectedIndex = lineData.length - 1
      selected = lineData[selectedIndex];
    }
    this.setState({ lineData: lineData, selectedLineIndex: selectedIndex, selectedLine: selected });
  }

  handleDelete () {
    console.log('delete');
  }

  handleUpArrow (offset, lineId) {
    if(this.state.lineData[0].lineId !== lineId){
      const index = this.state.lineData.findIndex((e) => { return e.lineId === lineId });
      this.setState({ selectedLineIndex: index - 1, offset: offset });
    }
  }

  handleDownArrow (offset, lineId) {
    if(this.state.lineData[this.state.lineData.length - 1].lineId !== lineId){
      const index = this.state.lineData.findIndex((e) => { return e.lineId === lineId });
      this.setState({ selectedLineIndex: index + 1, offset: offset });
    }
  }

  render () {
    const lineElements = this.state.lineData.map((line) => {
      const selected = line.lineId === this.state.lineData[this.state.selectedLineIndex].lineId;
      const offset = selected ? this.state.offset : null;
      return (<Line key={ line.lineId } lineId={ line.lineId } text={ line.text } selected={ selected } offset={ offset }
        handleEnter={ this.handleEnter.bind(this) }
        handleDelete={ this.handleDelete.bind(this) }
        handleUpArrow={ this.handleUpArrow.bind(this) }
        handleDownArrow={ this.handleDownArrow.bind(this) }></Line>);
    });
    return (
    <div className="section" ref="section" name={ this.props.sectionId } contentEditable="true"
      onPaste={ this.handlePaste.bind(this) }
      onKeyPress={ this.handleKeyPress.bind(this) }
      onKeyDown={ this.handleKeyDown.bind(this) }
      onKeyUp={ this.handleKeyUp.bind(this) }
      onClick={ this.handleClick.bind(this) }
      onFocus={ this.handleOnFocus.bind(this) }
      onBlur={ this.handleOnBlur.bind(this) }>
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

  /*componentDidUpdate () {
    if (this.shouldFocus) {
      ReactDOM.findDOMNode(this.refs.line).focus();
      this.shouldFocus = false;
    }
    if(!this.enterPressed && this.isFocused) {
      this.setCaretPosition.bind(this)();
    } else {
      this.enterPressed = false;
    }
  }*/
  componentDidUpdate () {
    this.setCaretPosition.bind(this)();
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
    if(element.childNodes.length !== 0 && this.props.selected) {
      const caretPos = this.state.caretOffset > element.firstChild.length ? element.firstChild.length : this.state.caretOffset;
      const selection = window.getSelection();
      const range = document.createRange();
      range.setStart(element.firstChild, caretPos);
      range.setEnd(element.firstChild, caretPos);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  handleClick () {
    console.log('clicked');
    if(this.state.selected === '') {
      const selectionOffset = window.getSelection().baseOffset;
      this.setState({ selected: 'selected', caretOffset: selectionOffset });
    }
  }

  render () {
    return (
      <div
      className={ `editor-line ${ this.state.selected }` }
      name={ this.props.lineId }
      ref="line">
        { this.props.text }
      </div>
    );
  }
}
