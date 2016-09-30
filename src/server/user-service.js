export default class UserService {
  constructor(options) {
    this.options = options;
  }

  getUser(userId, callback) {
    this.options.connect(this.options.database, (connection) => {
      const user = [];
      connection.client.query(`
        SELECT * FROM public.profile pr
        WHERE ${userId} = pr.id;`)
      .on('row', (row) => { user.push(row); })
      .on('error', (error) => {
        console.log(`error encountered ${error}`);
      })
      .on('end', () => {
        if (user.length === 0) {
          return;
        }

        // user[0].profileImage = image.getPublicUrl(user[0].filename);
        connection.fin();
        callback(user[0]);
      });
    });
  }
}
