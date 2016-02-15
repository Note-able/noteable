'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

const React = require('react');
const Line = require('./line');

module.exports = function (_React$Component) {
  _inherits(Section, _React$Component);

  function Section(props, context) {
    _classCallCheck(this, Section);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Section).call(this, props, context));

    _this.lines = 0;
    const lineData = [_this.newLine(_this.lines, '')];
    _this.state = { lineData: lineData, selectedLine: lineData[0], selectedIndex: 0 };
    _this.enterPressed = false;
    _this.keyMap = [];
    _this.linesToUpdate = [];
    _this.shouldUpdate = true;
    return _this;
  }

  _createClass(Section, [{
    key: 'onComponentDidUpdate',
    value: function onComponentDidUpdate() {
      this.linesToUpdate = [];
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
    key: 'newLine',
    value: function newLine(id, text) {
      return { lineId: id, text: text };
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
      e.preventDefault();
    }
  }, {
    key: 'handleKeyDown',
    value: function handleKeyDown(e) {
      this.keyMap[e.keyCode] = e.type === 'keydown';
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
        this.handleUpArrow(selectionOffset, this.state.selectedLine.lineId);
      } else if (e.keyCode === 40) {
        //downArrow
        e.preventDefault();
        const selectionOffset = window.getSelection().baseOffset;
        this.handleDownArrow(selectionOffset, this.state.selectedLine.lineId);
      }
    }
  }, {
    key: 'handleKeyUp',
    value: function handleKeyUp(e) {
      this.keyMap[e.keyCode] = e.type === 'keydown';
      if (e.keyCode === 8) {
        //delete
        if (window.getSelection().baseOffset === 0) {
          this.handleDelete(this.state.selectedLine.text);
        }
      }
    }
  }, {
    key: 'handleOnFocus',
    value: function handleOnFocus() {
      this.isFocused = true;
      if (this.state.lineData.length === 1) {
        this.refs.section.childNodes[this.state.selectedIndex].focus();
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
      const selectedIndex = this.state.lineData.findIndex(e => {
        return e.lineId === lineId;
      });
      const selectedLine = this.state.lineData[selectedIndex];
      this.setState({ selectedLine: selectedLine, selectedIndex: selectedIndex });
    }
  }, {
    key: 'handleEnter',
    value: function handleEnter(oldText, movedText) {
      ++this.lines;
      const lineData = this.state.lineData;
      const newLine = this.newLine(this.lines, movedText);
      const selected = this.state.selectedLine;
      let selectedIndex = this.state.selectedIndex;
      let newSelected = null;
      if (selectedIndex !== lineData.length - 1) {
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
  }, {
    key: 'handleDelete',
    value: function handleDelete() {
      console.log('delete');
    }
  }, {
    key: 'handleUpArrow',
    value: function handleUpArrow(offset, lineId) {
      if (this.state.lineData[0].lineId !== lineId) {
        const index = this.state.lineData.findIndex(e => {
          return e.lineId === lineId;
        });
        this.setState({ selectedIndex: index - 1, selectedLine: this.state.lineData[index - 1], selectedLineoffset: offset });
      }
    }
  }, {
    key: 'handleDownArrow',
    value: function handleDownArrow(offset, lineId) {
      if (this.state.lineData[this.state.lineData.length - 1].lineId !== lineId) {
        const index = this.state.lineData.findIndex(e => {
          return e.lineId === lineId;
        });
        this.setState({ selectedIndex: index + 1, selectedLine: this.state.lineData[index + 1], offset: offset });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      const lineElements = this.state.lineData.map(line => {
        const selected = line.lineId === this.state.lineData[this.state.selectedIndex].lineId;
        const offset = selected ? this.state.offset : 0;
        const shouldUpdateText = this.linesToUpdate[line.lineId];
        return React.createElement(Line, { key: line.lineId, lineId: line.lineId, text: line.text, selected: selected, offset: offset,
          shouldUpdateText: shouldUpdateText,
          updateSelected: this.updateSelected.bind(this),
          handleEnter: this.handleEnter.bind(this),
          handleDelete: this.handleDelete.bind(this),
          handleUpArrow: this.handleUpArrow.bind(this),
          handleDownArrow: this.handleDownArrow.bind(this) });
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