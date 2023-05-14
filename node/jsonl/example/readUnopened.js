const readUnopenedLimited = require('../readUnopenedLimited');

readUnopenedLimited(__dirname + '/input.jsonl', {
  bufferLength: 1024 * 8,
}, (read) => {
  let data;
  while (data = read()) {
    console.log('line:', data);
  }
}).finally((error, response) => {
  console.log('finally', {
    error,
    response,
  });
});
