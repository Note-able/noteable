import React, { Component, PropTypes } from 'react';
import { findDOMNode, unmountComponentAtNode, render } from 'react-dom';

import { KeyCodes } from '../helpers/keyCodes';

// in case you were wondering. No I don't approve of this. But I see the reason and don't want to think about it.
// I've removed your batching because I don't think it makes a difference. We can discuss it later.
// import { addLine, updateText } from './actions/editor-actions';

const Line = require('./line.jsx');
const RecordingLine = require('./recordingLine.jsx');
const Tooltip = require('./tooltip.jsx');

class Section extends Component {
  static propTypes = {
    lines: PropTypes.arrayOf(PropTypes.shape({})),
    section: PropTypes.shape({
      lineData: PropTypes.arrayOf(PropTypes.shape({
        lineId: PropTypes.number,
      })),
      offset: PropTypes.number,
      selectedIndex: PropTypes.number,
      selectedLine: PropTypes.shape({
        lineId: PropTypes.number,
      }),
    }).isRequired,
    sectionDispatch: PropTypes.shape({
      addChord: PropTypes.func.isRequired,
      addLine: PropTypes.func.isRequired,
      deleteLine: PropTypes.func.isRequired,
      initializeEditor: PropTypes.func.isRequired,
      updateLines: PropTypes.func.isRequired,
      updateSelected: PropTypes.func.isRequired,
      updateText: PropTypes.func.isRequired,
    }).isRequired,
    sectionId: PropTypes.number.isRequired,
    submitRevision: PropTypes.func.isRequired,
  };

  state = {
    enterPressed: false,
    keyMap: [],
    lineData: [],
    lines: this.props.lines,
    shouldUpdate: true,
  };

  componentDidMount() {
    if (!this.props.section.lineData) {
      this.props.sectionDispatch.addLine(this.props.sectionId, this.lines++, 0, 'text', '');
    } else {
      this.state.lines = this.props.section.lineData.length;
    }
  }

  shouldComponentUpdate = () => this.checkIfShouldUpdate();

  getDataForPost = () => {
    const lineContents = [];
    for (const line of this.props.section.lineData) {
      const lineContent = this[`line${line.lineId}`].getDataForPost();
      lineContents.push(lineContent);
    }
    return { sectionId: this.props.sectionId, lineData: lineContents };
  }

  checkIfShouldUpdate = () => {
    const shouldUpdate = this.state.shouldUpdate;
    this.state.shouldUpdate = true;
    return shouldUpdate;
  }

  handlePaste(e) {
    e.preventDefault();
    const plainText = e.clipboardData.getData('text/plain');
    if (plainText) {
      const lineData = this.props.section.lineData;
      const lines = plainText.split('\n').filter(line => (line !== ''));
      const selectedIndex = this.props.section.selectedIndex;
      const selected = this.props.section.selectedLine;
      lineData[selectedIndex].text = lines[0];
      // const lineActions = [];

      for (let i = 1; i < lines.length - 1; i++) {
        this.lines++;
        this.props.sectionDispatch.addLine(this.props.sectionId, this.lines, selectedIndex + i, 'text', lines[i]);
        // lineActions.push(addLine(this.props.sectionId, this.lines, selectedIndex + i, 'text', lines[i]));
      }
      if (lines.length > 1) {
        this.lines++;
        this.props.sectionDispatch.addLine(this.props.sectionId, this.lines, selectedIndex + (lines.length - 1), 'text', lines[lines.length - 1]);
        // lineActions.push(addLine(this.props.sectionId, this.lines, selectedIndex + lines.length - 1, 'text', lines[lines.length - 1]));
      }
      const currentText = findDOMNode(this[selected.ref]);
      this.props.sectionDispatch.updateText(this.props.sectionId, selected.lineId, currentText + lines[0], 0);
      // lineActions.push(updateText(this.props.sectionId, selected.lineId, currentText + lines[0], 0));
      // selectedIndex = selectedIndex + (lines.length - 1);
      // this.props.dispatch(updateLines(this.props.sectionId, lineActions, selectedIndex, lines[lines.length - 1].length));
    }
  }

