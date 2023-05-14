const regexpMapperProvider = require('./regexpMapperProvider');
const pushArray = require('./pushArray');

const regexp = /(\()|(\))?:([_A-Za-z0-9.]+)|(\))/g;

function base(route, keys) {
  pushArray(keys, ['all']);
  const levels = [keys]; // eslint-disable-line
  let index = 0, depth = 0, lastDepth = 0; // eslint-disable-line
  // eslint-disable-next-line
  const prematcher = route.replace(regexp, (haystack, start, hasKey, key, end) => {
    if (start) {
      depth++;
      return '(';
    }
    depth--;
    let level = levels[depth] || (levels[depth] = []); // eslint-disable-line
    pushArray(level, [end ? index++ : key]);
    if (depth < lastDepth) {
      pushArray(level, levels[lastDepth]);
      levels[lastDepth] = [];
    }
    lastDepth = depth;
    return hasKey || end ? ')' : '([^/]*))';
  });
  return new RegExp(prematcher);
}

function routeParseProvider(route) {
  const keys = [];
  return regexpMapperProvider(base(route, keys), keys);
}

routeParseProvider.base = base;
module.exports = routeParseProvider;
