'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.conversationsMapper = exports.conversationMapper = undefined;

var _userDto = require('../../userService/model/userDto.js');

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var conversationMapper = exports.conversationMapper = function conversationMapper(users, conversation) {
  return { users: users, id: conversation.conversation.conversation_id, messages: conversation.messages };
};

var conversationsMapper = function conversationsMapper(conversations) {
  var conversationMap = conversations.reduce(function (map, conversation) {
    var conversation_id = conversation.conversation_id,
        message_id = conversation.message_id,
        message_content = conversation.message_content,
        message_user_id = conversation.message_user_id,
        user = _objectWithoutProperties(conversation, ['conversation_id', 'message_id', 'message_content', 'message_user_id']);

    if (map[conversation_id]) map[conversation_id].users.push(user);else map[conversation_id] = { users: [user], lastMessage: { id: message_id, content: message_content, userId: message_user_id } };
    return map;
  }, {});
  return Object.keys(conversationMap).map(function (id) {
    return { id: id, users: conversationMap[id].users, lastMessage: conversationMap[id].lastMessage };
  });
};
exports.conversationsMapper = conversationsMapper;