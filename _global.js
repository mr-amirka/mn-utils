const support = require('./support');
module.exports = support('global')
  || support('window')
  || support('self')
  || support('this');
