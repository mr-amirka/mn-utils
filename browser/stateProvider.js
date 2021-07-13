const combine = require('../Emitter/combine');
const childClass = require('../childClass');

module.exports = (env) => {
  return childClass(env.Component, function(props) {
    let subscription;
    const self = this;
    const setState = self.setState.bind(self);
    const emitter = combine(props.state || {});
    const onChange = props.onChange;
    const {getValue} = emitter;
    self.state = getValue();
    self.UNSAFE_componentWillMount = () => {
      subscription || (subscription
        = emitter.on(setState), setState(getValue()));
    };
    self.componentWillUnmount = () => {
      subscription && (subscription(), subscription = 0);
    };
    self.render = () => self.props.render(self.state, change) || null;
    function change(state) {
      setState(state);
      onChange && onChange(state);
    }
  });
};
