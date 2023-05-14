const joinSpace = require('../joinSpace');
const forEach = require('../forEach');
const addOf = require('../addOf');
const toLower = require('../toLower');

const AGENTS = [
  'linux', 'mozilla', 'firefox', 'opera', 'trident', 'edge',
  'chrome', 'ubuntu', 'chromium', 'safari', 'msie', 'webkit', 'applewebkit',
  'mobile', 'ie', 'webtv', 'konqueror', 'blackberry', 'android', 'iron',
  'iphone', 'ipod', 'ipad', 'mac', 'darwin', 'windows', 'freebsd',
];

module.exports = (userAgent, output) => {
  userAgent = toLower(userAgent);
  output = output || [];
  forEach(AGENTS, (userAgentName, name, version, matchs) => {
    matchs = (new RegExp('(' + userAgentName + ')([/ ]([0-9_x]+))?', 'g'))
        .exec(userAgent);
    matchs && (
      addOf(output, name = matchs[1].replace(' ', '_')),
      (version = matchs[3]) && addOf(output, name + '-' + version)
    );
  });
  return joinSpace(output);
};
