'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

const React = require('react');
const ReactDOM = require('react-dom');
const Router = require('react-router');
const MessageFeed = require('./message-feed');

module.exports = function (_React$Component) {
  _inherits(MessageComponent, _React$Component);

  function MessageComponent(props, context) {
    _classCallCheck(this, MessageComponent);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MessageComponent).call(this, props, context));

    _this.state = {
      messageText: ''
    };
    return _this;
  }

  _createClass(MessageComponent, [{
    key: 'keyDown',
    value: function keyDown(event) {
      if (event.keyCode === 13) {
        event.preventDefault();

        if (this.state.messageText.length > 0) {
          this.props.sendMessage(this.state.messageText);
          ReactDOM.findDOMNode(this.refs.messageEditor).value = '';
        }

        return;
      }
    }
  }, {
    key: 'setText',
    value: function setText(event) {
      if (this.state.messageText === event.target.value) {
        return;
      }

      this.setState({
        messageText: event.target.value
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement('textarea', { className: 'message-reply-editor',
        onInput: event => {
          this.setText(event);
        },
        onKeyDown: event => {
          this.keyDown(event);
        },
        placeholder: 'Write a message',
        ref: 'messageEditor' });
    }
  }]);

  return MessageComponent;
}(React.Component);