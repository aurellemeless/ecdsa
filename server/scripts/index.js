const secp = require('ethereum-cryptography/secp256k1');
const { toHex } = require('ethereum-cryptography/utils');
const privateKey = toHex(secp.secp256k1.utils.randomPrivateKey());
const publicKey = toHex(secp.secp256k1.getPublicKey(privateKey));

console.log('privateKey', privateKey);
console.log('publicKey', publicKey);
