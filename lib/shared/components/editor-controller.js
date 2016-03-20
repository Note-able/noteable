'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

const React = require('react');
const ReactDOM = require('react-dom');
const Router = require('react-router');
const Editor = require('./editor/editor');
const AudioRecord = require('./record-audio-component');
const MessageComponent = require('./messaging/message-component');
const MessageFeed = require('./messaging/message-feed');
import { createStore } from 'redux';
const store = createStore(require('../stores/store'));
import { Provider } from 'react-redux';
const AJAX = require('../ajax');
let socket;

module.exports = function (_React$Component) {
  _inherits(EditorController, _React$Component);

  function EditorController(props, context) {
    _classCallCheck(this, EditorController);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(EditorController).call(this, props, context));

    _this.state = store.getState();
    AJAX.Get('/me', response => {
      const resp = JSON.parse(response);
      store.dispatch({
        type: 'INITIAL_STATE',
        userId: resp.userId,
        documentId: _this.props.routeParams.documentId
      });
    });
    return _this;
  }

  _createClass(EditorController, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      socket = require('socket.io-client')('http://localhost:8080', { query: `context=${ this.props.routeParams.documentId }` });
      socket.on('incoming', message => {
        this.handleNewMessage(message);
      });
      this.unsubscribe = store.subscribe(() => {
        this.handleMessagesUpdate();
      });

      const lastIndex = this.state.messages.length !== 0 ? this.state.messages[this.state.messages.length - 1].id : 0;
      AJAX.Get(`/messages/${ this.state.documentId }/${ lastIndex }`, response => {
        store.dispatch({
          type: 'PAGE_MESSAGES',
          response: JSON.parse(response)
        });
      });
    }
  }, {
    key: 'handleMessagesUpdate',
    value: function handleMessagesUpdate() {
      this.setState(Store.getState());
    }
  }, {
    key: 'handleNewMessage',
    value: function handleNewMessage(message) {
      console.log(message);
      store.dispatch({
        type: 'RECEIVE_MESSAGE',
        userId: message.userId,
        contextId: message.documentId,
        content: message.message,
        id: message.id
      });
    }
  }, {
    key: 'sendMessage',
    value: function sendMessage(content) {
      socket.emit('message', { documentId: this.state.documentId, message: content, userId: this.state.userId });
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        Provider,
        { store: store },
        React.createElement(
          'div',
          { className: 'editor-container' },
          React.createElement(
            'div',
            { className: 'record' },
            React.createElement(AudioRecord, null)
          ),
          React.createElement(Editor, { store: store }),
          React.createElement(
            'div',
            { className: 'messages-container' },
            React.createElement(
              'div',
              { className: 'messages-wrapper' },
              React.createElement(MessageFeed, { currenUserId: this.state.userId, messages: this.state.messages }),
              React.createElement(MessageComponent, { isEditor: true, sendMessage: content => {
                  this.sendMessage(content);
                } })
            )
          )
        )
      );
    }
  }]);

  return EditorController;
}(React.Component);