const read = require('../promisify/read');

read(__dirname + '/input.jsonl', {}, (read) => {
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
