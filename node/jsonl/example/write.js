const interval = require('../../../async/interval');
const delay = require('../../../delay');
const write = require('../write');

const writer = write(__dirname + '/output.jsonl');

let i = 0;
const cancel = interval(() => {
  i++;
  writer.write({id: i, name: 'name' + i});
}, 100);

const cancelEnd = delay(() => {
  cancel();
  writer.end();
}, 1200);

writer.on('error', (error) => {
  cancel();
  cancelEnd();
  console.error(error);
});
