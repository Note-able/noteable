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
        'div',
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
    _this2.state = { lineData: lineData, selectedLine: lineData[0], selectedIndex: 0 };
    _this2.enterPressed = false;
    _this2.keyMap = [];
    _this2.linesToUpdate = [];
    _this2.shouldUpdate = true;
    return _this2;
  }

  _createClass(Section, [{
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
      console.log(e);
      e.preventDefault();
      const plainText = e.clipboardData.getData('text/plain');
      if (plainText) {
        const lineData = this.state.lineData;
        const lines = plainText.split('\n').filter(line => {
          return line !== '';
        });
        let selectedIndex = this.state.selectedIndex;
        let selected = this.state.selectedLine;
        lineData[selectedIndex].text = lines[0];
        this.linesToUpdate[selected.lineId] = true;
        for (let i = 1; i < lines.length - 1; i++) {
          this.lines++;
          const newLine = this.newLine(this.lines, lines[i]);
          lineData.splice(selectedIndex + i, 0, newLine);
          this.linesToUpdate[lineData[selectedIndex + i].lineId] = true;
        }
        if (lines.length > 1) {
          this.lines++;
          const newLine = this.newLine(this.lines, lines[lines.length - 1]);
          lineData.splice(selectedIndex + lines.length - 1, 0, newLine);
          this.linesToUpdate[lineData[selectedIndex + lines.length - 1].lineId] = true;
        }

        selectedIndex = selectedIndex + lines.length - 1;
        selected = lineData[selectedIndex];

        this.setState({ lineData: lineData, selectedIndex: selectedIndex, selectedLine: selected, updateFunction: this.appendTextAfterDelete }, this.clearLinesToUpdate.bind(this));
      }
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
      } else if (e.keyCode === 8) {
        //delete
        if (window.getSelection().baseOffset === 0 && this.state.selectedIndex !== 0) {
          e.preventDefault();
          const selectedIndex = this.state.selectedIndex;
          const lineData = this.state.lineData;
          lineData.splice(selectedIndex, 1);
          this.setState({ lineData: lineData, selectedIndex: selectedIndex - 1, selectedLine: lineData[selectedIndex - 1] });
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

      this.setState({ lineData: lineData, selectedIndex: selectedIndex, selectedLine: newSelected, updateFunction: this.setText }, this.clearLinesToUpdate.bind(this));
    }
  }, {
    key: 'handleDelete',
    value: function handleDelete(text) {
      console.log('delete');
      const selected = this.state.selectedLine;
      const selectedIndex = this.state.selectedIndex;
      const lineData = this.state.lineData;
      const offset = this.refs.section.childNodes[selectedIndex].innerHTML.length;
      lineData[selectedIndex].text = text;
      this.linesToUpdate[selected.lineId] = true;
      this.setState({ lineData: lineData, updateFunction: this.appendTextAfterDelete.bind(this), offset: offset }, this.clearLinesToUpdate.bind(this));
    }
  }, {
    key: 'handleUpArrow',
    value: function handleUpArrow(offset, lineId) {
      if (this.state.lineData[0].lineId !== lineId) {
        const index = this.state.lineData.findIndex(e => {
          return e.lineId === lineId;
        });
        this.setState({ selectedIndex: index - 1, selectedLine: this.state.lineData[index - 1], offset: offset });
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
    key: 'clearLinesToUpdate',
    value: function clearLinesToUpdate() {
      this.linesToUpdate = [];
    }
  }, {
    key: 'setText',
    value: function setText(element, text) {
      element.innerHTML = text;
    }
  }, {
    key: 'appendTextAfterDelete',
    value: function appendTextAfterDelete(element, text) {
      element.innerHTML += text;
    }
  }, {
    key: 'render',
    value: function render() {
      const lineElements = this.state.lineData.map(line => {
        const selected = line.lineId === this.state.lineData[this.state.selectedIndex].lineId;
        const offset = selected ? this.state.offset : 0;
        const shouldUpdateText = this.linesToUpdate[line.lineId];
        const updateTextFunction = shouldUpdateText ? this.state.updateFunction : null;
        return React.createElement(Line, { key: line.lineId, lineId: line.lineId, text: line.text, selected: selected, offset: offset,
          updateTextFunction: updateTextFunction,
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

let Line = function (_React$Component3) {
  _inherits(Line, _React$Component3);

  function Line(props, context) {
    _classCallCheck(this, Line);

    var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(Line).call(this, props, context));

    const selected = _this3.props.selected ? 'selected' : '';
    _this3.state = { text: _this3.props.text, selected: selected };
    _this3.enterPressed = false;
    _this3.keyMap = [];
    return _this3;
  }

  _createClass(Line, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      const element = ReactDOM.findDOMNode(this.refs.line);
      element.innerHTML = this.props.text;
      if (this.props.selected) {
        this.setCaretPosition.bind(this)(this.props.offset);
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      console.log(`${ this.props.lineId } did update`);
      if (this.props.shouldUpdateText) {
        const element = ReactDOM.findDOMNode(this.refs.line);
        this.props.updateTextFunction(element, this.props.text);
      }
      if (this.props.selected) {
        this.setCaretPosition.bind(this)(this.props.offset);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.props.handleDelete) {
        this.props.handleDelete(ReactDOM.findDOMNode(this.refs.line).innerHTML);
      }
    }
  }, {
    key: 'setCaretInEmptyDiv',
    value: function setCaretInEmptyDiv() {
      const element = ReactDOM.findDOMNode(this.refs.line);
      const range = document.createRange();
      range.selectNodeContents(element);
      range.collapse(false);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      console.log(nextProps);
    }
  }, {
    key: 'setCaretPosition',
    value: function setCaretPosition(position) {
      const element = ReactDOM.findDOMNode(this.refs.line);
      if (element.childNodes.length !== 0) {
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
  }, {
    key: 'handleClick',
    value: function handleClick(e) {
      console.log('clicked');
      const element = e.target;
      element.focus();
      this.props.updateSelected(this.props.lineId);
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement('p', {
        className: 'editor-line',
        name: this.props.lineId,
        ref: 'line',
        onClick: this.handleClick.bind(this) });
    }
  }]);

  return Line;
}(React.Component);