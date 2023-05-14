
const _read = require('../readUnopenedLimited')(__dirname + '/input.jsonl', {
  /*
  bufferLength: 1024 * 8,
  limit: 100,
  */

  bufferLength: 8,
  limit: 2,
});

function next(items) {
  console.log({
    items,
  });
  items.length && read();
}
function read() {
  _read().then(next, onError);
}
function onError(error) {
  console.error(error);
}

read();
