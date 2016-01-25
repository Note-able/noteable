'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router');

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

		var lines = 0;
		_this2.lines = lines;
		_this2.state = { lineData: [_this2.newLine(lines, '')] };
		return _this2;
	}

	_createClass(Section, [{
		key: 'newLine',
		value: function newLine(id, text) {
			return { lineId: id, text: text };
		}
	}, {
		key: 'handleEnter',
		value: function handleEnter(text, lineId) {
			++this.lines;
			var lineData = this.state.lineData;
			var newLine = this.newLine(this.lines, text);
			if (lineId !== lineData.length) {
				var index = lineData.findIndex(function (e, i, a) {
					return e.lineId === lineId;
				});
				lineData.splice(index + 1, 0, newLine);
			} else {
				lineData.push(newLine);
			}
			this.setState({ lineData: lineData });
		}
	}, {
		key: 'render',
		value: function render() {
			var lineElements = this.state.lineData.map(function (line) {
				return React.createElement(Line, { key: line.lineId, lineId: line.lineId, text: line.text, handleEnter: this.handleEnter.bind(this) });
			}.bind(this));
			return React.createElement(
				'div',
				{ className: 'section', name: this.props.sectionId },
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

		_this3.state = { text: props.text, selected: 'selected' };
		_this3.enterPressed = false;
		_this3.keyMap = [];
		return _this3;
	}

	_createClass(Line, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			ReactDOM.findDOMNode(this.refs.line).focus();
		}
	}, {
		key: 'componentDidUpdate',
		value: function componentDidUpdate() {
			if (!this.enterPressed) {
				this.setCaretPosition.bind(this)();
			} else {
				this.enterPressed = false;
			}
		}
	}, {
		key: 'setCaretPosition',
		value: function setCaretPosition() {
			var element = ReactDOM.findDOMNode(this.refs.line);
			if (element.childNodes.length > 0 && this.isFocused && !this.isFocusing) {
				var selection = window.getSelection();
				var range = document.createRange();
				range.setStart(element.childNodes[0], this.state.caretOffset);
				selection.removeAllRanges();
				selection.addRange(range);
			} else if (this.isFocusing) {
				this.isFocusing = false;
			}
		}
	}, {
		key: 'handleKeyPress',
		value: function handleKeyPress(e) {
			e.preventDefault();
			var charCode = e.which || e.keyCode;
			var charTyped = String.fromCharCode(charCode);
			var newText = this.state.text + charTyped;
			var offset = window.getSelection().focusOffset + 1;
			this.setState({ text: newText, caretOffset: offset });
		}
	}, {
		key: 'handleKeyDown',
		value: function handleKeyDown(e) {
			console.log('keydown');
			console.log(e);
			this.keyMap[e.keyCode] = e.type == 'keydown';
			if (e.keyCode === 13) {
				this.enterPressed = true;
				var selectionOffset = window.getSelection().baseOffset;
				var movedText = this.state.text.substring(selectionOffset, this.state.text.length);
				var remainingText = this.state.text.substring(0, selectionOffset);
				this.props.handleEnter(movedText, this.props.lineId);
				this.setState({ text: remainingText });
			}
		}
	}, {
		key: 'handleKeyUp',
		value: function handleKeyUp(e) {
			this.keyMap[e.keyCode] = e.type == 'keydown';
			if (e.keyCode === 8) {
				var newText = ReactDOM.findDOMNode(this.refs.line).innerHTML;
				this.setState({ text: newText });
			}
		}
	}, {
		key: 'handleClick',
		value: function handleClick(e) {
			console.log("clicked");
			var el = ReactDOM.findDOMNode(this.refs.line);
			el.focus();
		}
	}, {
		key: 'handleOnFocus',
		value: function handleOnFocus() {
			this.isFocused = true;
			this.isFocusing = true;
			this.setState({ selected: 'selected' });
		}
	}, {
		key: 'handleOnBlur',
		value: function handleOnBlur() {
			this.isFocused = false;
			this.setState({ selected: '' });
		}
	}, {
		key: 'render',
		value: function render() {
			return React.createElement(
				'p',
				{
					className: "editor-line " + this.state.selected,
					name: this.props.lineId,
					ref: 'line',
					onKeyPress: this.handleKeyPress.bind(this),
					onKeyDown: this.handleKeyDown.bind(this),
					onKeyUp: this.handleKeyUp.bind(this),
					onClick: this.handleClick.bind(this),
					onFocus: this.handleOnFocus.bind(this),
					onBlur: this.handleOnBlur.bind(this),
					contentEditable: 'true' },
				this.state.text
			);
		}
	}]);

	return Line;
}(React.Component);