export const conversationsMapper = (users, conversations) => {
  const userMap = users.reduce((map, user) => { map[user.id] = user; return map; }, {});
  return conversations.map(({ conversationId, lastMessage, participants }) => (
    { id: conversationId, users: participants.map(id => userMap[id]), lastMessage }
  ));
};

export const conversationMapper = (users, { conversationId, participants, messages, isDeleted }) => {
  const userMap = users.reduce((map, user) => { map[user.id] = user; return map; }, {});
  return { id: conversationId, users: participants.map(id => userMap[id]), messages, isDeleted: !!isDeleted };
};

export const messageMapper = dbMessage => ({
  id: dbMessage.id,
  content: dbMessage.content,
  timeStamp: dbMessage.time_stamp,
  userId: dbMessage.user_id,
});
