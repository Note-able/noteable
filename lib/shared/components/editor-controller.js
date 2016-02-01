'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require(`react`);
var ReactDOM = require(`react-dom`);
var Router = require(`react-router`);

module.exports = function (_React$Component) {
	_inherits(EditorController, _React$Component);

	function EditorController(props, context) {
		_classCallCheck(this, EditorController);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(EditorController).call(this, props, context));

		_this.sections = 0;
		return _this;
	}

	_createClass(EditorController, [{
		key: "render",
		value: function render() {
			++this.sections;
			return React.createElement(
				"main",
				{ className: "editor", contentEditable: "false" },
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
		var lineData = [_this2.newLine(lines, ``)];
		_this2.lines = lines;
		_this2.state = { lineData: lineData, selectedLine: lineData[0] };
		return _this2;
	}

	_createClass(Section, [{
		key: "newLine",
		value: function newLine(id, text) {
			return { lineId: id, text: text };
		}
	}, {
		key: "handleEnter",
		value: function handleEnter(text, lineId) {
			++this.lines;
			var lineData = this.state.lineData;
			var newLine = this.newLine(this.lines, text);
			var selected = this.state.selected;
			if (lineId !== lineData[lineData.length - 1].lineId) {
				var index = lineData.findIndex(function (e, i, a) {
					return e.lineId === lineId;
				});
				lineData.splice(index + 1, 0, newLine);
				selected = lineData[index + 1];
			} else {
				lineData.push(newLine);
				selected = lineData[lineData.length - 1];
			}
			this.setState({ lineData: lineData, selectedLine: selected });
		}
	}, {
		key: "handleDelete",
		value: function handleDelete() {}
	}, {
		key: "handleUpArrow",
		value: function handleUpArrow(offset, lineId) {
			if (this.state.lineData[0].lineId !== lineId) {
				var index = this.state.lineData.findIndex(function (e, i, a) {
					return e.lineId === lineId;
				});
				this.setState({ selectedLine: this.state.lineData[index - 1], offset: offset });
			}
		}
	}, {
		key: "handleDownArrow",
		value: function handleDownArrow(offset, lineId) {
			if (this.state.lineData[this.state.lineData.length - 1].lineId !== lineId) {
				var index = this.state.lineData.findIndex(function (e, i, a) {
					return e.lineId === lineId;
				});
				this.setState({ selectedLine: this.state.lineData[index + 1], offset: offset });
			}
		}
	}, {
		key: "render",
		value: function render() {
			var lineElements = this.state.lineData.map(function (line) {
				var selected = line.lineId === this.state.selectedLine.lineId;
				var offset = selected ? this.state.offset : null;
				return React.createElement(Line, { key: line.lineId, lineId: line.lineId, text: line.text, selected: selected, offset: offset,
					handleEnter: this.handleEnter.bind(this),
					handleDelete: this.handleDelete.bind(this),
					handleUpArrow: this.handleUpArrow.bind(this),
					handleDownArrow: this.handleDownArrow.bind(this) });
			}.bind(this));
			return React.createElement(
				"div",
				{ className: "section", ref: "section", name: this.props.sectionId },
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

		var selected = _this3.props.selected ? `selected` : ``;
		_this3.state = { text: _this3.props.text, selected: selected, caretOffset: 0 };
		_this3.enterPressed = false;
		_this3.keyMap = [];
		return _this3;
	}

	_createClass(Line, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			if (this.props.selected) ReactDOM.findDOMNode(this.refs.line).focus();
		}
	}, {
		key: "componentDidUpdate",
		value: function componentDidUpdate() {
			if (this.shouldFocus) {
				ReactDOM.findDOMNode(this.refs.line).focus();
				this.shouldFocus = false;
			}
			if (!this.enterPressed && this.isFocused) {
				this.setCaretPosition.bind(this)();
			} else {
				this.enterPressed = false;
			}
		}
	}, {
		key: "componentWillReceiveProps",
		value: function componentWillReceiveProps(nextProps) {
			var selected = nextProps.selected ? `selected` : ``;
			var offset = nextProps.offset == null ? 0 : nextProps.offset;
			this.shouldFocus = nextProps.selected;
			this.setState({ selected: selected, caretOffset: offset });
		}
	}, {
		key: "setCaretPosition",
		value: function setCaretPosition() {
			var element = ReactDOM.findDOMNode(this.refs.line);
			if (element.childNodes.length !== 0) {
				var selection = window.getSelection();
				var range = document.createRange();
				range.setStart(element.childNodes[0], this.state.caretOffset);
				selection.removeAllRanges();
				selection.addRange(range);
			}
		}
	}, {
		key: "handleKeyPress",
		value: function handleKeyPress(e) {
			e.preventDefault();
			var charCode = e.which || e.keyCode;
			var charTyped = String.fromCharCode(charCode);
			var newText = this.state.text + charTyped;
			var offset = window.getSelection().focusOffset + 1;
			this.setState({ text: newText, caretOffset: offset });
		}
	}, {
		key: "handleKeyDown",
		value: function handleKeyDown(e) {
			this.keyMap[e.keyCode] = e.type === `keydown`;
			if (e.keyCode === 13) {
				//enter
				this.enterPressed = true;
				var selectionOffset = window.getSelection().baseOffset;
				var movedText = this.state.text.substring(selectionOffset, this.state.text.length);
				var remainingText = this.state.text.substring(0, selectionOffset);
				this.props.handleEnter(movedText, this.props.lineId);
				this.setState({ text: remainingText });
			} else if (e.keyCode === 38) {
				//upArrow
				var selectionOffset = window.getSelection().baseOffset;
				this.props.handleUpArrow(selectionOffset, this.props.lineId);
			} else if (e.keyCode === 40) {
				//downArrow
				var selectionOffset = window.getSelection().baseOffset;
				this.props.handleDownArrow(selectionOffset, this.props.lineId);
			}
		}
	}, {
		key: "handleKeyUp",
		value: function handleKeyUp(e) {
			this.keyMap[e.keyCode] = e.type === `keydown`;
			if (e.keyCode === 8) {
				//delete
				var newText = ReactDOM.findDOMNode(this.refs.line).innerHTML;
				this.setState({ text: newText });
			}
		}
	}, {
		key: "handleClick",
		value: function handleClick(e) {
			console.log(`clicked`);
			if (this.state.selected === ``) {
				var selectionOffset = window.getSelection().baseOffset;
				this.setState({ selected: `selected`, caretOffset: selectionOffset });
			}
		}
	}, {
		key: "handleOnFocus",
		value: function handleOnFocus() {
			this.isFocused = true;
		}
	}, {
		key: "handleOnBlur",
		value: function handleOnBlur() {
			this.isFocused = false;
			this.setState({ selected: `` });
		}
	}, {
		key: "render",
		value: function render() {
			return React.createElement(
				"p",
				{
					className: `editor-line ` + this.state.selected,
					name: this.props.lineId,
					ref: "line",
					onKeyPress: this.handleKeyPress.bind(this),
					onKeyDown: this.handleKeyDown.bind(this),
					onKeyUp: this.handleKeyUp.bind(this),
					onClick: this.handleClick.bind(this),
					onFocus: this.handleOnFocus.bind(this),
					onBlur: this.handleOnBlur.bind(this),
					contentEditable: "true" },
				this.state.text
			);
		}
	}]);

	return Line;
}(React.Component);