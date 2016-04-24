'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

const React = require('react');
const ReactDOM = require('react-dom');
const Line = require('./line');
const RecordingLine = require('./recordingLine');
import { addLine } from './actions/editor-actions';
import { deleteLine } from './actions/editor-actions';
import { updateText } from './actions/editor-actions';
import { updateLines } from './actions/editor-actions';
import { updateSelected as _updateSelected } from './actions/editor-actions';

let Section = function (_React$Component) {
  _inherits(Section, _React$Component);

  function Section(props, context) {
    _classCallCheck(this, Section);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Section).call(this, props, context));

    _this.lines = props.lines;
    _this.state = { lineData: [] };
    _this.enterPressed = false;
    _this.keyMap = [];
    _this.shouldUpdate = true;
    _this.newTextLine = _this.props.newTextLine;
    _this.newRecordingLine = _this.props.newRecordingLine;
    return _this;
  }

  _createClass(Section, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (!this.props.section.lineData) {
        this.props.dispatch(addLine(this.props.sectionId, this.lines++, 0, 'text', ''));
      } else {
        this.lines = this.props.section.lineData.length;
      }
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      return this.checkIfShouldUpdate.bind(this)();
    }
  }, {
    key: 'checkIfShouldUpdate',
    value: function checkIfShouldUpdate() {
      const shouldUpdate = this.shouldUpdate;
      this.shouldUpdate = true;
      return shouldUpdate;
    }
  }, {
    key: 'getDataForPost',
    value: function getDataForPost() {
      console.log('section data being collected');
      const lineContents = [];
      for (const line in this.refs) {
        const lineContent = this.refs[line].getDataForPost();
        lineContents.push(lineContent);
      }
      return { sectionId: this.props.sectionId, lineData: lineContents };
    }
  }, {
    key: 'handleClick',
    value: function handleClick(e) {
      console.log('clicked section');
      console.log(e);
    }
  }, {
    key: 'handlePaste',
    value: function handlePaste(e) {
      console.log('paste');
      console.log(e);
      e.preventDefault();
      const plainText = e.clipboardData.getData('text/plain');
      if (plainText) {
        const lineData = this.props.section.lineData;
        const lines = plainText.split('\n').filter(line => {
          return line !== '';
        });
        let selectedIndex = this.props.section.selectedIndex;
        const selected = this.props.section.selectedLine;
        lineData[selectedIndex].text = lines[0];
        const lineActions = [];

        for (let i = 1; i < lines.length - 1; i++) {
          this.lines++;
          lineActions.push(addLine(this.props.sectionId, this.lines, selectedIndex + i, 'text', lines[i]));
        }
        if (lines.length > 1) {
          this.lines++;
          lineActions.push(addLine(this.props.sectionId, this.lines, selectedIndex + lines.length - 1, 'text', lines[lines.length - 1]));
        }
        lineActions.push(updateText(this.props.sectionId, selected.lineId, lines[0], 0, this.appendTextAfterDelete));
        selectedIndex = selectedIndex + lines.length - 1;
        this.props.dispatch(updateLines(this.props.sectionId, lineActions, selectedIndex, lines[lines.length - 1].length));
      }
    }
  }, {
    key: 'handleKeyDown',
    value: function handleKeyDown(e) {
      this.keyMap[e.keyCode] = e.type === 'keydown';
      this.metaKey = e.metaKey;
      /* Note: this is *probably* really bad. It should work by keeping a collection of functions for keycodes that need them,
        and then calling the function for that keycode if it exists instead of doing if else for all possible keys that have functions.
        Or I could use a switch statement at the very least. */
      if (e.keyCode === 13) {
        //enter
        e.preventDefault();
        this.enterPressed = true;
        const selection = window.getSelection();
        const selectionOffset = selection.baseOffset;
        const text = selection.anchorNode.data;
        const movedText = text.substring(selectionOffset, text.length);
        const remainingText = text.substring(0, selectionOffset);
        this.handleEnter.bind(this)(remainingText, movedText);
      } else if (e.keyCode === 38) {
        //upArrow
        e.preventDefault();
        const selectionOffset = window.getSelection().baseOffset;
        this.handleUpArrow(selectionOffset, this.props.section.selectedLine.lineId);
      } else if (e.keyCode === 40) {
        //downArrow
        e.preventDefault();
        const selectionOffset = window.getSelection().baseOffset;
        this.handleDownArrow(selectionOffset, this.props.section.selectedLine.lineId);
      } else if (e.keyCode === 8) {
        //delete
        if (window.getSelection().baseOffset === 0 && this.props.section.selectedIndex !== 0) {
          e.preventDefault();
          const selectedIndex = this.props.section.selectedIndex;
          this.props.dispatch(deleteLine(this.props.sectionId, selectedIndex));
        }
      } else if (e.keyCode === 82) {
        //r + command + alt -> new recording line
        if (this.keyMap[18] && this.metaKey) {
          this.props.dispatch(addLine(this.props.sectionId, ++this.lines, this.props.section.selectedIndex + 1, 'recording', '', false));
        } else if (this.keyMap[16] && this.keyMap[17]) {
          this.props.dispatch(addLine(this.props.sectionId, ++this.lines, this.props.section.selectedIndex + 1, 'recording', '', false));
        }
      } else if (e.keyCode === 83) {
        //s + command + alt -> save
        if (this.keyMap[18] && this.metaKey) {
          this.props.submitRevision();
        }
      }
    }
  }, {
    key: 'handleKeyUp',
    value: function handleKeyUp(e) {
      this.keyMap[e.keyCode] = e.type === 'keydown';
      if (e.keyCode === 8) {//delete
      }
    }
  }, {
    key: 'handleOnFocus',
    value: function handleOnFocus() {
      this.isFocused = true;
      if (this.props.section.lineData.length === 1) {
        this.refs.section.childNodes[this.props.section.selectedIndex].focus();
      }
    }
  }, {
    key: 'handleOnBlur',
    value: function handleOnBlur() {
      this.isFocused = false;
    }
  }, {
    key: 'updateSelected',
    value: function updateSelected(lineId) {
      this.shouldUpdate = false;
      const selectedIndex = this.props.section.lineData.findIndex(e => {
        return e.lineId === lineId;
      });
      this.props.dispatch(_updateSelected(this.props.sectionId, selectedIndex, 0));
    }
  }, {
    key: 'handleEnter',
    value: function handleEnter(remainingText, movedText) {
      const selected = this.props.section.selectedLine;
      const selectedIndex = this.props.section.selectedIndex;

      const lineActions = [addLine(this.props.sectionId, ++this.lines, selectedIndex + 1, 'text', movedText)];
      lineActions.push(updateText(this.props.sectionId, selected.lineId, remainingText, 0, this.setText));
      this.props.dispatch(updateLines(this.props.sectionId, lineActions, selectedIndex + 1, 0));
    }
  }, {
    key: 'handleDelete',
    value: function handleDelete(text) {
      console.log('delete');
      const selected = this.props.section.selectedLine;
      const selectedIndex = this.props.section.selectedIndex;
      const lineData = this.props.section.lineData;
      const offset = this.refs.section.childNodes[selectedIndex].innerHTML.length;
      lineData[selectedIndex].text = text;
      this.props.dispatch(updateText(this.props.sectionId, selected.lineId, text, offset, this.appendTextAfterDelete.bind(this)));
      //this.setState({ lineData: lineData, updateFunction: this.appendTextAfterDelete.bind(this), offset: offset }, this.clearLinesToUpdate.bind(this));
    }
  }, {
    key: 'handleUpArrow',
    value: function handleUpArrow(offset, lineId) {
      if (this.props.section.lineData[0].lineId !== lineId) {
        const index = this.props.section.lineData.findIndex(e => {
          return e.lineId === lineId;
        });
        this.props.dispatch(_updateSelected(this.props.sectionId, index - 1, offset));
      }
    }
  }, {
    key: 'handleDownArrow',
    value: function handleDownArrow(offset, lineId) {
      if (this.props.section.lineData[this.props.section.lineData.length - 1].lineId !== lineId) {
        const index = this.props.section.lineData.findIndex(e => {
          return e.lineId === lineId;
        });
        this.props.dispatch(_updateSelected(this.props.sectionId, index + 1, offset));
      }
    }
  }, {
    key: 'clearLinesToUpdate',
    value: function clearLinesToUpdate() {
      this.linesToUpdate = [];
    }
  }, {
    key: 'setText',
    value: function setText(element, text) {
      element.innerHTML = text;
      return element.innerHtml;
    }
  }, {
    key: 'appendTextAfterDelete',
    value: function appendTextAfterDelete(element, text) {
      element.innerHTML += text;
      return element.innerHtml;
    }
  }, {
    key: 'render',
    value: function render() {
      const lineData = this.props.section.lineData;
      const lineElements = lineData.map(line => {
        if (line.type === 'text') {
          const selected = line.lineId === this.props.section.lineData[this.props.section.selectedIndex].lineId;
          const offset = selected ? this.props.section.offset : 0;
          const updateTextFunction = line.updateTextFunction;
          return React.createElement(Line, { key: line.lineId,
            ref: `line${ line.lineId }`,
            lineId: line.lineId,
            text: line.text,
            selected: selected,
            offset: offset,
            type: line.type,
            updateTextFunction: updateTextFunction,
            updateSelected: this.updateSelected.bind(this),
            handleDelete: this.handleDelete.bind(this),
            dispatch: this.props.dispatch });
        } else if (line.type === 'recording') {
          return React.createElement(RecordingLine, { key: line.lineId, lineId: line.lineId });
        }
      });
      return React.createElement(
        'div',
        { className: 'section', ref: 'section', name: this.props.sectionId, contentEditable: 'true',
          onPaste: this.handlePaste.bind(this),
          onKeyDown: this.handleKeyDown.bind(this),
          onKeyUp: this.handleKeyUp.bind(this),
          onClick: this.handleClick.bind(this),
          onFocus: this.handleOnFocus.bind(this),
          onBlur: this.handleOnBlur.bind(this) },
        lineElements
      );
    }
  }]);

  return Section;
}(React.Component);

Section.propTypes = {
  section: React.PropTypes.object.isRequired,
  sectionId: React.PropTypes.number.isRequired,
  submitRevision: React.PropTypes.func.isRequired
};

module.exports = Section;