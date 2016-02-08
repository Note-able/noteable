'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

const React = require('react');
const ReactDOM = require('react-dom');
const Router = require('react-router');

module.exports = function (_React$Component) {
  _inherits(EditorController, _React$Component);

  function EditorController(props, context) {
    _classCallCheck(this, EditorController);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(EditorController).call(this, props, context));

    _this.sections = 0;
    return _this;
  }

  _createClass(EditorController, [{
    key: 'render',
    value: function render() {
      ++this.sections;
      return React.createElement(
        'main',
        { className: 'editor', contentEditable: 'false' },
        React.createElement(Section, { sectionId: this.sections })
      );
    }
  }]);

  return EditorController;
}(React.Component);

let Section = function (_React$Component2) {
  _inherits(Section, _React$Component2);

  function Section(props, context) {
    _classCallCheck(this, Section);

    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Section).call(this, props, context));

    _this2.lines = 0;
    const lineData = [_this2.newLine(_this2.lines, '')];
    _this2.state = { lineData: lineData, selectedLine: lineData[0], selectedLineIndex: 0 };
    _this2.enterPressed = false;
    _this2.keyMap = [];
    return _this2;
  }

  _createClass(Section, [{
    key: 'newLine',
    value: function newLine(id, text) {
      return { lineId: id, text: text };
    }
  }, {
    key: 'handleClick',
    value: function handleClick() {
      console.log('clicked');
    }
  }, {
    key: 'handlePaste',
    value: function handlePaste(e) {
      console.log('paste');
      e.preventDefault();
    }
  }, {
    key: 'handleKeyPress',
    value: function handleKeyPress(e) {
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
  }, {
    key: 'setTextOfChild',
    value: function setTextOfChild(text) {
      const lineData = this.state.lineData;
      lineData[this.state.selectedLineIndex].text = text;
      return lineData;
    }
  }, {
    key: 'handleKeyDown',
    value: function handleKeyDown(e) {
      this.keyMap[e.keyCode] = e.type === 'keydown';
      if (e.keyCode === 13) {
        //enter
        e.preventDefault();
        this.enterPressed = true;
        const selectionOffset = window.getSelection().baseOffset;
        const movedText = this.state.selectedLine.text.substring(selectionOffset, this.state.selectedLine.text.length);
        const remainingText = this.state.selectedLine.text.substring(0, selectionOffset);
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
        const newText = ReactDOM.findDOMNode(this.refs.line).innerHTML;
        this.setState({ text: newText });
      }
    }
  }, {
    key: 'handleOnFocus',
    value: function handleOnFocus() {
      this.isFocused = true;
    }
  }, {
    key: 'handleOnBlur',
    value: function handleOnBlur() {
      this.isFocused = false;
    }
  }, {
    key: 'handleEnter',
    value: function handleEnter(oldText, movedText) {
      ++this.lines;
      const lineData = this.state.lineData;
      const newLine = this.newLine(this.lines, movedText);
      let selectedIndex = this.state.selectedLineIndex;
      let selected = this.state.selectedLine;
      if (selectedIndex !== lineData.length - 1) {
        lineData[selectedIndex].text = oldText;
        lineData.splice(selectedLineIndex + 1, 0, newLine);
        selectedIndex = selectedLineIndex + 1;
        selected = lineData[selectedIndex];
      } else {
        lineData[lineData.length - 1].text = oldText;
        lineData.push(newLine);
        selectedIndex = lineData.length - 1;
        selected = lineData[selectedIndex];
      }
      this.setState({ lineData: lineData, selectedLineIndex: selectedIndex, selectedLine: selected });
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
        this.setState({ selectedLineIndex: index - 1, offset: offset });
      }
    }
  }, {
    key: 'handleDownArrow',
    value: function handleDownArrow(offset, lineId) {
      if (this.state.lineData[this.state.lineData.length - 1].lineId !== lineId) {
        const index = this.state.lineData.findIndex(e => {
          return e.lineId === lineId;
        });
        this.setState({ selectedLineIndex: index + 1, offset: offset });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      const lineElements = this.state.lineData.map(line => {
        const selected = line.lineId === this.state.lineData[this.state.selectedLineIndex].lineId;
        const offset = selected ? this.state.offset : null;
        return React.createElement(Line, { key: line.lineId, lineId: line.lineId, text: line.text, selected: selected, offset: offset,
          handleEnter: this.handleEnter.bind(this),
          handleDelete: this.handleDelete.bind(this),
          handleUpArrow: this.handleUpArrow.bind(this),
          handleDownArrow: this.handleDownArrow.bind(this) });
      });
      return React.createElement(
        'div',
        { className: 'section', ref: 'section', name: this.props.sectionId, contentEditable: 'true',
          onPaste: this.handlePaste.bind(this),
          onKeyPress: this.handleKeyPress.bind(this),
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

let Line = function (_React$Component3) {
  _inherits(Line, _React$Component3);

  function Line(props, context) {
    _classCallCheck(this, Line);

    var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(Line).call(this, props, context));

    const selected = _this3.props.selected ? 'selected' : '';
    _this3.state = { text: _this3.props.text, selected: selected, caretOffset: 0 };
    _this3.enterPressed = false;
    _this3.keyMap = [];
    return _this3;
  }

  _createClass(Line, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.props.selected) {
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

  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.setCaretPosition.bind(this)();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      const selected = nextProps.selected ? 'selected' : '';
      const offset = nextProps.offset == null ? 0 : nextProps.offset;
      this.shouldFocus = nextProps.selected;
      //const text = this.state.text;
      //if(this.props.text)
      this.setState({ selected: selected, caretOffset: offset });
    }
  }, {
    key: 'setCaretPosition',
    value: function setCaretPosition() {
      const element = ReactDOM.findDOMNode(this.refs.line);
      if (element.childNodes.length !== 0 && this.props.selected) {
        const caretPos = this.state.caretOffset > element.firstChild.length ? element.firstChild.length : this.state.caretOffset;
        const selection = window.getSelection();
        const range = document.createRange();
        range.setStart(element.firstChild, caretPos);
        range.setEnd(element.firstChild, caretPos);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }, {
    key: 'handleClick',
    value: function handleClick() {
      console.log('clicked');
      if (this.state.selected === '') {
        const selectionOffset = window.getSelection().baseOffset;
        this.setState({ selected: 'selected', caretOffset: selectionOffset });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        {
          className: `editor-line ${ this.state.selected }`,
          name: this.props.lineId,
          ref: 'line' },
        this.props.text
      );
    }
  }]);

  return Line;
}(React.Component);