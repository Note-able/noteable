import { messageMapper } from "./model/conversationDto";
import FirebaseService from "../firebaseService";

export default class MessageService {
  constructor(options) {
    this.options = options;
    this.firebaseService = new FirebaseService({ databaseOptions: options });
  }

  createConversation(userIds, isOneOnOne) {
    return new Promise(async (resolve, reject) => {
      if (userIds == null || userIds.length === 0) {
        reject("Cannot have empty userIds");
        return;
      } else if (userIds.length > 2 && isOneOnOne) {
        reject("Cannot have more than 2 participants in 1 on 1 conversation");
        return;
      }

      if (
        isOneOnOne &&
        (await this.checkIfConversationExists(userIds[0], userIds[1]))
      ) {
        reject(
          `A conversation already exists between ${userIds[0]} and ${
            userIds[1]
          }`
        );
        return;
      }

      try {
        const connection = await this.options.connectToMysqlDb(
          this.options.mysqlParameters
        );

        await connection.beginTransaction();

        const [rows] = await connection.query(
          "INSERT INTO conversations (is_one_on_one) VALUES(:isOneOnOne);",
          { isOneOnOne: !!isOneOnOne }
        );
        const conversationId = rows.insertId;

        userIds.forEach(userId => {
          connection.execute(
            "INSERT INTO conversation_participants (conversation_id, user_id) VALUES (:conversationId, :userId);",
            { conversationId, userId }
          );
        });

        await connection.commit();
        resolve(conversationId);
      } catch (error) {
        reject(error);
      }
    });
  }

  getConversationsByUserId(userId) {
    return new Promise(async (resolve, reject) => {
      if (userId == null) {
        reject("Empty userId");
        return;
      }
      try {
        const connection = await this.options.connectToMysqlDb(
          this.options.mysqlParameters
        );

        const [conversationIds] = await connection.query(
          `SELECT c.id FROM conversations c
            INNER JOIN conversation_participants p
            ON c.id = p.conversation_id
          WHERE p.user_id = :userId;`,
          { userId }
        );

        const conversations = await Promise.all(
          conversationIds.map(async ({ id }) => {
            const [participants] = await connection.query(
              "SELECT user_id FROM conversation_participants WHERE conversation_id = :conversationId;",
              { conversationId: id }
            );

            const [rows] = await connection.query(
              "SELECT * FROM messages WHERE conversation_id = :conversationId ORDER BY time_stamp DESC LIMIT 1;",
              { conversationId: id }
            );
            const lastMessage = rows[0];

            return {
              conversationId: id,
              lastMessage: lastMessage ? messageMapper(lastMessage) : null,
              participants: participants.map(p => p.user_id)
            };
          })
        );

        resolve(conversations);
      } catch (error) {
        reject(error);
      }
    });
  }

  getConversation(conversationId, userId) {
    return new Promise(async (resolve, reject) => {
      if (conversationId == null) {
        reject("Empty conversation or user id.");
        return;
      }

      try {
        const connection = await this.options.connectToMysqlDb(
          this.options.mysqlParameters
        );

        const [rows] = await connection.query(
          `SELECT c.id, c.is_deleted FROM conversations c
            INNER JOIN conversation_participants p
            ON c.id = p.conversation_id
          WHERE p.user_id = :userId AND c.id = :conversationId;`,
          { userId, conversationId }
        );
        const conversation = rows[0];

        if (!conversation) {
          resolve(null);
        }

        const [participants] = await connection.query(
          "SELECT user_id FROM conversation_participants WHERE conversation_id = :conversationId;",
          { conversationId }
        );

        const [messages] = await connection.query(
          "SELECT * FROM messages WHERE conversation_id = :conversationId AND is_deleted = FALSE ORDER BY time_stamp DESC LIMIT 50;",
          { conversationId }
        );

        resolve({
          conversationId,
          messages: messages.map(messageMapper),
          participants: participants.map(p => p.user_id),
          isDeleted: conversation.is_deleted
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  checkIfConversationExists(userId, otherUserId) {
    return new Promise(async (resolve, reject) => {
      if (userId == null || otherUserId == null) {
        reject("Empty user id.");
        return;
      }

      try {
        const connection = await this.options.connectToMysqlDb(
          this.options.mysqlParameters
        );

        const [rows] = await connection.query(
          `SELECT c.id FROM conversations c
            INNER JOIN conversation_participants p1
            ON c.id = p1.conversation_id
            INNER JOIN conversation_participants p2
            ON c.id = p2.conversation_id AND p2.user_id != p1.user_id
          WHERE p1.user_id = :userId AND p2.user_id = :otherUserId AND is_one_on_one = TRUE;`,
          { userId, otherUserId }
        );
        const conversationId = rows[0];

        resolve(!!conversationId);
      } catch (error) {
        reject(error);
      }
    });
  }

  getMessage(messageId, userId) {
    return new Promise(async (resolve, reject) => {
      if (messageId == null) {
        reject("Empty message or user id.");
        return;
      }

      try {
        const connection = await this.options.connectToMysqlDb(
          this.options.mysqlParameters
        );

        const [rows] = await connection.query(
          "SELECT * FROM messages WHERE user_id = :userId AND id = :messageId AND is_deleted = FALSE LIMIT 1;",
          { userId, messageId }
        );
        const message = rows[0];

        resolve(messageMapper(message));
      } catch (error) {
        reject(error);
      }
    });
  }

  getMessages(userId, conversationId, offset, limit) {
    return new Promise(async (resolve, reject) => {
      if (userId == null || conversationId == null) {
        reject("Empty userId or conversationId");
      } else {
        try {
          const connection = await this.options.connectToMysqlDb(
            this.options.mysqlParameters
          );
          if (connection.client == null) {
            reject("Failed to connect to database.");
            return;
          }

          const [messages] = await connection.query(
            "SELECT * FROM messages WHERE conversation_id = :conversationId AND is_deleted = FALSE  LIMIT :limit OFFSET :offset;",
            { conversationId, offset: offset || 0, limit: limit || 50 }
          );

          resolve(messages.map(messageMapper));
        } catch (error) {
          reject(error);
        }
      }
    });
  }

  createMessage(conversationId, userId, content) {
    return new Promise(async (resolve, reject) => {
      if (conversationId == null || userId == null) {
        reject("Empty conversation or user id.");
        return;
      }

      try {
        const connection = await this.options.connectToMysqlDb(
          this.options.mysqlParameters
        );
        const [rows] = await connection.query(
          `INSERT INTO messages (content, user_id, time_stamp, conversation_id) 
          VALUES (:content, :userId, UTC_TIMESTAMP(), :conversationId);`,
          { conversationId, content, userId }
        );

        resolve(rows.insertId);
        this.firebaseService.sendMessage(content, userId, conversationId);
      } catch (error) {
        reject(error);
      }
    });
  }

  deleteMessage(messageId) {
    return new Promise(async (resolve, reject) => {
      if (messageId == null) {
        reject("Empty messageId.");
        return;
      }

      try {
        const connection = await this.options.connectToMysqlDb(
          this.options.mysqlParameters
        );
        await connection.execute(
          "UPDATE messages SET is_deleted = TRUE WHERE id = :messageId;",
          { messageId }
        );

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  deleteConversation(conversationId) {
    return new Promise(async (resolve, reject) => {
      if (conversationId == null) {
        reject("Empty conversationId.");
        return;
      }

      try {
        const connection = await this.options.connectToMysqlDb(
          this.options.mysqlParameters
        );
        await connection.execute(
          "UPDATE conversations SET is_deleted = TRUE WHERE id = :conversationId;",
          { conversationId }
        );

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
}
