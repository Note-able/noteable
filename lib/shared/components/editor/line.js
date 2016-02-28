'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

const React = require('react');
const ReactDOM = require('react-dom');

module.exports = function (_React$Component) {
  _inherits(Line, _React$Component);

  function Line(props, context) {
    _classCallCheck(this, Line);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Line).call(this, props, context));

    const selected = _this.props.selected ? 'selected' : '';
    _this.state = { text: _this.props.text, selected: selected };
    _this.enterPressed = false;
    _this.keyMap = [];
    return _this;
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
    value: function handleClick() {
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