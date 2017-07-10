import React from 'react';
import MessageFeed from './message-feed';

export default class MessageComponent extends React.Component {
  constructor (props, context) {
    super(props, context);

    this.state = {
      messageText: ''
    }
  }

  keyDown(event) {
    if (event.keyCode === 13 ) {
      event.preventDefault();

      if (this.state.messageText.length > 0) {
        this.props.sendMessage(this.state.messageText);
        ReactDOM.findDOMNode(this.refs.messageEditor).value = '';
      }

      return;
    }
  }

  setText(event) {
    if (this.state.messageText === event.target.value) {
      return;
    }

    this.setState({
      messageText: event.target.value
    });
  }

  render() {
    return (
      <textarea className="message-reply-editor"
        onInput={(event) => {this.setText(event)}}
        onKeyDown={(event) => {this.keyDown(event)}}
        placeholder="Write a message"
        ref="messageEditor"/>
    );
  }
}