  handleKeyDown(e) {
    this.keyMap[e.keyCode] = e.type === 'keydown';
    /* Note: this is *probably* really bad. It should work by keeping a collection of functions for keycodes that need them,
      and then calling the function for that keycode if it exists instead of doing if else for all possible keys that have functions.
      But for relatively small numbers of hotkeys/overrides it doesn't matter */
    if (e.keyCode === KeyCodes.enter) {
      if (!e.target.classList.contains('editor-chord')) {
        e.preventDefault();
        this.enterPressed = true;
        const selection = window.getSelection();
        const selectionOffset = selection.baseOffset;
        const text = selection.anchorNode.data;
        const movedText = text.substring(selectionOffset, text.length);
        const remainingText = text.substring(0, selectionOffset);
        this.handleEnter.bind(this)(remainingText, movedText);
      }
    } else if (e.keyCode === KeyCodes.upArrow) {
      e.preventDefault();
      const selectionOffset = window.getSelection().baseOffset;
      this.handleUpArrow(selectionOffset, this.props.section.selectedLine.lineId);
    } else if (e.keyCode === KeyCodes.downArrow) {
      e.preventDefault();
      const selectionOffset = window.getSelection().baseOffset;
      this.handleDownArrow(selectionOffset, this.props.section.selectedLine.lineId);
    } else if (e.keyCode === KeyCodes.backspace) {
      if (window.getSelection().baseOffset === 0 && this.props.section.selectedIndex !== 0) {
        e.preventDefault();
        const selectedIndex = this.props.section.selectedIndex;
        this.props.sectionDispatch.deleteLine(this.props.sectionId, selectedIndex);
      }
    } else if (e.keyCode === KeyCodes.r) { // new recording line
      if (this.keyMap[KeyCodes.alt] && (e.metaKey || e.ctrlKey)) {
        this.props.sectionDispatch.addLine(this.props.sectionId, ++this.lines, this.props.section.selectedIndex + 1, 'recording', '', false);
      }
    } else if (e.keyCode === KeyCodes.s) { // save
      if (this.keyMap[KeyCodes.alt] && e.metaKey) {
        this.props.submitRevision();
      }
    } else if (e.keyCode === KeyCodes.c) { // new chord Line
      if (this.keyMap[KeyCodes.alt] && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        // TODO: Add keyboard shortcut for chord
      }
    }
  }

  handleOnClick() {
    if (this.tooltip) {
      unmountComponentAtNode(this._tooltip);
    }

    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    if (range.startOffset !== range.endOffset) {
      this.tooltip = this.showTooltip(selection);
    }
  }

  handleKeyUp(e) {
    this.keyMap[e.keyCode] = e.type === 'keydown';
    if (e.keyCode === 8) { // delete
    }
  }

  handleOnFocus() {
    this.isFocused = true;
    if (this.props.section.lineData.length === 1) {
      this._section.childNodes[this.props.section.selectedIndex].focus();
    }
  }

  handleOnBlur() {
    this.isFocused = false;
  }

  showTooltip(selection) {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    const tooltip = render(
      <Tooltip
        element={selection.anchorNode.parentElement}
        rect={rect}
        addChord={() => this.addChord()}
        addRecordingLine={() => this.props.sectionDispatch.addLine(this.props.sectionId, ++this.lines, this.props.section.selectedIndex + 1, 'recording', '', false)}
      />,
      this._tooltip
    );

    return tooltip;
  }

  handleOnSelect(e) {
    console.log(e);
    // const selection = window.getSelection();
  }

  // Need a way of adding the update selected function back in after retreiving saved chords\
  // could be moved to line where we set update selected to currentTetIndex + length of chord text
  // Also chords aren't being mounted to the dom properly. possibly because of html comments?
  addChord() {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);

    const startIndex = parseInt(selection.baseNode.parentElement.getAttribute('data-index')) || 0;

