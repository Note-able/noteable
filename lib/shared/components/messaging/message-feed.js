'use strict';

const React = require(`react`);

module.exports = class MessageFeed extends React.Component {
  constructor(props) {
    super(props);
  }

  renderMessage(message) {
    let classId = 'single-message';
    switch (message.collection) {
      case 'top':
        classId = 'top-message';
      case 'middle':
        classId = 'middle-message';
      case 'bottom':
        classId = 'bottom-message';
    }

    return React.createElement(
      'li',
      { className: `message-feed__message message-collection ${ classId } ${ message.userId === this.props.currentUserId ? 'message-feed__message--me' : '' }` },
      message.content
    );
  }
  render() {
    return React.createElement(
      'ul',
      { className: 'message-feed' },
      this.props.messages.map(message => {
        return this.renderMessage(message);
      })
    );
  }
};