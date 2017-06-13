const env = process.env.NODE_ENV || 'local';
const config = require(`./${env}.js`);

module.exports = config;