    this.props.sectionDispatch.addChord(
      this.props.sectionId,
      this.props.section.selectedLine.lineId,
      '',
      startIndex + range.startOffset,
      () => { this.props.sectionDispatch.updateSelected(this.props.sectionId, this.props.section.selectedIndex, range.endOffset + 1) }
    );

    if (this.tooltip) {
      unmountComponentAtNode(this._tooltip);
    }
  }

  updateSelected(lineId) {
    this.shouldUpdate = false;
    const selectedIndex = this.props.section.lineData.findIndex((e) => (e.lineId === lineId));
    this.props.sectionDispatch.updateSelected(this.props.sectionId, selectedIndex, 0);
  }

  handleEnter(remainingText, movedText) {
    const selected = this.props.section.selectedLine;
    const selectedIndex = this.props.section.selectedIndex;

    this.props.sectionDispatch.addLine(this.props.sectionId, ++this.lines, selectedIndex + 1, 'text', movedText);
    this.props.sectionDispatch.updateText(this.props.sectionId, selected.lineId, remainingText, 0);
    // const lineActions = [addLine(this.props.sectionId, ++this.lines, selectedIndex + 1, 'text', movedText)];
    // lineActions.push(updateText(this.props.sectionId, selected.lineId, remainingText, 0));
    // this.props.dispatch(updateLines(this.props.sectionId, lineActions, selectedIndex + 1, 0));
  }

  handleDelete(text) {
    const selected = this.props.section.selectedLine;
    // const selectedIndex = this.props.section.selectedIndex;
    const offset = text.length;
    const currentText = findDOMNode(this[selected.ref]);
    // TODO: Figure out how to get the correct offset
    this.props.sectionDispatch.updateText(this.props.sectionId, selected.lineId, currentText + text, offset);
  }

  handleUpArrow(offset, lineId) {
    if (this.props.section.lineData[0].lineId !== lineId) {
      const index = this.props.section.lineData.findIndex(e => (e.lineId === lineId));
      this.props.sectionDispatch.updateSelected(this.props.sectionId, index - 1, offset);
    }
  }

  handleDownArrow(offset, lineId) {
    if (this.props.section.lineData[this.props.section.lineData.length - 1].lineId !== lineId) {
      const index = this.props.section.lineData.findIndex(e => (e.lineId === lineId));
      this.props.sectionDispatch.updateSelected(this.props.sectionId, index + 1, offset);
    }
  }

  clearLinesToUpdate() {
    this.linesToUpdate = [];
  }

  handleInput() {
    for (const elem of this.lineElements) {
      this[elem.ref].handleInput();
    }
  }

  render() {
    const lineData = this.props.section.lineData;
    const lineElements = this.lineElements = lineData.map(line => {
      if (line.type === 'text') {
        const selected = line.lineId === this.props.section.lineData[this.props.section.selectedIndex].lineId;
        const offset = selected ? this.props.section.offset : 0;
        return (
          <Line
            key={line.lineId}
            ref={ref => { this[`line${line.lineId}`] = ref; }}
            lineId={line.lineId}
            text={line.text}
            chords={line.chords}
            selected={selected}
            offset={offset}
            type={line.type}
            updateSelected={() => this.updateSelected(line.lineId)}
            handleDelete={() => this.handleDelete()}
          />);
      } else if (line.type === 'recording') {
        return (
          <RecordingLine
            key={line.lineId}
            lineId={line.lineId}
          />
        );
      }

      return null;
    });
    return (
      <div
        className="section"
        ref={ref => { this._section = ref; }}
        name={this.props.sectionId}
        contentEditable="true"
        onPaste={() => this.handlePaste()}
        onKeyDown={() => this.handleKeyDown()}
        onKeyUp={() => this.handleKeyUp()}
        onFocus={() => this.handleOnFocus()}
        onBlur={() => this.handleOnBlur()}
        onClick={() => this.handleOnClick()}
        onSelect={() => this.handleOnSelect()}
        onInput={() => this.handleInput()}
        suppressContentEditableWarning
      >
        { lineElements }
        <div ref={ref => { this._tooltip = ref; }} className="tooltip-container" />
      </div>
    );
  }
}

module.exports = Section;
