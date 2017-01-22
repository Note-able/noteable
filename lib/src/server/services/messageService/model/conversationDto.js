'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.conversationsMapper = exports.conversationMapper = undefined;

var _userDto = require('../../userService/model/userDto.js');

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var conversationMapper = exports.conversationMapper = function conversationMapper(users, conversation) {
  var messages = conversation.messages.map(function (dbMessage) {
    return {
      id: dbMessage.id,
      content: dbMessage.content,
      userId: dbMessage.user_id,
      timeStamp: dbMessage.time_stamp,
      isDeleted: dbMessage.is_deleted,
      conversationId: dbMessage.conversation_id
    };
  });
  return { users: users, id: conversation.conversation.conversation_id, messages: messages };
};

var conversationsMapper = function conversationsMapper(conversations) {
  var conversationMap = conversations.reduce(function (map, conversation) {
    var conversationid = conversation.conversationid,
        message_id = conversation.message_id,
        message_content = conversation.message_content,
        message_user_id = conversation.message_user_id,
        user = _objectWithoutProperties(conversation, ['conversationid', 'message_id', 'message_content', 'message_user_id']);

    if (map[conversationid]) map[conversationid].users.push(user);else map[conversationid] = { users: [user], lastMessage: { id: message_id, content: message_content, userId: message_user_id } };
    return map;
  }, {});
  return Object.keys(conversationMap).map(function (id) {
    return { id: id, users: conversationMap[id].users, lastMessage: conversationMap[id].lastMessage };
  });
};
exports.conversationsMapper = conversationsMapper;