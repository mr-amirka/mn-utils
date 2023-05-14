const Observable = require('mn-utils/Observable');
const __values = require('mn-utils/values');
const extend = require('mn-utils/extend');

function priotitySort(a, b) {
  return a.priotity - b.priotity;
}
function iterateeMap(cssMap) {
  return __values(cssMap).sort(priotitySort);
}

module.exports = function(StylesContext, noRoot) {
  const cssMap$ = new Observable({});
  const {emit, getValue} = cssMap$;
  const Renderer = StylesContext._currentValue.jss.options.Renderer;
  const proto = Renderer.prototype;
  const deployOrigin = proto.deploy;
  let _revision = 0;
  proto.deploy = function() {
    const cssMap = extend({}, getValue());
    const sheet = this.sheet;
    const options = sheet.options;
    const name = options.name;
    cssMap[name] = {
      name: name,
      priotity: options.index || 0,
      content: '\n' + sheet.toString() + '\n',
      revision: ++_revision,
    };
    emit(cssMap);
    noRoot || deployOrigin.apply(this, arguments); // eslint-disable-line
  };
  return cssMap$.map(iterateeMap);
};
