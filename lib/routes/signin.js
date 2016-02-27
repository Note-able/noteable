module.exports = {
  path: 'signin',

  getComponent: (location, callback) => {
    require.ensure([], require => {
      callback(null, require('../shared/components/signin-controller'));
    });
  }
};