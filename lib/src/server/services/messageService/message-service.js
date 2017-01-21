'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _conversationDto = require('./model/conversationDto.js');

var _index = require('../index.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
    this.m_userService = new _index.UserService(options);
  }

  _createClass(MessageService, [{
    key: 'createConversation',
    value: function createConversation(userIds) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        if (userIds == null || userIds.length === 0) {
          reject('Cannot have empty userIds');
          return;
        }

        _this.options.connect(_this.options.database, function (connection) {
          if (connection.client == null) {
            reject('Failed to connect to database.');
            return;
          }

          var conversation = [];
          connection.client.query('\n          BEGIN;\n            CREATE OR REPLACE FUNCTION createConversation() RETURNS int LANGUAGE plpgsql AS $$\n            DECLARE conversationId integer;\n            BEGIN\n            SELECT nextval(\'conversation_ids\') INTO conversationId;\n            ' + createConversationSql(userIds, 'conversationId') + '\n            RETURN conversationId;\n            END $$;\n            SELECT createConversation();\n          COMMIT;\n        ').on('row', function (row) {
            conversation.push(row);
          }).on('error', function (error) {
            reject(error);return;
          }).on('end', function () {
            resolve(conversation[0].createconversation);
          });
        });
      });
    }
  }, {
    key: 'getConversationsByUserId',
    value: function getConversationsByUserId(userId) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        if (userId == null) {
          reject('Empty userId');
          return;
        }

        _this2.options.connect(_this2.options.database, function (connection) {
          if (connection.client == null) {
            reject('Failed to connect to database.');
            return;
          }

          var conversations = [];
          connection.client.query('\n          BEGIN;\n            SELECT conversation_id INTO conversations_temp\n            FROM conversations\n            WHERE is_deleted = 0 AND user_id = ' + userId + ';\n            \n\n            SELECT\n              c.conversation_id,\n              p.id,\n              p.email,\n              p.location,\n              p.cover_url,\n              p.name,\n              p.avatar_url,\n              p.bio,\n              m.id AS message_id,\n              m.content AS message_content,\n              m.user_id AS message_user_id\n            FROM conversations_temp ct\n              INNER JOIN conversations c\n                ON ct.conversation_id = c.conversation_id\n              INNER JOIN profile p\n                ON p.id = c.user_id\n              INNER JOIN (\n                SELECT DISTINCT ON (conversation_id) id, content, user_id, conversation_id\n                FROM messages\n                ORDER BY conversation_id, id DESC\n              ) as m\n                ON ct.conversation_id = m.conversation_id;\n            \n            DROP TABLE conversations_temp;\n          COMMIT;').on('row', function (row) {
            conversations.push(row);
          }).on('error', function (error) {
            reject(error);return;
          }).on('end', function () {
            resolve(conversations);
          });
        });
      });
    }
  }, {
    key: 'getConversation',
    value: function getConversation(conversationId, userId) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        if (conversationId == null) {
          reject('Empty conversation or user id.');
          return;
        }

        _this3.options.connect(_this3.options.database, function (connection) {
          if (connection.client == null) {
            reject('Failed to connect to database.');
            return;
          }

          var conversation = [];
          connection.client.query('\n          SELECT *\n          FROM conversations\n          WHERE conversation_id = ' + conversationId + ' AND is_deleted = 0 AND user_id = ' + userId + ';\n          \n          SELECT *\n          FROM messages\n          WHERE is_deleted = 0 AND conversation_id = ' + conversationId + '\n          LIMIT 20;\n        ').on('row', function (row) {
            conversation.push(row);
          }).on('error', function (error) {
            reject(error);return;
          }).on('end', function () {
            var messages = [].concat(conversation);
            messages.splice(0, 1);
            resolve(conversation.length > 0 ? { conversation: conversation[0], messages: messages } : null);
          });
        });
      });
    }
  }, {
    key: 'getMessage',
    value: function getMessage(messageId, userId) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        if (messageId == null) {
          reject('Empty message or user id.');
          return;
        }

        _this4.options.connect(_this4.options.database, function (connection) {
          if (connection.client == null) {
            reject('Failed to connect to database.');
            return;
          }

          var message = [];
          var errorMessage = void 0;
          connection.client.query('\n          SELECT * FROM messages WHERE user_id = ' + userId + ' AND id = ' + messageId + ' AND is_deleted = 0 LIMIT 20;\n        ').on('row', function (row) {
            message.push(row);
          }).on('error', function (error) {
            reject(error);return;
          }).on('end', function () {
            resolve(message[0]);return;
          });
        });
      });
    }
  }, {
    key: 'getMessages',
    value: function getMessages(userId, conversationId, start, count) {
      var _this5 = this;

      return new Promise(function (resolve, reject) {
        if (userId == null || conversationId == null) {
          reject('Empty userId or conversationId');
        } else {
          _this5.options.connect(_this5.options.database, function (connection) {
            if (connection.client == null) {
              reject('Failed to connect to database.');
              return;
            }
            var query = '\n            SELECT m.id, m.user_id, m.content, m.conversation_id, m.time_stamp FROM messages AS m INNER JOIN conversations AS c\n            ON c.conversation_id = m.conversation_id\n            WHERE m.is_deleted = 0 AND c.is_deleted = 0 AND c.user_id = ' + userId + ' AND m.conversation_id = ' + conversationId + ' LIMIT ' + (count || 10) + ' OFFSET ' + (start || 0) + ';\n          ';
            var messages = [];
            connection.client.query(query).on('row', function (row) {
              messages.push(row);
            }).on('error', function (error) {
              reject({ error: error, query: query });return;
            }).on('end', function (end) {
              resolve(messages);
            });
          });
        }
      });
    }
  }, {
    key: 'createMessage',
    value: function createMessage(conversationId, userId, content, destinationId) {
      var _this6 = this;

      return new Promise(function (resolve, reject) {
        if (conversationId == null || userId == null) {
          reject('Empty conversation or user id.');
          return;
        }

        _this6.options.connect(_this6.options.database, function (connection) {
          if (connection.client == null) {
            reject('Failed to connect to database.');
            return;
          }

          var messageId = -1;
          connection.client.query('\n          INSERT INTO messages (content, user_id, time_stamp, destination_id, conversation_id) values (\'' + content + '\', ' + userId + ', now(), ' + (destinationId == null ? 'default' : destinationId) + ', ' + conversationId + ') RETURNING id;\n        ').on('row', function (row) {
            messageId = row.id;
          }).on('error', function (error) {
            reject(error);return;
          }).on('end', function () {
            resolve(messageId);
          });
        });
      });
    }
  }, {
    key: 'deleteMessage',
    value: function deleteMessage(messageId) {
      var _this7 = this;

      return new Promise(function (resolve, reject) {
        if (messageId == null) {
          reject('Empty messageId.');
          return;
        }

        _this7.options.connect(_this7.options.database, function (connection) {
          if (connection.client == null) {
            reject('Failed to connect to database.');
            return;
          }

          var messageId = -1;
          connection.client.query('\n          UPDATE messages SET is_deleted = 1 where id = ' + messageId + ' RETURNING id;\n        ').on('row', function (row) {
            messageId = row.id;
          }).on('error', function (error) {
            reject(error);return;
          }).on('end', function () {
            resolve(messageId);
          });
        });
      });
    }
  }, {
    key: 'deleteConversation',
    value: function deleteConversation(conversationId) {
      var _this8 = this;

      return new Promise(function (resolve, reject) {
        if (conversationId == null) {
          reject('Empty conversationId.');
          return;
        }

        _this8.options.connect(_this8.options.database, function (connection) {
          if (connection.client == null) {
            reject('Failed to connect to database.');
            return;
          }

          var conversations = [];
          connection.client.query('\n          UPDATE messages SET is_deleted = 1 where conversation_id = ' + conversationId + ' RETURNING id;\n        ').on('row', function (row) {
            conversations.push(row.id);
          }).on('error', function (error) {
            reject(error);return;
          }).on('end', function () {
            resolve(conversations.length);
          });
        });
      });
    }
  }]);

  return MessageService;
}();

exports.default = MessageService;