export const conversationsMapper = (users, conversations) => {
  const userMap = users.reduce((map, user) => { map[user.id] = user; return map; }, {});
  return conversations.map(({ conversationid, lastMessage, participants }) => (
    { id: conversationid, users: participants.map(id => userMap[id]), lastMessage }
  ));
};

export const conversationMapper = (users, { conversationid, participants, messages }) => {
  const userMap = users.reduce((map, user) => { map[user.id] = user; return map; }, {});
  return { id: conversationid, users: participants.map(id => userMap[id]), messages };
};

export const messageMapper = dbMessage => ({
  id: dbMessage.id,
  content: dbMessage.content,
  timeStamp: dbMessage.time_stamp,
  userId: dbMessage.user_id,
});
