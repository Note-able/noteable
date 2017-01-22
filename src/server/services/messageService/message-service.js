import { conversationMapper } from './model/conversationDto.js';
import { UserService } from '../index.js';

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
    this.m_userService = new UserService(options);
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
        .on('end', () => {
          connection.done();
          resolve(conversation[0].createconversation);
        })
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
        connection.client.query(`
          BEGIN;
            SELECT conversation_id INTO conversations_temp
            FROM conversations
            WHERE is_deleted = 0 AND user_id = ${userId};
            

            SELECT
              c.conversation_id as conversationId,
              p.id,
              p.email,
              p.location,
              p.cover_url as coverUrl,
              p.first_name as firstName,
              p.last_name as lastName,
              p.avatar_url as avatarUrl,
              p.bio,
              m.id AS message_id,
              m.content AS message_content,
              m.user_id AS message_user_id
            FROM conversations_temp ct
              INNER JOIN conversations c
                ON ct.conversation_id = c.conversation_id
              INNER JOIN profile p
                ON p.id = c.user_id
              INNER JOIN (
                SELECT DISTINCT ON (conversation_id) id, content, user_id, conversation_id
                FROM messages
                ORDER BY conversation_id, id DESC
              ) as m
                ON ct.conversation_id = m.conversation_id;
            
            DROP TABLE conversations_temp;
          COMMIT;`)
          .on('row', row => { conversations.push(row); })
          .on('error', error => { reject(error); return; })
          .on('end', () => {
            connection.done();
            resolve(conversations);
          });

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
          SELECT *
          FROM conversations
          WHERE conversation_id = ${conversationId} AND is_deleted = 0 AND user_id = ${userId};
          
          SELECT *
          FROM messages
          WHERE is_deleted = 0 AND conversation_id = ${conversationId}
          LIMIT 20;
        `)
        .on('row', row => { conversation.push(row); })
        .on('error', error => { reject(error); return; })
        .on('end', () => { 
          connection.done();
          const messages = [  ...conversation ];
          messages.splice(0,1);
          resolve(conversation.length > 0 ? { conversation: conversation[0], messages } : null);
        });
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
        .on('end', () => {
          connection.done();
          resolve(message[0]);
          return; 
        });
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
          const query = `
            SELECT m.id, m.user_id, m.content, m.conversation_id, m.time_stamp FROM messages AS m INNER JOIN conversations AS c
            ON c.conversation_id = m.conversation_id
            WHERE m.is_deleted = 0 AND c.is_deleted = 0 AND c.user_id = ${userId} AND m.conversation_id = ${conversationId} LIMIT ${count || 10} OFFSET ${start || 0};
          `;
          const messages = [];
          connection.client.query(query)
          .on('row', row => { messages.push(row); })
          .on('error', error => { reject({ error, query }); return; })
          .on('end', end => {
            connection.done();
            resolve(messages);
          });
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
        .on('end', () => {
          connection.done();
          resolve(messageId);
        });
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
        .on('end', () => {
          connection.done();
          resolve(messageId);
        });
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
        .on('end', () => {
          connection.done();
          resolve(conversations.length);
        });
      });
    });
  }
}
