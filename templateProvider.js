const getBase = require('./get').base;
const push = require('./push');
const wrapper = require('./wrapper');
const templateAggregate = require('./templateAggregate');
const REGEXP = /\{\{((?:(?:"[^"]*")|(?:'[^']*')|(?:`[^`]*`)|(?:\{\{.*?\}\})|(?:[^}]*?))*?)\}\}/g; // eslint-disable-line

function defaultParse(expression) {
  const paths = expression.split('.');
  return (scope) => getBase(scope, paths);
}

module.exports = (template, parse, regexp) => {
  parse = parse || defaultParse;
  let start = 0, l = template.length, parts = []; // eslint-disable-line
  template.replace(regexp || REGEXP, (hystack, exp, offset) => {
    const nextLength = offset - start;
    nextLength && push(parts, wrapper(template.substr(start, nextLength)));
    exp && push(parts, parse(exp));
    start = offset + hystack.length;
    return '';
  });
  start === l || push(parts, wrapper(template.substr(start, l - start)));
  return templateAggregate(parts);
};
