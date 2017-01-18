import { userMapper } from '../../userService/model/userDto.js'

export const conversationMapper = (users, conversation) => {
  return { users, id: conversation.conversation.conversation_id, messages: conversation.messages };
}
