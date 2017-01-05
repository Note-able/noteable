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

  getConversation(conversationId, callback) {
    if (conversationId == null) {
      callback(null, 'Cannot have empty conversationId.');
      return;
    }

    this.options.connect(this.options.database, (connection) => {
      if (connection.client == null) {
        return callback(null, 'Failed to connect to database.');
      }

      const conversation = [];
      connection.client.query(`
        DO $$
        DECLARE next integer;
        BEGIN
        SELECT nextval('conversation_ids');
      `)
    })
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
