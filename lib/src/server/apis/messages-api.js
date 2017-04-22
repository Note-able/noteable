'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _services = require('../services');

var _conversationDto = require('../services/messageService/model/conversationDto');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

module.exports = function messagesApi(app, options) {
  var messageService = new _services.MessageService(options);
  var userService = new _services.UserService(options);

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
   * GET CONVERSATION BY ID
   * GET CONVERSATIONS BY USER ID
   * GET MESSAGE BY ID
   * GET MESSAGES BY CONVERSATION ID
   * GET MESSAGE BY ID
   */

  app.post('/conversations', options.auth, function (req, res) {
    if (!req.user) {
      res.status(404).send();
      return;
    }

    var userIds = req.body.userIds.split(',');
    messageService.createConversation(userIds).then(function (result) {
      if ((typeof result === 'undefined' ? 'undefined' : _typeof(result)) === 'object') {
        res.status(200).json(result);
      } else {
        res.status(201).json({ conversationId: result });
      }
    }).catch(function (error) {
      res.status(500).json(error);
    });
  });

  app.get('/conversations', options.auth, function (req, res) {
    if (!req.user) {
      res.status(404).send();
    } else {
      messageService.getConversationsByUserId(req.user.id).then(function (conversations) {
        var userIds = [].concat(_toConsumableArray(new Set(conversations.map(function (x) {
          return x.user_id;
        }))));
        userService.getUsers(userIds, function (users) {
          res.status(200).json((0, _conversationDto.conversationsMapper)(users, conversations));
        });
      }).catch(function (error) {
        res.status(500).json(error);
      });
    }
  });

  app.get('/conversation/:conversationId', options.auth, function (req, res) {
    if (!req.user) {
      res.status(404).send();
    } else if (req.params.conversationId == null) {
      res.status(400).send();
    } else {
      messageService.getConversation(req.params.conversationId, req.user.id).then(function (conversation) {
        // TODO: support groups or multiple userIds
        var userIds = [].concat(_toConsumableArray(new Set(conversation.messages.map(function (x) {
          return x.user_id;
        }))));
        userService.getUsers(userIds, function (users) {
          res.status(200).json((0, _conversationDto.conversationMapper)(users, conversation));
        });
      }).catch(function (error) {
        res.status(500).json(error);
      });
    }
  });

  app.get('/message/:messageId', options.auth, function (req, res) {
    if (!req.user) {
      res.status(404).send();
      return;
    }

    if (req.params.messageId == null) {
      res.status(400).send();
      return;
    }

    messageService.getMessage(req.params.messageId, req.user.id).then(function (message) {
      res.status(200).json(message);
    }).catch(function (error) {
      res.status(500).json(error);
    });
  });

  app.get('/messages/:conversationId', options.auth, function (req, res) {
    if (req.user == null) {
      res.status(404).send();
    } else if (req.params.conversationId == null) {
      res.status(400).send();
    } else {
      messageService.getMessages(req.user.id, req.params.conversationId, req.query.start, req.query.count).then(function (messages) {
        res.status(200).json(messages);
      }).catch(function (error) {
        res.status(500).json(error);
      });
    }
  });

  app.post('/messages', options.auth, function (req, res) {
    if (!req.user) {
      res.status(404).send();
      return;
    }

    if (req.body.content == null || req.body.conversationId == null) {
      res.status(400).send();
      return;
    }

    messageService.createMessage(req.body.conversationId, req.body.userId, req.body.content, req.body.destinationId).then(function (messageId) {
      res.status(201).json({ messageId: messageId });
      return;
    }).catch(function (error) {
      res.status(500).json(error);
    });
  });

  app.delete('/message/:messageId', options.auth, function (req, res) {
    if (req.user == null) {
      res.status(404).send();
      return;
    } else if (req.params.messageId == null) {
      res.status(400).send();
    }

    messageService.deleteMessage(req.params.messageId).then(function (count) {
      res.status(200).json(count);
    }).catch(function (error) {
      res.status(500).json(error);
    });
  });

  app.delete('/conversation/:conversationId', options.auth, function (req, res) {
    if (req.user == null) {
      res.status(404).send();
      return;
    } else if (req.params.conversationId == null) {
      res.status(400).send();
    }

    messageService.deleteConversation(req.params.conversationId).then(function (count) {
      res.status(200).json(count);
    }).catch(function (error) {
      res.status(500).json(error);
    });
  });
};