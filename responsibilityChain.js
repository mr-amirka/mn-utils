module.exports = (chain, req, end) => {
  function next(_req, i) {
    const handler = chain[i], ni = i + 1; // eslint-disable-line
    if (!handler) return end(_req);
    try {
      return handler(_req, (req) => next(req || _req, ni));
    } catch (ex) {
      console.error(ex);
      return next(_req, ni);
    }
  }
  return next(req, 0);
};
