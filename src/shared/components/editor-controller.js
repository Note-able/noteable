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
    this.state = { lineData: lineData, selectedLine: lineData[0], selectedIndex: 0 };
    this.enterPressed = false;
    this.keyMap = [];
    this.linesToUpdate = [];
    this.shouldUpdate = true;
  }

  onComponentDidUpdate () {
    this.linesToUpdate = [];
  }

  shouldComponentUpdate () {
    return this.checkIfShouldUpdate.bind(this)();
  }

  checkIfShouldUpdate () {
    const shouldUpdate = this.shouldUpdate;
    this.shouldUpdate = true;
    return shouldUpdate;
  }

  newLine (id, text) {
    return { lineId: id, text: text }
  }

  handleClick (e) {
    console.log('clicked section');
    console.log(e);
  }

  handlePaste (e) {
    console.log('paste');
    e.preventDefault();
  }

  handleKeyDown (e) {
    this.keyMap[e.keyCode] = e.type === 'keydown';
    if(e.keyCode === 13) { //enter
      e.preventDefault();
      this.enterPressed = true;
      const selection = window.getSelection();
      const selectionOffset = selection.baseOffset;
      const text = selection.anchorNode.data;
      const movedText = text.substring(selectionOffset, text.length);
      const remainingText = text.substring(0, selectionOffset);
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
    }
  }

  handleOnFocus () {
    this.isFocused = true;
    if(this.state.lineData.length === 1) {
      this.refs.section.childNodes[this.state.selectedIndex].focus()
    }
  }

  handleOnBlur () {
    this.isFocused = false;
  }

  updateSelected (lineId) {
    this.shouldUpdate = false;
    const selectedIndex = this.state.lineData.findIndex((e) => { return e.lineId === lineId });
    const selectedLine = this.state.lineData[selectedIndex];
    this.setState({ selectedLine : selectedLine, selectedIndex : selectedIndex });
  }

  handleEnter (oldText, movedText) {
    ++this.lines;
    const lineData = this.state.lineData;
    const newLine = this.newLine(this.lines, movedText)
    const selected = this.state.selectedLine;
    let selectedIndex = this.state.selectedIndex;
    let newSelected = null;
    if(selectedIndex !== (lineData.length - 1)) {
      lineData[selectedIndex].text = oldText;
      lineData.splice(selectedIndex + 1, 0, newLine);
      selectedIndex = selectedIndex + 1;
      newSelected = lineData[selectedIndex];
    } else {
      lineData[lineData.length - 1].text = oldText;
      lineData.push(newLine);
      selectedIndex = lineData.length - 1;
      newSelected = lineData[selectedIndex];
    }

    this.linesToUpdate[selected.lineId] = true;
    this.linesToUpdate[newSelected.lineId] = true;

    this.setState({ lineData: lineData, selectedIndex: selectedIndex, selectedLine: newSelected });
  }

  handleDelete () {
    console.log('delete');
  }

  handleUpArrow (offset, lineId) {
    if(this.state.lineData[0].lineId !== lineId){
      const index = this.state.lineData.findIndex((e) => { return e.lineId === lineId });
      this.setState({ selectedIndex: index - 1, selectedLine: this.state.lineData[index - 1], selectedLineoffset: offset });
    }
  }

  handleDownArrow (offset, lineId) {
    if(this.state.lineData[this.state.lineData.length - 1].lineId !== lineId){
      const index = this.state.lineData.findIndex((e) => { return e.lineId === lineId });
      this.setState({ selectedIndex: index + 1, selectedLine: this.state.lineData[index + 1], offset: offset });
    }
  }

  render () {
    const lineElements = this.state.lineData.map((line) => {
      const selected = line.lineId === this.state.lineData[this.state.selectedIndex].lineId;
      const offset = selected ? this.state.offset : 0;
      const shouldUpdateText = this.linesToUpdate[line.lineId]
      return (<Line key={ line.lineId } lineId={ line.lineId } text={ line.text } selected={ selected } offset={ offset }
        shouldUpdateText={ shouldUpdateText }
        updateSelected={ this.updateSelected.bind(this) }
        handleEnter={ this.handleEnter.bind(this) }
        handleDelete={ this.handleDelete.bind(this) }
        handleUpArrow={ this.handleUpArrow.bind(this) }
        handleDownArrow={ this.handleDownArrow.bind(this) }></Line>);
    });
    return (
    <div className="section" ref="section" name={ this.props.sectionId } contentEditable="true"
      onPaste={ this.handlePaste.bind(this) }
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
    this.state = { text: this.props.text, selected: selected };
    this.enterPressed = false;
    this.keyMap = [];
  }

  componentDidMount () {
    const elem = ReactDOM.findDOMNode(this.refs.line);
    elem.innerHTML = this.props.text;
    if(this.props.selected){
      this.setCaretPosition.bind(this)(this.props.offset);
    }
  }

  componentDidUpdate () {
    console.log(`${this.props.lineId} did update`);
    if(this.props.shouldUpdateText){
      const elem = ReactDOM.findDOMNode(this.refs.line);
      elem.innerHTML = this.props.text;
    }
    if(this.props.selected){
      this.setCaretPosition.bind(this)(this.props.offset);
    }
  }

  setCaretInEmptyDiv () {
    const elem = ReactDOM.findDOMNode(this.refs.line);
    const range = document.createRange();
    range.selectNodeContents(elem);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  componentWillReceiveProps (nextProps) {
    console.log(nextProps);
  }

  setCaretPosition (position) {
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
      this.setCaretInEmptyDiv.bind(this)();
    }
  }

  handleClick (e) {
    console.log('clicked');
    const elem = e.target;
    elem.focus();
    this.props.updateSelected(this.props.lineId);
  }

  render () {
    return (
      <p
      className={ 'editor-line' }
      name={ this.props.lineId }
      ref="line"
      onClick={ this.handleClick.bind(this) }>
      </p>
    );
  }
}
