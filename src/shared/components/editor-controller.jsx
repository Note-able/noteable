import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { editorActions } from '../actions';

const Editor = require('./editor/editor');
const AudioRecord = require('./record-audio-component');
const MessageComponent = require('./messaging/message-component');
const MessageFeed = require('./messaging/message-feed');
const AJAX = require('../ajax');

const {
  addChord,
  addLine,
  deleteLine,
  initializeEditor,
  updateLines,
  updateSelected,
  updateText,
} = editorActions;

let socket;


const mapStateToProps = (state) => state;

const mapDispatchToProps = (dispatch) => ({
  editorDispatch: {
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
        id: message.id,
      });
    },
  },
  sectionDispatch: {
    addLine: (sectionId, lineId, index, type, text, shouldUpdateIndex, offset) =>
      dispatch(addLine(sectionId, lineId, index, type, text, shouldUpdateIndex, offset)),
    deleteLine: (sectionId, index) =>
      dispatch(deleteLine(sectionId, index)),
    initializeEditor: (sectionData) =>
      dispatch(initializeEditor(sectionData)),
    updateLines: (sectionId, lineActions, selectedIndex, offset) =>
      dispatch(updateLines(sectionId, lineActions, selectedIndex, offset)),
    updateSelected: (sectionId, index, offset) =>
      dispatch(updateSelected(sectionId, index, offset)),
    updateText: (sectionId, lineId, text, offset) =>
      dispatch(updateText(sectionId, lineId, text, offset)),
    addChord: (sectionId, lineId, text, index, updateSelectedFunction) =>
      dispatch(addChord(sectionId, lineId, text, index, updateSelectedFunction)),
  },
});

class EditorController extends Component {
  static propTypes = {
    editor: PropTypes.shape({
      sectionData: PropTypes.arrayOf(PropTypes.shape({})),
    }),
    editorDispatch: PropTypes.shape({
      initialState: PropTypes.func.isRequired,
      pageMessages: PropTypes.func.isRequired,
      newMessage: PropTypes.func.isRequired,
    }).isRequired,
    messageApp: PropTypes.shape({
      documentId: PropTypes.string,
    }),
    routeParams: PropTypes.shape({
      documentId: PropTypes.string,
    }),
    sectionDispatch: PropTypes.shape({}).isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.state = this.props;
    const initialState = window.__INITIAL_STATE__;

    this.props.editorDispatch.initialState(initialState.userId, this.props.routeParams.documentId);
  }

  componentDidMount() {
    socket = require('socket.io-client')('http://localhost:8080', { query: `context=${this.props.routeParams.documentId}` });

    socket.on('incoming', (message) => { this.handleNewMessage(message) });
    // this.unsubscribe = store.subscribe(() => { this.handleMessagesUpdate() })

    const lastIndex = this.state.messageApp.messages.length !== 0 ? this.state.messageApp.messages[this.state.messages.length - 1].id : 0;
    AJAX.get(`/messages/${this.state.messageApp.documentId}/${lastIndex}`, (response) => {
      this.props.editorDispatch.pageMessages(JSON.parse(response));
    });
  }

  /** handleMessagesUpdate() {
    this.setState(store.getState());
  }**/

  handleNewMessage(message) {
    this.props.editorDispatch.newMessage(message);
  }

  sendMessage(content) {
    socket.emit('message',
      {
        documentId: this.props.messageApp.documentId,
        message: content,
        userId: this.state.messageApp.userId,
      });
  }

  render() {
    return (
      <div className="editor-container">
        <div className="record">
          <AudioRecord />
        </div>
        <Editor
          sectionDispatch={this.props.sectionDispatch}
          routeParams={this.props.routeParams}
          sectionData={this.props.editor.sectionData}
        />
        <div className="messages-container">
          <div className="messages-wrapper">
            <MessageFeed
              currenUserId={this.state.messageApp.userId}
              messages={this.state.messageApp.messages}
            />
            <MessageComponent isEditor sendMessage={(content) => { this.sendMessage(content); }} />
          </div>
        </div>
      </div>
    );
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(EditorController);
