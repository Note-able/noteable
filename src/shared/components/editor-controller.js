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
const AJAX = require('../ajax');
let socket;

module.exports = class EditorController extends React.Component {
  constructor (props, context) {
    super(props, context);

    this.sections = 0;
    this.state = MessageStore.getState();
    AJAX.Get('/me', (response) => {
      const resp = JSON.parse(response);
      MessageStore.dispatch({
        type: 'ADD_DETAILS',
        userId: resp.userId,
        documentId: this.props.routeParams.documentId
      });
    });
  }
  
  componentDidMount() {
    socket = require('socket.io-client')('http://localhost:8080', {query: `context=${this.props.routeParams.documentId}`});
    socket.on('incoming', (message) => { this.handleNewMessage(message) });
    this.unsubscribe = MessageStore.subscribe(() => { this.handleMessagesUpdate() }) 
    
    const lastIndex = this.state.messages.length !== 0 ? this.state.messages[this.state.messages.length - 1].id : 0;
    AJAX.Get(`/messages/${this.state.documentId}/${lastIndex}`, (response) => {
      MessageStore.dispatch({
        type: 'PAGE_MESSAGES',
        response: JSON.parse(response)
      });
    });
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
            <MessageFeed currenUserId={this.state.userId} messages={this.state.messages} />
            <MessageComponent isEditor sendMessage={(content) => {this.sendMessage(content)}}/>
          </div>
        </div>
      </div>
    );
  }
}
