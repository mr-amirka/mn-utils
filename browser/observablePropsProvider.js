/**
 * @overview observablePropsProvider
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 * @example
const ObservableProps = observablePropsProvider({
  Component: React.Component,
  createElement: React.createElement,
});

function AnyComponent() {
  return (
    <ObservableProps
      component={SomeComponent}
      value={name$}
    />
  );
}
*/

const {
  combine,
  isObservable,
} = require('../Observable');
const childClassOfReact = require('../childClassOfReact');
const extend = require('../extend');
const without = require('../without');
const reduce = require('../reduce');


module.exports = (env) => {
  const {
    createElement,
  } = env;

  return childClassOfReact(env.Component, (self, props) => {
    let _subscription;
    const setState = self.setState.bind(self);
    const excludesProps = ['component'];
    const emitter = combine(reduce(props, (a, v, k) => {
      isObservable(v) && (
        a[k] = v,
        excludesProps.push(k)
      );
      return a;
    }, {}));
    const {
      getValue,
    } = emitter;
    self.state = getValue();
    self.UNSAFE_componentWillMount = () => {
      _subscription || (_subscription
        = emitter.on(setState), setState(getValue()));
    };
    self.componentWillUnmount = () => {
      _subscription && (_subscription(), _subscription = 0);
    };
    self.render = () => {
      const {
        props,
      } = self;
      return createElement(
        props.component,
        without(props, excludesProps, extend({}, self.state))
      );
    };
  });
};
