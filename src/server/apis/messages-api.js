import { MessageService, UserService } from '../services';
import { conversationsMapper, conversationMapper } from '../services/messageService/model/conversationDto';

module.exports = function messagesApi(app, options, prefix) {
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

  app.post(`${prefix}/conversations`, options.auth, (req, res) => {
    if (!req.user) {
      res.status(404).send();
      return;
    }

    const userIds = [ req.user.id, ...req.body.userIds];
    const isOneOnOne = req.body.isOneOnOne;
    messageService.createConversation(userIds, isOneOnOne)
      .then((result) => {
        if (typeof (result) === 'object') {
          res.status(200).json(result);
        } else {
          res.status(201).json({ conversationId: result });
        }
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  });

  app.get(`${prefix}/conversations`, options.auth, async (req, res) => {
    if (!req.user) {
      res.status(404).send();
    } else {
      try {
        const conversations = await messageService.getConversationsByUserId(req.user.id);
        const userIds = [...new Set(conversations.reduce((arr, c) => arr.concat(...c.participants), []))];
        const users = await userService.getUsers(userIds);

        res.status(200).json(conversationsMapper(users, conversations));
      } catch (error) {
        res.status(500).json(error);
      };
    }
  });

  app.get(`${prefix}/conversations/:conversationId`, options.auth, async (req, res) => {
    if (!req.user) {
      res.status(404).send();
    } else if (req.params.conversationId == null) {
      res.status(400).send();
    } else {
      try {
        const conversation = await messageService.getConversation(req.params.conversationId, req.user.id);
        const userIds = [...new Set(conversation.participants)];
        const users = await userService.getUsers(userIds);
        res.status(200).json(conversationMapper(users, conversation));
      } catch (error) {
        res.status(500).json(error);
      };
    }
  });

  app.get(`${prefix}/messages/:messageId`, options.auth, (req, res) => {
    if (!req.user) {
      res.status(404).send();
      return;
    }

    if (req.params.messageId == null) {
      res.status(400).send();
      return;
    }

    messageService.getMessage(req.params.messageId, req.user.id)
      .then((message) => {
        res.status(200).json(message);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  });

  app.get(`${prefix}/messages/:conversationId`, options.auth, (req, res) => {
    if (req.user == null) {
      res.status(404).send();
    } else if (req.params.conversationId == null) {
      res.status(400).send();
    } else {
      messageService.getMessages(req.user.id, req.params.conversationId, req.query.start, req.query.count)
        .then((messages) => {
          res.status(200).json(messages);
        })
        .catch((error) => {
          res.status(500).json(error);
        });
    }
  });

  app.post(`${prefix}/messages`, options.auth, (req, res) => {
    if (!req.user) {
      res.status(404).send();
      return;
    }

    if (req.body.content == null || req.body.conversationId == null) {
      res.status(400).send();
      return;
    }

    messageService.createMessage(req.body.conversationId, req.user.id, req.body.content)
      .then((messageId) => {
        res.status(201).json({ messageId });
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  });

  app.delete(`${prefix}/conversations/:conversationId`, options.auth, async (req, res) => {
    if (req.user == null) {
      res.status(404).send();
      return;
    } else if (req.params.conversationId == null) {
      res.status(400).send();
    }

    try {
      await messageService.deleteConversation(req.params.conversationId);
      res.status(204).send();
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  });
};
