const keys = require('./keys');
const wrapper = require('./wrapper');
const map = require('./map');
const escapeRegExp = require('./escapeRegExp');
const templateAggregate = require('./templateAggregate');

function parse(key) {
  return (scope) => scope[key];
}


module.exports = (template, expMap) => {
  const regexp = new RegExp('('
    + map(keys(expMap), escapeRegExp).join('|') + ')', 'gim');
  let start = 0, l = template.length, parts = []; // eslint-disable-line
  template.replace(regexp, (hystack, exp, offset) => {
    const nextLength = offset - start;
    nextLength && parts.push(wrapper(template.substr(start, nextLength)));
    exp && parts.push(parse(expMap[exp]));
    start = offset + hystack.length;
    return '';
  });
  start === l || parts.push(wrapper(template.substr(start, l - start)));
  return templateAggregate(parts);
};
