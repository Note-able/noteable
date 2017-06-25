const NodeRSA = require('node-rsa');
const fs = require('fs');

export const decrypt = () => {
  const file = fs.readFileSync('/var/keys/private.pem', 'utf8');
  const key = new NodeRSA();
  key.importKey(file, 'pkcs1-pem');

  const encrypted = fs.readFileSync(__dirname + '/encrypted-production-config', 'utf8');
  const decrypted = key.decrypt(encrypted, 'utf8');

  fs.openSync(__dirname + '/production.js', 'w');
  fs.writeFileSync(__dirname + '/production.js', decrypted, 'utf8');
};
