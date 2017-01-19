import { userMapper } from '../../userService/model/userDto.js'

export const conversationMapper = (users, conversation) => {
  return { users, id: conversation.conversation.conversation_id, messages: conversation.messages };
}

export const conversationsMapper = (conversations) => {
  const conversationMap = conversations.reduce((map, conversation) => {
    const { conversation_id, ...user } = conversation;
    if (map[conversation_id])
      map[conversation_id].users.push(user);
    else
      map[conversation_id] = { users: [user] };
    return map;
  }, {});
  return Object.keys(conversationMap).map((id) => {
    return { id, users: conversationMap[id].users };
  });
}
