
module.exports = (v) => {
  return ('' + v)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/>/g, '&gt;')
      .replace(/'/g, '&#039;');
};
