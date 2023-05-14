const {
  combine,
} = require('../Observable');
const extend = require('../extend');
const isObjectLike = require('../isObjectLike');
const isArray = require('../isArray');
const isPromise = require('../isPromise');
const isFunction = require('../isFunction');
const forEach = require('../forEach');
const forIn = require('../forIn');
const reduce = require('../reduce');
const childClassOfReact = require('../childClassOfReact');
const trim = require('../trim');

const expressionsCache = {};

module.exports = (env) => {
  const {
    render,
    createElement,
  } = env;
  const WrapperComponent = childClassOfReact(env.Component, (self, props) => {
    let subscription;
    const setState = self.setState.bind(self);
    const {
      options$,
      destroy,
      render,
    } = props;
    const {
      getValue,
    } = options$;
    function setOptions(options) {
      setState({
        options,
      });
    }
    self.state = {
      options: getValue(),
    };
    self.UNSAFE_componentWillMount = () => {
      subscription || (
        destroy.add(subscription = options$.on(setOptions)),
        setOptions(getValue())
      );
    };
    self.render = () => render(self.state, setState);
  });
  return (attrName) => {
    attrName || (attrName = 'mn-widget');
    const widgets = {};
    const instance = recursiveNodeProvider((node, scope, destroy) => {
      const expression = node.getAttribute && node.getAttribute(attrName);
      if (!expression) return;
      node.removeAttribute(attrName);
      let widgetsInitOptions = tryExecute(expression, scope, function(ex) {
        console.error(ex);
      });
      if (!isObjectLike(widgetsInitOptions)) {
        console.warn(
            'Widget expression "' + expression + '" is not object',
            node, scope,
        );
        return true;
      }
      const attrs = getAttrs(node.attributes);
      const ctx = {
        node,
        scope,
        destroy,
        attrs,
        compile: instance,
      };
      function asyncExecute(options, init) {
        isPromise(options)
          ? options.then(init)
          : init(options);
      }
      isFunction(widgetsInitOptions)
        && (widgetsInitOptions = widgetsInitOptions.call(ctx, ctx));

      forEach(
        isArray(widgetsInitOptions)
          ? widgetsInitOptions
          : [widgetsInitOptions],
        (widgetsInitOptions) => {
          asyncExecute(widgetsInitOptions, function(widgetsInitOptions) {
            forIn(widgetsInitOptions, function(options, widgetName) {
              const widget = widgets[widgetName];
              if (!widget) {
                console.warn('Widget "' + widgetName + '" is undefined');
                return;
              }
              asyncExecute(options, function(options) {
                const self = extend({}, ctx);
                self.options$ = combine(options);
                try {
                  widget.call(self, self);
                } catch (ex) {
                  console.error('compile error: ', ex);
                  console.error('options: ', options);
                  console.error('node: ', node);
                }
              });
            });
          });
        },
      );
      return true;
    });
    function set(directiveName, handler) {
      widgets[directiveName] = function() {
        this.name = directiveName;
        return handler.apply(this, arguments); // eslint-disable-line
      };
      return instance;
    }

    function adaptWithMeta(name, componentRender) {
      set(name, function(ctx) {
        const {node, options$, scope, destroy, attrs} = ctx;
        const childNodes = reduce(node.childNodes, itetateeNodePush, []);
        const children = createElement('div', {
          ref: (ref) => {
            let // eslint-disable-line
              el,
              childs = ref.childNodes, // eslint-disable-line
              i = childs.length - 1,
              l = childNodes.length; // eslint-disable-line
            for (;i > -1; i--) ref.removeChild(childs[i]);
            for (i = 0; i < l; i++) {
              ref.appendChild(el = childNodes[i]);
              instance(el, scope, destroy);
            }
          },
        });
        render(createElement(WrapperComponent, {
          destroy,
          options$,
          render: (state, setState) => {
            return componentRender({
              attrs,
              node,
              scope,
              state,
              setState,
              compile: instance,
              children,
            });
          },
        }), node);
      });
      return instance;
    }
    instance.set = set;
    instance.adaptWithMeta = adaptWithMeta;
    instance.adapt = (name, ReactComponent) => {
      adaptWithMeta(name, (props) => {
        return createElement(ReactComponent, {
          ...props.state.options || {},
          children: props.children,
        });
      });
      return instance;
    };
    return instance;
  };
};

function itetateeNodePush(output, el) {
  const {nodeType} = el;
  nodeType == 1
    ? output.push(el)
    : nodeType === 3 && trim(el.textContent) && output.push(el);
  return output;
}
function tryExecute(expression, scope, onError) {
  try {
    return expression && (
      isFunction(expression)
        ? expression
        : (expressionsCache[expression]
          || (expressionsCache[expression]
            = new Function('scope', 'return ' + expression)))
    ).call(scope, scope);
  } catch (ex) {
    onError && onError(ex);
  }
  return null;
}
function recursiveNodeProvider(handler) {
  function recursiveCheckNode(node, scope, destroy) {
    handler(node, scope, destroy) || checkChild(node, scope, destroy);
  }
  function checkChild(node, scope, destroy) {
    let i = 0, nodes = node.childNodes, l = nodes.length; // eslint-disable-line
    for (; i < l; i++) recursiveCheckNode(nodes[i], scope, destroy);
  };
  recursiveCheckNode.child = checkChild;
  return recursiveCheckNode;
}
function getAttrsIteratee(props, attrNode) {
  props[attrNode.nodeName] = attrNode.nodeValue;
  return props;
}
function getAttrs(attrs, output) {
  return reduce(attrs, getAttrsIteratee, output || {});
}
