const userMapper = (dbUser) => ({
  avatarUrl: dbUser.avatar_url,
  coverImage: dbUser.cover_url,
  id: dbUser.id,
  email: dbUser.email,
  location: dbUser.location,
  name: dbUser.name,
  bio: dbUser.bio,
  preferences: {
    instruments: dbUser.instruments.split(','),
  },
});

/** MESSAGES API ***/
/**
 * MESSAGE {
 *  CONTENT
 *  ID
 *  SOURCE
 *  DESTINATION
 *  CONVERSATION
 * }
 * 
 * SEQUENCE CONVERSATION ID
 * 
 * CONVERSATION {
 *  USERID
 *  CONVERSATIONID
 *  LAST READ MESSAGE
 *  ID
 * }
 * 
 * CREATE CONVERSATION
 * CREATE MESSAGE
 * 
 * DELETE CONVERSATION
 * 
 * GET CONVERSATION BY ID
 * GET CONVERSATIONS BY USER ID
 * GET MESSAGE BY ID
 * GET MESSAGES BY CONVERSATION ID
 * GET MESSAGES BY USER ID
 * GET MESSAGE BY ID
 */

const createConversationSql = (userIds, next) => {
  if (userIds.length === 0) {
    return '';
  }

  return userIds.map(userId => `INSERT INTO public.conversations (user_id, conversation_id, last_read_message) VALUES (${userId}, ${next}, -1);`).join(' ');
};

export default class MessageService {
  constructor(options) {
    this.options = options;
  }

  createConversation(userIds, callback) {
    if (userIds == null || userIds.length === 0) {
      callback(null, 'Cannot have empty userIds');
    }

    this.options.connect(this.options.database, (connection) => {
      if (connection.client == null) {
        return callback(null, 'Failed to connect to database.');
      }

      const conversation = [];
      connection.client.query(`
        BEGIN;
          CREATE OR REPLACE FUNCTION createConversation() RETURNS int LANGUAGE plpgsql AS $$
          DECLARE conversationId integer;
          BEGIN
          SELECT nextval('conversation_ids') INTO conversationId;
          ${createConversationSql(userIds, 'conversationId')}
          RETURN conversationId;
          END $$;
          SELECT createConversation();
        COMMIT;
      `)
      .on('row', (row) => { conversation.push(row); })
      .on('error', (error) => {
        callback(null, error);
      })
      .on('end', () => {
        callback(conversation[0].createconversation);
      })
    })
  }

  getConversationsByUserId(userId, callback) {
    if (userId == null) {
      callback(null, 'Empty userId');
      return;
    }

    this.options.connect(this.options.database, (connection) => {
      if (connection.client == null) {
        callback(null, 'Failed to connect to database.');
        return;
      }

      const conversations = [];
      connection.client.query(`SELECT * FROM conversations WHERE user_id = ${userId};`)
        .on('row', row => { conversations.push(row); })
        .on('error', error => { callback(null, error); })
        .on('end', () => { callback(conversations); });
    })
  }

  getConversation(conversationId, userId, callback) {
    if (conversationId == null) {
      callback(null, 'Empty conversation or user id.');
      return;
    }

    this.options.connect(this.options.database, (connection) => {
      if (connection.client == null) {
        callback(null, 'Failed to connect to database.');
        return;
      }

      const conversation = [];
      connection.client.query(`
        SELECT * FROM conversations AS c INNER JOIN messages AS m ON c.conversation_id = m.conversation_id WHERE c.conversation_id = ${conversationId} AND c.user_id = ${userId} LIMIT 20;
      `)
      .on('row', row => { conversation.push(row); })
      .on('error', error => { callback(null, error); })
      .on('end', () => { callback(conversation); });
    })
  }

  getMessage(messageId, userId, callback) {
    if (messageId == null) {
      callback(null, 'Empty message or user id.');
      return;
    }

    this.options.connect(this.options.database, (connection) => {
      if (connection.client == null) {
        callback(null, 'Failed to connect to database.');
        return;
      }

      const message = [];
      let errorMessage;
      connection.client.query(`
        SELECT * FROM messages WHERE user_id = ${userId} AND id = ${messageId} LIMIT 20;
      `)
      .on('row', row => { message.push(row); })
      .on('error', error => { callback(null, error); errorMessage = error; })
      .on('end', () => { callback(message[0]); });
    })
  }

  getMessages(userId, conversationId, start, count, callback) {
    if (userId == null || conversationId == null) {
      callback(null, 'Empty userId or conversationId');
    } else {
      this.options.connect(this.options.database, (connection) => {
        if (connection.client == null) {
          callback(null, 'Failed to connect to database.');
          return;
        }

        const messages = [];
        connection.client.query(`
          SELECT m.id, m.user_id, m.content, m.conversation_id, m.time_stamp FROM messages AS m INNER JOIN conversations AS c
          ON c.conversation_id = m.conversation_id
          WHERE c.user_id = ${userId} AND m.conversation_id = ${conversationId} LIMIT ${count || 10} OFFSET ${start || 0};
        `)
        .on('row', row => { messages.push(row); })
        .on('error', error => { callback(null, error); return; })
        .on('end', end => { callback(messages); });
      });
    }
  }

  createMessage(conversationId, userId, content, destinationId, callback) {
    if (conversationId == null || userId == null) {
      callback(null, 'Empty conversation or user id.');
      return;
    }

    this.options.connect(this.options.database, (connection) => {
      if (connection.client == null) {
        callback(null, 'Failed to connect to database.');
        return;
      }

      let messageId = -1;
      connection.client.query(`
        INSERT INTO messages (content, user_id, time_stamp, destination_id, conversation_id) values ('${content}', ${userId}, now(), ${destinationId == null ? 'default' : destinationId}, ${conversationId}) RETURNING id;
      `)
      .on('row', row => { messageId = row.id })
      .on('error', error => { callback(null, error); return; })
      .on('end', () => { callback(messageId); });
    });
  }

  updateProfile(profile, callback) {
    this.options.connect(this.options.database, (connection) => {
      connection.client.query(`
        UPDATE public.profile SET location = '${profile.location}', bio = $$${profile.bio}$$, cover_url = '${profile.coverImage}', name = '${profile.name}', avatar_url = '${profile.avatarUrl}'
        WHERE id = ${profile.id};
        UPDATE public.instruments SET instruments = '${profile.preferences.instruments.toString()}'
        WHERE user_id = ${profile.id};
      `).on('error', (error) => {
        console.log(error);
      }).on('end', () => {
        callback();
      });
    });
  }
}
