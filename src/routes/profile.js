module.exports = {
  path: 'profile',

  getComponent: (location, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../shared/components/profile/profile'));
    });
  }
}
