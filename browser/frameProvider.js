/**
 * @overview FrameProvider
 * @author Amir Absalyamov <mr.amirka@ya.ru>
 * @example

 const React = require('react');
 const Frame = require('mn-utils/browser/FrameProvider')({
   createElement: React.createElement,
   Component: React.Component,
   createPortal: require('react-dom').createPortal,
 });

function App(props) {
  return (
    <Frame>
      <div>
        Widget
      </div>
    </Frame>
  );
}
*/

const childClassOfReact = require('../childClassOfReact');
const extend = require('../extend');
const invoke = require('../invoke');

// eslint-disable-next-line
const INITIAL_CONTENT = '<!DOCTYPE html><html><head></head><body><div class="frame-root"></div></body></html>';

module.exports = (env) => {
  const {
    createElement,
    createPortal,
  } = env;
  return childClassOfReact(env.Component, (self) => {
    let _nodeFrame;
    let _nodeDoc;
    let _nodeHead;
    let _nodeBody;
    let _nodeContent;
    let _win;
    let _hasMounted;
    let _hasEnv;
    let _onUnmount;

    function handleLoad() {
      _hasEnv || _hasMounted && (
        _hasEnv = 1,
        _nodeContent = (_nodeBody.children || _nodeBody.childNodes)[0],
        _onUnmount = invoke(self.props, 'onMount', [
          _win, _nodeDoc, _nodeHead, _nodeBody,
        ]),
        self.forceUpdate()
      );
    }

    function handleRef(node) {
      node && node !== _nodeFrame && (
        _nodeFrame = node,
        _nodeFrame.onload = handleLoad,
        _win = _nodeFrame.contentWindow,
        _nodeDoc = _win.document,
        _nodeBody = _nodeDoc.body,
        (_nodeBody.children || _nodeBody.childNodes).length < 1 && (
          _nodeDoc.open('text/html', 'replace'),
          _nodeDoc.write(INITIAL_CONTENT),
          _nodeDoc.close()
        ),
        _nodeHead = _nodeDoc.head,
        _nodeBody = _nodeDoc.body,
        _nodeDoc.readyState === 'complete' && handleLoad()
      );
    }
    self.render = () => {
      const props = extend({}, self.props);
      const render = props.render;
      const children = _nodeContent && _nodeHead ? [
        // createPortal(null, _nodeHead),
        createPortal(
          render
            ? render(_win, _nodeDoc, _nodeHead, _nodeBody)
            : props.children,
          _nodeContent,
        ),
      ] : null;

      props.ref = handleRef;
      delete props.render;
      delete props.onMount;
      delete props.children;
      return createElement('iframe', props, children);
    };
    self.UNSAFE_componentWillMount = () => {
      _hasMounted = 1;
    };
    self.componentWillUnmount = () => {
      _hasMounted = _hasEnv = _nodeFrame
        = _nodeDoc = _nodeHead = _nodeBody = _nodeContent = 0;
      _onUnmount && (_onUnmount(), _onUnmount = 0);
    };
  });
};
