'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var userMapper = function userMapper(dbUser) {
  return {
    avatarUrl: dbUser.avatar_url,
    coverImage: dbUser.cover_url,
    id: dbUser.id,
    email: dbUser.email,
    location: dbUser.location,
    name: dbUser.name,
    bio: dbUser.bio,
    preferences: {
      instruments: dbUser.instruments.split(',')
    }
  };
};

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

var createConversationSql = function createConversationSql(userIds, next) {
  if (userIds.length === 0) {
    return '';
  }

  return userIds.map(function (userId) {
    return 'INSERT INTO public.conversations (user_id, conversation_id, last_read_message) VALUES (' + userId + ', ' + next + ', -1);';
  }).join(' ');
};

var MessageService = function () {
  function MessageService(options) {
    _classCallCheck(this, MessageService);

    this.options = options;
  }

  _createClass(MessageService, [{
    key: 'createConversation',
    value: function createConversation(userIds, callback) {
      if (userIds == null || userIds.length === 0) {
        callback(null, 'Cannot have empty userIds');
      }

      this.options.connect(this.options.database, function (connection) {
        if (connection.client == null) {
          return callback(null, 'Failed to connect to database.');
        }

        var conversation = [];
        connection.client.query('\n        BEGIN;\n          CREATE OR REPLACE FUNCTION createConversation() RETURNS int LANGUAGE plpgsql AS $$\n          DECLARE conversationId integer;\n          BEGIN\n          SELECT nextval(\'conversation_ids\') INTO conversationId;\n          ' + createConversationSql(userIds, 'conversationId') + '\n          RETURN conversationId;\n          END $$;\n          SELECT createConversation();\n        COMMIT;\n      ').on('row', function (row) {
          conversation.push(row);
        }).on('error', function (error) {
          callback(null, error);
        }).on('end', function () {
          callback(conversation[0].createconversation);
        });
      });
    }
  }, {
    key: 'getConversationsByUserId',
    value: function getConversationsByUserId(userId, callback) {
      if (userId == null) {
        callback(null, 'Empty userId');
        return;
      }

      this.options.connect(this.options.database, function (connection) {
        if (connection.client == null) {
          callback(null, 'Failed to connect to database.');
          return;
        }

        var conversations = [];
        connection.client.query('SELECT * FROM conversations WHERE is_deleted = 0 AND user_id = ' + userId + ';').on('row', function (row) {
          conversations.push(row);
        }).on('error', function (error) {
          callback(null, error);
        }).on('end', function () {
          callback(conversations);
        });
      });
    }
  }, {
    key: 'getConversation',
    value: function getConversation(conversationId, userId, callback) {
      if (conversationId == null) {
        callback(null, 'Empty conversation or user id.');
        return;
      }

      this.options.connect(this.options.database, function (connection) {
        if (connection.client == null) {
          callback(null, 'Failed to connect to database.');
          return;
        }

        var conversation = [];
        connection.client.query('\n        SELECT * FROM conversations AS c INNER JOIN messages AS m ON c.conversation_id = m.conversation_id WHERE c.is_deleted = 0 AND c.conversation_id = ' + conversationId + ' AND c.user_id = ' + userId + ' LIMIT 20;\n      ').on('row', function (row) {
          conversation.push(row);
        }).on('error', function (error) {
          callback(null, error);
        }).on('end', function () {
          callback(conversation);
        });
      });
    }
  }, {
    key: 'getMessage',
    value: function getMessage(messageId, userId, callback) {
      if (messageId == null) {
        callback(null, 'Empty message or user id.');
        return;
      }

      this.options.connect(this.options.database, function (connection) {
        if (connection.client == null) {
          callback(null, 'Failed to connect to database.');
          return;
        }

        var message = [];
        var errorMessage = void 0;
        connection.client.query('\n        SELECT * FROM messages WHERE user_id = ' + userId + ' AND id = ' + messageId + ' AND is_deleted = 0 LIMIT 20;\n      ').on('row', function (row) {
          message.push(row);
        }).on('error', function (error) {
          callback(null, error);errorMessage = error;
        }).on('end', function () {
          callback(message[0]);
        });
      });
    }
  }, {
    key: 'getMessages',
    value: function getMessages(userId, conversationId, start, count, callback) {
      if (userId == null || conversationId == null) {
        callback(null, 'Empty userId or conversationId');
      } else {
        this.options.connect(this.options.database, function (connection) {
          if (connection.client == null) {
            callback(null, 'Failed to connect to database.');
            return;
          }

          var messages = [];
          connection.client.query('\n          SELECT m.id, m.user_id, m.content, m.conversation_id, m.time_stamp FROM messages AS m INNER JOIN conversations AS c\n          ON c.conversation_id = m.conversation_id\n          WHERE m.is_deleted = 0 AND c.is_deleted = 0 AND c.user_id = ' + userId + ' AND m.conversation_id = ' + conversationId + ' LIMIT ' + (count || 10) + ' OFFSET ' + (start || 0) + ';\n        ').on('row', function (row) {
            messages.push(row);
          }).on('error', function (error) {
            callback(null, error);return;
          }).on('end', function (end) {
            callback(messages);
          });
        });
      }
    }
  }, {
    key: 'createMessage',
    value: function createMessage(conversationId, userId, content, destinationId, callback) {
      if (conversationId == null || userId == null) {
        callback(null, 'Empty conversation or user id.');
        return;
      }

      this.options.connect(this.options.database, function (connection) {
        if (connection.client == null) {
          callback(null, 'Failed to connect to database.');
          return;
        }

        var messageId = -1;
        connection.client.query('\n        INSERT INTO messages (content, user_id, time_stamp, destination_id, conversation_id) values (\'' + content + '\', ' + userId + ', now(), ' + (destinationId == null ? 'default' : destinationId) + ', ' + conversationId + ') RETURNING id;\n      ').on('row', function (row) {
          messageId = row.id;
        }).on('error', function (error) {
          callback(null, error);return;
        }).on('end', function () {
          callback(messageId);
        });
      });
    }
  }, {
    key: 'deleteMessage',
    value: function deleteMessage(messageId, callback) {
      if (messageId == null) {
        callback(null, 'Empty messageId.');
        return;
      }

      this.options.connect(this.options.database, function (connection) {
        if (connection.client == null) {
          callback(null, 'Failed to connect to database.');
          return;
        }

        var messageId = -1;
        connection.client.query('\n        UPDATE messages SET is_deleted = 1 where id = ' + messageId + ' RETURNING id;\n      ').on('row', function (row) {
          messageId = row.id;
        }).on('error', function (error) {
          callback(null, error);return;
        }).on('end', function () {
          callback(messageId);
        });
      });
    }
  }, {
    key: 'deleteConversation',
    value: function deleteConversation(conversationId, callback) {
      if (conversationId == null) {
        callback(null, 'Empty conversationId.');
        return;
      }

      this.options.connect(this.options.database, function (connection) {
        if (connection.client == null) {
          callback(null, 'Failed to connect to database.');
          return;
        }

        var conversations = [];
        connection.client.query('\n        UPDATE messages SET is_deleted = 1 where conversation_id = ' + conversationId + ' RETURNING id;\n      ').on('row', function (row) {
          conversations.push(row.id);
        }).on('error', function (error) {
          callback(null, error);return;
        }).on('end', function () {
          callback(conversations.length);
        });
      });
    }
  }]);

  return MessageService;
}();

exports.default = MessageService;