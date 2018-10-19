const NodeRSA = require('node-rsa');
const fs = require('fs');

export const decrypt = () => {
  const file = fs.readFileSync('/var/keys/private.pem', 'utf8');

  // for some reason, I have better success copying the key in here as a plaintext string.
  // It doesn't work when you try and read the file.
  const key = new NodeRSA(file);

  const encrypted = fs.readFileSync(`${__dirname}/encrypted-production-config`, 'utf8');
  const decrypted = key.decrypt(encrypted, 'utf8');

  fs.openSync(`${__dirname}/production.js`, 'w');
  fs.writeFileSync(`${__dirname}/production.js`, decrypted, 'utf8');
};
