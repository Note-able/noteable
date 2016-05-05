'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const Line = require('./line');
const RecordingLine = require('./recordingLine');
const Chord = require('./chord');
const Tooltip = require('./toolTip');
import { KeyCodes } from '../helpers/keyCodes';
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
    if(!this.props.section.lineData) {
      this.props.dispatch(addLine(this.props.sectionId, this.lines++, 0, 'text', ''));
    } else {
      this.lines = this.props.section.lineData.length;
    }
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
    const lineContents = [];
    for (const line of this.props.section.lineData) {
      const lineContent = this.refs[`line${line.lineId}`].getDataForPost();
      lineContents.push(lineContent);
    }
    return { sectionId: this.props.sectionId, lineData: lineContents }
  }

  handlePaste (e) {
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
      But for relatively small numbers of hotkeys/overrides it doesn't matter */
    if(e.keyCode === KeyCodes.enter) {
      if(!e.target.classList.contains('editor-chord')){
        e.preventDefault();
        this.enterPressed = true;
        const selection = window.getSelection();
        const selectionOffset = selection.baseOffset;
        const text = selection.anchorNode.data;
        const movedText = text.substring(selectionOffset, text.length);
        const remainingText = text.substring(0, selectionOffset);
        this.handleEnter.bind(this)(remainingText, movedText);
      }
    } else if(e.keyCode === KeyCodes.upArrow) {
      e.preventDefault();
      const selectionOffset = window.getSelection().baseOffset;
      this.handleUpArrow(selectionOffset, this.props.section.selectedLine.lineId);
    } else if(e.keyCode === KeyCodes.downArrow) {
      e.preventDefault();
      const selectionOffset = window.getSelection().baseOffset;
      this.handleDownArrow(selectionOffset, this.props.section.selectedLine.lineId);
    } else if (e.keyCode === KeyCodes.backspace) {
      if(window.getSelection().baseOffset === 0 && this.props.section.selectedIndex !== 0) {
        e.preventDefault();
        const selectedIndex = this.props.section.selectedIndex;
        this.props.dispatch(deleteLine(this.props.sectionId, selectedIndex));
      }
    } else if (e.keyCode === KeyCodes.r) { // new recording line
      if(this.keyMap[KeyCodes.alt] && (e.metaKey || e.ctrlKey)) {
        this.props.dispatch(addLine(this.props.sectionId, ++this.lines, this.props.section.selectedIndex + 1, 'recording', '', false));
      }
    } else if (e.keyCode === KeyCodes.s) { // save
      if(this.keyMap[KeyCodes.alt] && e.metaKey) {
        this.props.submitRevision();
      }
    } else if (e.keyCode === KeyCodes.c) { // new chord Line
      if(this.keyMap[KeyCodes.alt] && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        // TODO: Add keyboard shortcut for chord
      }
    }
  }

  handleOnClick() {
    if(this.tooltip) {
      ReactDOM.unmountComponentAtNode(this.refs.tooltip)
    }

    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    if(range.startOffset !== range.endOffset) {
      this.tooltip = this.showTooltip(selection);
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

  showTooltip (selection) {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    const tooltip = ReactDOM.render(
      <Tooltip element={ selection.anchorNode.parentElement } rect={ rect } addChord={ this.addChord.bind(this) } range={range}/>,
      this.refs.tooltip
    );

    return tooltip;
  }

  handleOnSelect(e) {
    console.log(e);
    const selection = window.getSelection();
  }

  addChord () {
    console.log('add chord');
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const firstCharRange = range.cloneRange();
    firstCharRange.setEnd(range.startContainer, range.startOffset + 1);

    const container = document.createElement('span');
    firstCharRange.surroundContents(container);
    const character = container.innerText;
    const chord = ReactDOM.render(
      <Chord character={ character } updateSelectedToTextLine={ () => { this.props.dispatch(updateSelected(this.props.sectionId, this.props.section.selectedIndex, range.endOffset))}}/>,
      container
    );

    if(this.tooltip) {
      ReactDOM.unmountComponentAtNode(this.refs.tooltip)
    }
  }

  updateSelected (lineId) {
    this.shouldUpdate = false;
    const selectedIndex = this.props.section.lineData.findIndex((e) => { return e.lineId === lineId });
    this.props.dispatch(updateSelected(this.props.sectionId, selectedIndex, 0));
  }

  handleEnter (remainingText, movedText) {
    const selected = this.props.section.selectedLine;
    const selectedIndex = this.props.section.selectedIndex;

    const lineActions = [addLine(this.props.sectionId, ++this.lines, selectedIndex + 1, 'text', movedText)];
    lineActions.push(updateText(this.props.sectionId, selected.lineId, remainingText, 0, this.setText));
    this.props.dispatch(updateLines(this.props.sectionId, lineActions, selectedIndex + 1, 0));
  }

  handleDelete (text) {
    const selected = this.props.section.selectedLine;
    const selectedIndex = this.props.section.selectedIndex;
    const offset = text.length;
    // TODO: Figure out how to get the correct offset
    this.props.dispatch(updateText(this.props.sectionId, selected.lineId, text, offset, this.appendTextAfterDelete.bind(this)));
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
      onFocus={ this.handleOnFocus.bind(this) }
      onBlur={ this.handleOnBlur.bind(this) }
      onClick={ this.handleOnClick.bind(this) }
      onSelect={ this.handleOnSelect.bind(this) }>
      { lineElements }
      <div ref="tooltip" className="tooltip-container"></div>
    </div>
    );
  }
}

Section.propTypes = {
  section: React.PropTypes.object.isRequired,
  sectionId: React.PropTypes.number.isRequired,
  submitRevision: React.PropTypes.func.isRequired
}

module.exports = Section;