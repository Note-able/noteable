'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.conversationMapper = undefined;

var _userDto = require('../../userService/model/userDto.js');

var conversationMapper = exports.conversationMapper = function conversationMapper(users, conversation) {
  return { users: users, id: conversation.conversation.conversation_id, messages: conversation.messages };
};