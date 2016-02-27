require.ensure = require('node-ensure');

module.exports = {
  path: 'editor',

  /**getChildRoutes(location, callback) {
    require.ensure([], (require) => {
      callback(null, [
        require('./routes/Announcements'),
        require('./routes/Assignments'),
        require('./routes/Grades')
      ]);
    });
  },**/

  getComponent: (location, callback) => {
    require.ensure([], () => {
      callback(null, require('../shared/components/editor-controller'));
    });
  }
}
