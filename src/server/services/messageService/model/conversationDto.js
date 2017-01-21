import { userMapper } from '../../userService/model/userDto.js'

export const conversationMapper = (users, conversation) => {
  return { users, id: conversation.conversation.conversation_id, messages: conversation.messages };
}

export const conversationsMapper = (conversations) => {
  const conversationMap = conversations.reduce((map, conversation) => {
    const { conversation_id, message_id, message_content, message_user_id, ...user } = conversation;
    if (map[conversation_id])
      map[conversation_id].users.push(user);
    else
      map[conversation_id] = { users: [user], lastMessage: { id: message_id, content: message_content, userId: message_user_id } };
    return map;
  }, {});
  return Object.keys(conversationMap).map((id) => {
    return { id, users: conversationMap[id].users, lastMessage: conversationMap[id].lastMessage };
  });
}
