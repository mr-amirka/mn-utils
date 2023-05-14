const crypto = require('crypto');

const algorithm = 'aes-192-cbc';
const defaltSalt = 'salt';

const encrypt = (input, password, salt) => {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt || defaltSalt, 24, (err, key) => {
      if (err) return reject(err);
      const iv = Buffer.alloc(16, 0);
      const cipher = crypto.createCipheriv(algorithm, key, iv);

      const output = [];
      cipher.on('readable', () => {
        let chunk;
        while (null !== (chunk = cipher.read())) {
          output.push(chunk.toString('hex'));
        }
      });
      cipher.on('end', () => {
        resolve(output.join(''));
      });
      cipher.write(input);
      cipher.end();
    });

  });
};

const regexp = /^[0-9a-f]*$/;
const decrypt = (input, password, salt) => {
  return new Promise((resolve, reject) => {
    if (input.length % 2 > 0 || !regexp.test(input)) return reject('unexpected tokens');
    crypto.scrypt(password, salt || defaltSalt, 24, (err, key) => {
      if (err) return reject(err);
      const iv = Buffer.alloc(16, 0);
      const decipher = crypto.createDecipheriv(algorithm, key, iv);

      const output = [];
      decipher.on('readable', () => {
        let chunk;
        while (null !== (chunk = decipher.read())) {
          output.push(chunk.toString('utf8'));
        }
      });
      decipher.on('end', () => {
        resolve(output.join(''));
      });
      decipher.on('error', reject);
      try {
        decipher.write(input, 'hex');
      } catch (ex) {
        reject(ex);
      }
      decipher.end();
    });
  });
};

module.exports = {
  encrypt,
  decrypt
};
