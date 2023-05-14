const kebabToCamelCase = require('./kebabToCamelCase');
const isArray = require('./isArray');
const includes = require('./includes');
const splitProvider = require('./splitProvider');

const splitLine = splitProvider(/\s*;\s*/);
const splitProp = splitProvider(/\s*:\s*/);
const reTrim = /^[\r\n {}]+|[\r\n {}]+$/g;

module.exports = (text, output) => {
  output = output || {};
  // eslint-disable-next-line
  let input = splitLine(text.replace(reTrim, '')), line, name, value, vls, i = input.length;
  // eslint-disable-next-line
  for (; i--;) (name = (line = splitProp(input[i]))[0])
    && (value = line[1])
    && (
      (vls = output[name = kebabToCamelCase(name)])
        ? (isArray(vls) ? vls : includes(vls = [vls], value) || vls.push(value))
        : (output[name] = [value])
    );
  return output;
};
