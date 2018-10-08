import { google } from 'googleapis';
import fetch from 'node-fetch';
import config from '../../../config';

const firebaseConfig = config.firebase;

export default class FirebaseService {
  constructor({ databaseOptions }) {
    this.firebaseHeaders = {
      'Content-type': 'application/json',
    };
    this.databaseOptions = databaseOptions;
    // this.firebaseKey = require('./service-account.json');
  }

  async registerDeviceForUser(userId, deviceToken) {
    try {
      const connection = await this.databaseOptions.connectToMysqlDb(this.databaseOptions.mysqlParameters);

      await connection.query(
        'INSERT INTO user_firebase_device_tokens (user_id, device_id) VALUES (:userId, :deviceToken);',
        { userId, deviceToken },
      );

      return;
    } catch (error) {
      console.log(error);
    }
  }

  async getDeviceTokensForConversation(conversationId) {
    try {
      const connection = await this.databaseOptions.connectToMysqlDb(this.databaseOptions.mysqlParameters);

      const [userRows] = await connection.query(
        `SELECT p.user_id as userId FROM conversations c
          INNER JOIN conversation_participants p
          ON c.id = p.conversation_id
        WHERE c.id = :conversationId;`,
        { conversationId },
      );
      const userIds = userRows.map(x => x.userId);

      const [deviceRows] = await connection.query(
        'SELECT device_id as deviceId FROM user_firebase_device_tokens WHERE user_id IN (:userIds)',
        { userIds },
      );

      return deviceRows.map(x => x.deviceId);
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async sendMessage(content, userId, conversationId) {
    const accessToken = await getAccessToken(this.firebaseKey);
    const deviceTokens = await this.getDeviceTokensForConversation(conversationId);

    const message = {
      data: {
        content,
        userId: `${userId}`,
        conversationId: `${conversationId}`,
      },
      notification: {
        title: 'Noteable',
        body: content.substring(0, 100),
      },
      android: {
        collapse_key: `${conversationId}`,
        priority: 'normal',
      },
      apns: {
        headers: {
          'apns-collapse-id': `${conversationId}`,
        },
      },
    };

    deviceTokens.forEach((token) => {
      fetch(`${firebaseConfig.url}/${firebaseConfig.projectId}/messages:send`, {
        method: 'POST',
        body: JSON.stringify({ message: { ...message, token } }),
        headers: { ...this.firebaseHeaders, Authorization: `Bearer ${accessToken}` },
      });
    });
  }
}

function getAccessToken(key) {
  return new Promise((resolve, reject) => {
    const jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      'https://www.googleapis.com/auth/firebase.messaging https://www.googleapis.com/auth/firebase.database https://www.googleapis.com/auth/userinfo.email',
      null,
    );
    jwtClient.authorize((err, tokens) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(tokens.access_token);
    });
  });
}
