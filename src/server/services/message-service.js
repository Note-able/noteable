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

  createConversation(userIds) {
    return new Promise((resolve, reject) => {
      if (userIds == null || userIds.length === 0) {
        reject('Cannot have empty userIds');
        return;
      }

      this.options.connect(this.options.database, (connection) => {
        if (connection.client == null) {
          reject('Failed to connect to database.');
          return;
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
        .on('error', (error) => { reject(error); return; })
        .on('end', () => { resolve(conversation[0].createconversation); })
      });
    });
  }

  getConversationsByUserId(userId) {
    return new Promise((resolve, reject) => {
      if (userId == null) {
        reject('Empty userId');
        return;
      }

      this.options.connect(this.options.database, (connection) => {
        if (connection.client == null) {
          reject('Failed to connect to database.');
          return;
        }

        const conversations = [];
        connection.client.query(`SELECT * FROM conversations WHERE is_deleted = 0 AND user_id = ${userId};`)
          .on('row', row => { conversations.push(row); })
          .on('error', error => { reject(error); return; })
          .on('end', () => { resolve(conversations); });
      })
    });
  }

  getConversation(conversationId, userId) {
    return new Promise((resolve, reject) => {
      if (conversationId == null) {
        reject('Empty conversation or user id.');
        return;
      }

      this.options.connect(this.options.database, (connection) => {
        if (connection.client == null) {
          reject('Failed to connect to database.');
          return;
        }

        const conversation = [];
        connection.client.query(`
          SELECT * FROM conversations AS c INNER JOIN messages AS m ON c.conversation_id = m.conversation_id WHERE c.is_deleted = 0 AND c.conversation_id = ${conversationId} AND c.user_id = ${userId} LIMIT 20;
        `)
        .on('row', row => { conversation.push(row); })
        .on('error', error => { reject(error); return; })
        .on('end', () => { resolve(conversation); });
      })
    });
  }

  getMessage(messageId, userId) {
    return new Promise((resolve, reject) => {
      if (messageId == null) {
        reject('Empty message or user id.');
        return;
      }

      this.options.connect(this.options.database, (connection) => {
        if (connection.client == null) {
          reject('Failed to connect to database.');
          return;
        }

        const message = [];
        let errorMessage;
        connection.client.query(`
          SELECT * FROM messages WHERE user_id = ${userId} AND id = ${messageId} AND is_deleted = 0 LIMIT 20;
        `)
        .on('row', row => { message.push(row); })
        .on('error', error => { reject(error); return; })
        .on('end', () => { resolve(message[0]); return; });
      })
    });
  }

  getMessages(userId, conversationId, start, count) {
    return new Promise((resolve, reject) => {
      if (userId == null || conversationId == null) {
        reject('Empty userId or conversationId');
      } else {
        this.options.connect(this.options.database, (connection) => {
          if (connection.client == null) {
            reject('Failed to connect to database.');
            return;
          }

          const messages = [];
          connection.client.query(`
            SELECT m.id, m.user_id, m.content, m.conversation_id, m.time_stamp FROM messages AS m INNER JOIN conversations AS c
            ON c.conversation_id = m.conversation_id
            WHERE m.is_deleted = 0 AND c.is_deleted = 0 AND c.user_id = ${userId} AND m.conversation_id = ${conversationId} LIMIT ${count || 10} OFFSET ${start || 0};
          `)
          .on('row', row => { messages.push(row); })
          .on('error', error => { reject(error); return; })
          .on('end', end => { resolve(messages); });
        });
      }
    });
  }

  createMessage(conversationId, userId, content, destinationId) {
    return new Promise((resolve, reject) => {
      if (conversationId == null || userId == null) {
        reject('Empty conversation or user id.');
        return;
      }

      this.options.connect(this.options.database, (connection) => {
        if (connection.client == null) {
          reject('Failed to connect to database.');
          return;
        }

        let messageId = -1;
        connection.client.query(`
          INSERT INTO messages (content, user_id, time_stamp, destination_id, conversation_id) values ('${content}', ${userId}, now(), ${destinationId == null ? 'default' : destinationId}, ${conversationId}) RETURNING id;
        `)
        .on('row', row => { messageId = row.id })
        .on('error', error => { reject(error); return; })
        .on('end', () => { resolve(messageId); });
      });
    });
  }

  deleteMessage(messageId) {
    return new Promise((resolve, reject) => {
      if (messageId == null) {
        reject('Empty messageId.');
        return;
      }

      this.options.connect(this.options.database, (connection) => {
        if (connection.client == null) {
          reject('Failed to connect to database.');
          return;
        }

        let messageId = -1;
        connection.client.query(`
          UPDATE messages SET is_deleted = 1 where id = ${messageId} RETURNING id;
        `)
        .on('row', row => { messageId = row.id; })
        .on('error', error => { reject(error); return; })
        .on('end', () => { resolve(messageId); });
      });
    });
  }

  deleteConversation(conversationId) {
    return new Promise((resolve, reject) => {
      if (conversationId == null) {
        reject('Empty conversationId.');
        return;
      }

      this.options.connect(this.options.database, (connection) => {
        if (connection.client == null) {
          reject('Failed to connect to database.');
          return;
        }

        const conversations = [];
        connection.client.query(`
          UPDATE messages SET is_deleted = 1 where conversation_id = ${conversationId} RETURNING id;
        `)
        .on('row', row => { conversations.push(row.id); })
        .on('error', error => { reject(error); return; })
        .on('end', () => { resolve(conversations.length); });
      });
    });
  }
}
