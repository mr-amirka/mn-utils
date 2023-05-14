/**
 * @overview InViewportProvider
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 * @example
 * const InViewport = InViewportProvider({
 *   Component: Component,
 *   createElement: createElement,
 * });
*/

const without = require('../without');
const childClassOfReact = require('../childClassOfReact');
const {
  combine,
} = require('../Observable');
const getViewportSize = require('./getViewportSize');

const withoutProps = ['component', 'ref', 'render', 'state'];

module.exports = (env) => {
  const {
    createElement,
  } = env;
  return childClassOfReact(env.Component, (self, props) => {
    const setState = self.setState.bind(self);
    const emitter = combine(props.state || {});
    const {
      getValue,
    } = emitter;
    let _ref;
    let _subscription;
    let _show = false;

    function check() {
      const rect = _ref && _ref.getBoundingClientRect();
      const show
        = !(!rect || rect.bottom < 0 || rect.top > getViewportSize()[1]);
      show === _show || (_show = show, setState({}));
    }

    function handleRef(ref) {
      ref && ref !== _ref && (_ref = ref, check());
    }
    self.state = getValue();
    self.render = () => {
      const {props} = self;
      const {ref} = props;
      return createElement(
          props.component || 'div',
          without(props, withoutProps, {
            ref: ref ? (_ref) => {
              handleRef(_ref);
              ref(_ref);
            } : handleRef,
          }),
          _show ? props.render(self.state) : null,
      );
    };
    self.UNSAFE_componentWillMount = () => {
      _subscription || (
        _subscription = emitter.on(check),
        check()
      );
    };
    self.componentWillUnmount = (w) => {
      _subscription && (
        _subscription(),
        _subscription = 0
      );
    };
  });
};
