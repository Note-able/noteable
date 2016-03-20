'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const Router = require('react-router');
const Editor = require('./editor/editor');
const AudioRecord = require('./record-audio-component');
const MessageComponent = require('./messaging/message-component');
const MessageFeed = require('./messaging/message-feed');
import { createStore } from 'redux';
const store = createStore(require('../stores/editor-store'));
import { Provider } from 'react-redux';
const AJAX = require('../ajax');
let socket;

module.exports = class EditorController extends React.Component {
  constructor (props, context) {
    super(props, context);

    this.state = store.getState();
    AJAX.Get('/me', (response) => {
      const resp = JSON.parse(response);
      store.dispatch({
        type: 'INITIAL_STATE',
        userId: resp.userId,
        documentId: this.props.routeParams.documentId
      });
    });
  }

  componentDidMount() {
    socket = require('socket.io-client')('http://localhost:8080', {query: `context=${this.props.routeParams.documentId}`});
    socket.on('incoming', (message) => { this.handleNewMessage(message) });
    this.unsubscribe = store.subscribe(() => { this.handleMessagesUpdate() })

    const lastIndex = this.state.messages.length !== 0 ? this.state.messages[this.state.messages.length - 1].id : 0;
    AJAX.Get(`/messages/${this.state.documentId}/${lastIndex}`, (response) => {
      store.dispatch({
        type: 'PAGE_MESSAGES',
        response: JSON.parse(response)
      });
    });
  }

  handleMessagesUpdate() {
    this.setState(Store.getState());
  }

  handleNewMessage(message) {
    console.log(message);
    store.dispatch({
      type: 'RECEIVE_MESSAGE',
      userId: message.userId,
      contextId: message.documentId,
      content: message.message,
      id: message.id
    });
  }

  sendMessage(content) {
    socket.emit('message', {documentId: this.state.documentId, message: content, userId: this.state.userId});
  }

  render () {
    return (
      <Provider store={store}>
      <div className="editor-container">
        <div className="record">
          <AudioRecord/>
        </div>
          <Editor store={store}/>
        <div className="messages-container">
          <div className="messages-wrapper">
            <MessageFeed currenUserId={this.state.userId} messages={this.state.messages} />
            <MessageComponent isEditor sendMessage={(content) => {this.sendMessage(content)}}/>
          </div>
        </div>
      </div>
      </Provider>
    );
  }
}
