const NodeRSA = require('node-rsa');
const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2));

// you can copy the current private.pem file in here OR generate a new pair.
const test = new NodeRSA();
// const pubKey = test.exportKey('pkcs8-public-pem');
// const pvKey = test.exportKey('pkcs1-pem');

// fs.openSync('./public.pem', 'w');
// fs.writeFileSync('./public.pem', pubKey, 'utf8');
// fs.openSync('./private.pem', 'w');
// fs.writeFileSync('./private.pem', pvKey, 'utf8');

const file = fs.readFileSync(`${__dirname}/production.js`, 'utf8');
// const key = new NodeRSA().generateKeyPair();
// const publicKey = key.exportKey('pkcs8-public-pem');
// const privateKey = key.exportKey('pkcs1-pem');

// fs.openSync('keys/public.pem', 'w');
// fs.writeFileSync('keys/public.pem', publicKey, 'utf8');
// fs.openSync('keys/private.pem', 'w');
// fs.writeFileSync('keys/private.pem', privateKey, 'utf8');

// const pub = fs.readFileSync('keys/public.pem', 'utf8');
// const private = fs.readFileSync('keys/private.pem', 'utf8');
// const publicKey = key.importKey(pub, 'pkcs8-public-pem');
// const privateKey = key.importKey(private, 'pkcs1-pem');


const encrypted = test.encrypt(file, 'base64');

fs.openSync(`${__dirname}/encrypted-production-config`, 'w');
fs.writeFileSync(`${__dirname}/encrypted-production-config`, encrypted, 'utf8');
