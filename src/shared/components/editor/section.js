'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const Line = require('./line');
const RecordingLine = require('./recordingLine');
import { addLine } from './actions/editor-actions';
import { deleteLine } from './actions/editor-actions';
import { updateText } from './actions/editor-actions';
import { updateLines } from './actions/editor-actions';
import { updateSelected } from './actions/editor-actions';

class Section extends React.Component {
  constructor ( props, context) {
    super(props, context);

    this.lines = props.lines;
    this.state = {lineData: []};
    this.enterPressed = false;
    this.keyMap = [];
    this.shouldUpdate = true;
    this.newTextLine = this.props.newTextLine;
    this.newRecordingLine = this.props.newRecordingLine;
  }

  componentDidMount() {
    this.props.dispatch(addLine(this.props.sectionId, this.lines++, 0, 'text', ''));
  }

  shouldComponentUpdate () {
    return this.checkIfShouldUpdate.bind(this)();
  }

  checkIfShouldUpdate () {
    const shouldUpdate = this.shouldUpdate;
    this.shouldUpdate = true;
    return shouldUpdate;
  }

  getDataForPost () {
    console.log('section data being collected');
    for (const line in this.refs) {
      this.refs[line].getDataForPost();
    }
  }

  handleClick (e) {
    console.log('clicked section');
    console.log(e);
  }

  handlePaste (e) {
    console.log('paste');
    console.log(e);
    e.preventDefault();
    const plainText = e.clipboardData.getData('text/plain');
    if(plainText){
      const lineData = this.props.section.lineData;
      const lines = plainText.split('\n').filter((line) => { return line !== '' });
      let selectedIndex = this.props.section.selectedIndex;
      const selected = this.props.section.selectedLine;
      lineData[selectedIndex].text = lines[0];
      const lineActions = [];

      for(let i = 1; i < lines.length - 1; i++) {
        this.lines++;
        lineActions.push(addLine(this.props.sectionId, this.lines, selectedIndex + i, 'text', lines[i]));
      }
      if(lines.length > 1) {
        this.lines++;
        lineActions.push(addLine(this.props.sectionId, this.lines, selectedIndex + lines.length - 1, 'text', lines[lines.length - 1]));
      }
      lineActions.push(updateText(this.props.sectionId, selected.lineId, lines[0], 0, this.appendTextAfterDelete));
      selectedIndex = selectedIndex + lines.length - 1;
      this.props.dispatch(updateLines(this.props.sectionId, lineActions, selectedIndex, lines[lines.length - 1].length));
    }
  }

  handleKeyDown (e) {
    this.keyMap[e.keyCode] = e.type === 'keydown';
    /* Note: this is *probably* really bad. It should work by keeping a collection of functions for keycodes that need them,
      and then calling the function for that keycode if it exists instead of doing if else for all possible keys that have functions.
      Or I could use a switch statement at the very least. */
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
      this.handleUpArrow(selectionOffset, this.props.section.selectedLine.lineId);
    } else if(e.keyCode === 40) { //downArrow
      e.preventDefault();
      const selectionOffset = window.getSelection().baseOffset;
      this.handleDownArrow(selectionOffset, this.props.section.selectedLine.lineId);
    } else if (e.keyCode === 8) { //delete
      if(window.getSelection().baseOffset === 0 && this.props.section.selectedIndex !== 0) {
        e.preventDefault();
        const selectedIndex = this.props.section.selectedIndex;
        this.props.dispatch(deleteLine(this.props.sectionId, selectedIndex));
      }
    } else if (e.keyCode === 82) {
      if(this.keyMap[16] && this.keyMap[17]) {
        this.props.dispatch(addLine(this.props.sectionId, ++this.lines, this.props.section.selectedIndex + 1, 'recording', '', false));
      }
    }
  }

  handleKeyUp (e){
    this.keyMap[e.keyCode] = e.type === 'keydown';
    if (e.keyCode === 8) { //delete
    }
  }

  handleOnFocus () {
    this.isFocused = true;
    if(this.props.section.lineData.length === 1) {
      this.refs.section.childNodes[this.props.section.selectedIndex].focus()
    }
  }

  handleOnBlur () {
    this.isFocused = false;
  }

  updateSelected (lineId) {
    this.shouldUpdate = false;
    const selectedIndex = this.props.section.lineData.findIndex((e) => { return e.lineId === lineId });
    this.props.dispatch(updateSelected(this.props.sectionId, selectedIndex, 0));
  }

  handleEnter (remainingText, movedText) {
    ++this.lines;
    const lineData = this.props.section.lineData;
    const selected = this.props.section.selectedLine;
    const selectedIndex = this.props.section.selectedIndex;

    const lineActions = [addLine(this.props.sectionId, ++this.lines, selectedIndex + 1, 'text', movedText)];
    lineActions.push(updateText(this.props.sectionId, selected.lineId, remainingText, 0, this.setText));
    this.props.dispatch(updateLines(this.props.sectionId, lineActions, selectedIndex + 1, 0));
  }

  handleDelete (text) {
    console.log('delete');
    const selected = this.props.section.selectedLine;
    const selectedIndex = this.props.section.selectedIndex;
    const lineData = this.props.section.lineData;
    const offset = this.refs.section.childNodes[selectedIndex].innerHTML.length;
    lineData[selectedIndex].text = text;
    this.props.dispatch(updateText(this.props.sectionId, selected.lineId, text, offset, this.appendTextAfterDelete.bind(this)));
    //this.setState({ lineData: lineData, updateFunction: this.appendTextAfterDelete.bind(this), offset: offset }, this.clearLinesToUpdate.bind(this));
  }

  handleUpArrow (offset, lineId) {
    if(this.props.section.lineData[0].lineId !== lineId){
      const index = this.props.section.lineData.findIndex((e) => { return e.lineId === lineId });
      this.props.dispatch(updateSelected(this.props.sectionId, index - 1, offset));
    }
  }

  handleDownArrow (offset, lineId) {
    if(this.props.section.lineData[this.props.section.lineData.length - 1].lineId !== lineId){
      const index = this.props.section.lineData.findIndex((e) => { return e.lineId === lineId });
      this.props.dispatch(updateSelected(this.props.sectionId, index + 1, offset));
    }
  }

  clearLinesToUpdate () {
    this.linesToUpdate =[];
  }

  setText (element, text) {
    element.innerHTML = text;
    return element.innerHtml;
  }

  appendTextAfterDelete (element, text) {
    element.innerHTML += text;
    return element.innerHtml;
  }

  render () {
    const lineData = this.props.section.lineData;
    const lineElements = lineData.map((line) => {
      if(line.type === 'text') {
        const selected = line.lineId === this.props.section.lineData[this.props.section.selectedIndex].lineId;
        const offset = selected ? this.props.section.offset : 0;
        const updateTextFunction = line.updateTextFunction;
        return (<Line key={ line.lineId }
          ref={`line${ line.lineId }`}
          lineId={ line.lineId }
          text={ line.text }
          selected={ selected }
          offset={ offset }
          type={ line.type }
          updateTextFunction={ updateTextFunction }
          updateSelected={ this.updateSelected.bind(this) }
          handleDelete={ this.handleDelete.bind(this) }
          dispatch = { this.props.dispatch }></Line>);
      } else if (line.type === 'recording') {
        return (<RecordingLine key={ line.lineId } lineId={ line.lineId }></RecordingLine>);
      }
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

Section.propTypes = {
  section: React.PropTypes.object.isRequired,
  sectionId: React.PropTypes.number.isRequired,
}

module.exports = Section;