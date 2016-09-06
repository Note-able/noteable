'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const Router = require('react-router');
const Editor = require('./editor/editor');
const AudioRecord = require('./record-audio-component');
const MessageComponent = require('./messaging/message-component');
const MessageFeed = require('./messaging/message-feed');
import { connect } from 'react-redux';
const AJAX = require('../ajax');
let socket;

import { initializeEditor } from './actions/editor-actions';

const mapStateToProps = (state) => {
  return state;
}

const mapDispatchToProps = (dispatch) => {
  return {
    initializeEditor: (sectionData) => {
      initializeEditor(sectionData)
    },
    initialState: (userId, documentId) => {
      dispatch({
        type: 'INITIAL_STATE',
        userId,
        documentId,
      });
    },
    pageMessages: (response) => {
      dispatch({
        type: 'PAGE_MESSAGES',
        response,
      });
    },
    newMessage: (message) => {
      dispatch({
        type: 'RECEIVE_MESSAGE',
        userId: message.userId,
        contextId: message.documentId,
        content: message.message,
        id: message.id
      });
    }
  };
}

class EditorController extends React.Component {
  constructor (props, context) {
    super(props, context);

    this.state = this.props;
    const initialState = window.__INITIAL_STATE__;

    this.props.initialState(initialState.userId, this.props.routeParams.documentId);
  }

  componentDidMount() {
    socket = require('socket.io-client')('http://localhost:8080', {query: `context=${this.props.routeParams.documentId}`});
    socket.on('incoming', (message) => { this.handleNewMessage(message) });
    //this.unsubscribe = store.subscribe(() => { this.handleMessagesUpdate() })

    const lastIndex = this.state.messageApp.messages.length !== 0 ? this.state.messageApp.messages[this.state.messages.length - 1].id : 0;
    AJAX.Get(`/messages/${this.state.messageApp.documentId}/${lastIndex}`, (response) => {
      this.props.pageMessages(JSON.parse(response));
    });
  }

  /**handleMessagesUpdate() {
    this.setState(store.getState());
  }**/

  handleNewMessage(message) {
    this.props.newMessage(message);
  }

  sendMessage(content) {
    socket.emit('message', {documentId: this.state.messageApp.documentId, message: content, userId: this.state.messageApp.userId});
  }

  render () {
    return (
      <div className="editor-container">
        <div className="record">
          <AudioRecord/>
        </div>
          <Editor
            initializeEditor={this.props.initializeEditor}
            routeParams={this.props.routeParams}
            sectionData={this.props.editor.sectionData}
            />
        <div className="messages-container">
          <div className="messages-wrapper">
            <MessageFeed currenUserId={this.state.messageApp.userId} messages={this.state.messageApp.messages} />
            <MessageComponent isEditor sendMessage={(content) => {this.sendMessage(content)}}/>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(EditorController);