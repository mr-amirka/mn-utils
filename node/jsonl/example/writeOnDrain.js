const write = require('../write');

const writer = write(__dirname + '/output.jsonl');

writer.on('error', (error) => {
  console.error(error);
});

function finish() {
  console.log('Finish!');
  writer.end();
}
function onDrain() {
  let i = 20;
  let ok = true;
  let data;
  do {
    i--;
    data = {id: i, name: 'name' + i};
    if (i === 0) {
      writer.write(data, finish);
    } else {
      ok = writer.write(data);
    }
  } while (i > 0 && ok);
  if (i > 0) {
    writer.once('drain', onDrain);
  }
}
onDrain();
