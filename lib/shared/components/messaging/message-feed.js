'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

const React = require(`react`);

module.exports = function (_React$Component) {
  _inherits(MessageFeed, _React$Component);

  function MessageFeed(props) {
    _classCallCheck(this, MessageFeed);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(MessageFeed).call(this, props));
  }

  _createClass(MessageFeed, [{
    key: 'renderMessage',
    value: function renderMessage(message) {
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
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'ul',
        { className: 'message-feed' },
        this.props.messages.map(message => {
          return this.renderMessage(message);
        })
      );
    }
  }]);

  return MessageFeed;
}(React.Component);