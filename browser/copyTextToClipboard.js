/**
 * Copy text to clipboard
 * @param {string} text
 * @example
 * ```js
 *  function SomeComponent({text}) {
 *    return (
 *      <div onClick={() => copyTextToClipboard(text)}>
 *        {text}
 *      </div>
 *    );
 *  }
 * ```
 */

module.exports = (text, win) => {
  win = win || window;
  const {navigator, document} = win;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).catch((err) => {
      console.error('copyTextToClipboard: Could not copy text: ', err);
    });
    return;
  }
  const textArea = document.createElement('textarea');
  const {style} = textArea;
  textArea.value = text;
  style.position = 'fixed';
  style.zIndex = '-1';
  style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('fallbackCopyTextToClipboard: unable to copy', err);
  }

  document.body.removeChild(textArea);
};
