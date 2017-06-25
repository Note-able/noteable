import { decrypt } from './decrypt';
const fs = require('fs');

const env = process.env.NODE_ENV || 'local';

if (env === 'production' && !fs.existsSync('./production.js')) {
  decrypt();
}

const config = require(`./${env}.js`);

module.exports = config;
