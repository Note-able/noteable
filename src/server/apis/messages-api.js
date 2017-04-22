import { MessageService, UserService } from '../services';
import { conversationMapper, conversationsMapper } from '../services/messageService/model/conversationDto';

module.exports = function messagesApi(app, options) {
  const messageService = new MessageService(options);
  const userService = new UserService(options);

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

  app.post('/conversations', options.auth, (req, res) => {
    if (!req.user) {
      res.status(404).send();
      return;
    }

    const userIds = req.body.userIds.split(',');
    messageService.createConversation(userIds)
      .then(result => {
        if (typeof (result) === 'object') {
          res.status(200).json(result);
        } else {
          res.status(201).json({ conversationId: result });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });

  app.get('/conversations', options.auth, (req, res) => {
    if (!req.user) {
      res.status(404).send();
    } else {
      messageService.getConversationsByUserId(req.user.id)
        .then(conversations => {
          const userIds = [...new Set(conversations.map(x => x.user_id))];
          userService.getUsers(userIds, (users) => {
            res.status(200).json(conversationsMapper(users, conversations));
          });
        })
        .catch(error => {
          res.status(500).json(error);
        });
    }
  });

  app.get('/conversation/:conversationId', options.auth, (req, res) => {
    if (!req.user) {
      res.status(404).send();
    } else if (req.params.conversationId == null) {
      res.status(400).send();
    } else {
      messageService.getConversation(req.params.conversationId, req.user.id)
        .then(conversation => {
          // TODO: support groups or multiple userIds
          const userIds = [...new Set(conversation.messages.map(x => x.user_id))];
          userService.getUsers(userIds, (users) => {
            res.status(200).json(conversationMapper(users, conversation));
          });
        })
        .catch(error => {
          res.status(500).json(error);
        });
    }
  });

  app.get('/message/:messageId', options.auth, (req, res) => {
    if (!req.user) {
      res.status(404).send();
      return;
    }

    if (req.params.messageId == null) {
      res.status(400).send();
      return;
    }

    messageService.getMessage(req.params.messageId, req.user.id)
      .then(message => {
        res.status(200).json(message);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });

  app.get('/messages/:conversationId', options.auth, (req, res) => {
    if (req.user == null) {
      res.status(404).send();
    } else if (req.params.conversationId == null) {
      res.status(400).send();
    } else {
      messageService.getMessages(req.user.id, req.params.conversationId, req.query.start, req.query.count)
        .then(messages => {
          res.status(200).json(messages);
        })
        .catch(error => {
          res.status(500).json(error);
        });
    }
  });

  app.post('/messages', options.auth, (req, res) => {
    if (!req.user) {
      res.status(404).send();
      return;
    }

    if (req.body.content == null || req.body.conversationId == null) {
      res.status(400).send();
      return;
    }

    messageService.createMessage(req.body.conversationId, req.body.userId, req.body.content, req.body.destinationId)
      .then(messageId => {
        res.status(201).json({ messageId });
        return;
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });

  app.delete('/message/:messageId', options.auth, (req, res) => {
    if (req.user == null) {
      res.status(404).send();
      return;
    } else if (req.params.messageId == null) {
      res.status(400).send();
    }

    messageService.deleteMessage(req.params.messageId)
      .then(count => {
        res.status(200).json(count);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });

  app.delete('/conversation/:conversationId', options.auth, (req, res) => {
    if (req.user == null) {
      res.status(404).send();
      return;
    } else if (req.params.conversationId == null) {
      res.status(400).send();
    }

    messageService.deleteConversation(req.params.conversationId)
      .then(count => {
        res.status(200).json(count);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });
};
