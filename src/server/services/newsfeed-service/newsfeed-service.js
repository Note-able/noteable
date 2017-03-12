import { DbNewsfeedHelper, DbMetadataHelper } from './model/newsfeedDto.js';
const Newsfeed = DbNewsfeedHelper();
const Metadata = DbMetadataHelper();

/*
    newsfeedDto {
      createdDate,
      modifiedDate,
      isDeleted,
      kind,
      id,
      text,
      authorId,
      recipientId,
      contentMetadata {
        id,
        url,
        musicId,
        eventId,
        createdDate
      }
    }
  */

/**
 * constructor(options) {
    this.options = options;
  }

  createNewsfeedItem({ createdDate, kind, isDeleted, authorId, sourceId, contentMetadata, text, modifiedDate })
  updateNotification({ createdDate, kind, isDeleted, recipientId, sourceId })
  getNotification(id)
  getNotifications(ids, limit, notificationId)
  getNotificationsByUser(userId, limit, notificationId)
  deleteNotification(id)
 */

export default class NewsfeedService {
  constructor(options) {
    this.options = options;
  }

  createMetadataItem(metadataDto) {
    return new Promise((resolve, reject) => {
      if (!DbMetadataHelper.validateMetadata(metadataDto)) {
        return reject('Invalid dto', metadataDto);
      }

      let id;
      this.options.connect(this.options.database, (connection) => {
        connection.client.query(
          `INSERT INTO ${Metadata.columns('', 'INSERT')}
            VALUES ${Metadata.values('', metadataDto, 'INSERT')} RETURNING id;`
        ).on('row', row => id = row)
        .on('error', error => reject(error))
        .on('end', () => resolve(id));
      });
    });
  }

  createNewsfeedItem(newsfeedDto) {
    return new Promise((resolve, reject) => {
      if (!DbNewsfeedHelper.validateNewsItem(newsfeedDto)) {
        return reject('Invalid dto', newsfeedDto);
      }

      if (newsfeedDto.createdDate == null) {
        newsfeedDto.createdDate = Date.now();
      }

      this.createMetadataItem(newsfeedDto.contentMetadata)
        .then(metadataId => {
          let id;
          newsfeedDto.contentMetadataId = metadataId;
          this.options.connect(this.options.database, (connection) => {
            connection.client.query(
              `INSERT INTO ${Newsfeed.columns('', 'INSERT')} VALUES ${values('', newsfeedDto, 'INSERT')} RETURNING id;`
            ).on('row', row => id = row)
            .on('error', error => reject(error))
            .on('end', () => resolve(id));
          });
        })
        .catch(error => {
          return reject(error);
        });
    });
  }
}
