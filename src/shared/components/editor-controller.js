'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const Router = require('react-router');
const Section = require('./editor/section');
const AudioRecord = require('./record-audio-component');
const MessageComponent = require('./messaging/message-component');
const MessageFeed = require('./messaging/message-feed');
const { createStore } = require('redux');
const MessageStore = createStore(require('../stores/store'));
let socket;

module.exports = class EditorController extends React.Component {
  constructor (props, context) {
    super(props, context);

    this.sections = 0;
    this.state = MessageStore.getState();
    socket = require('socket.io-client')('http://localhost:8080', {query: `context=${this.state.contextId}`});//req.params.doc_id
    socket.on('incoming', (message) => { this.handleNewMessage(message) });
    this.unsubscribe = MessageStore.subscribe(() => { this.handleMessagesUpdate() })
  }

  handleMessagesUpdate() {
    this.setState(MessageStore.getState());
  }
  
  handleNewMessage(message) {
    console.log(message);
    MessageStore.dispatch({
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

  render() {
    ++this.sections;

    return (
      <div className="editor-container">
        <div className="editor" contentEditable="false">
          <Section sectionId={this.sections}></Section>
        </div>
        <div className="record">
          <AudioRecord/>
        </div>  
        <div className="messages-container">
          <div className="messages-wrapper">
            <MessageFeed messages={this.state.messages} />
            <MessageComponent isEditor sendMessage={(content) => {this.sendMessage(content)}}/>
          </div>
        </div>
      </div>
    );
  }
}
