const __includes = [].includes;

module.exports = __includes
  ? ((self, v) => __includes.call(self, v))
  : ((self, v) => {
    let i = self && self.length || 0; // eslint-disable-line
    while (i > 0) {
      if (self[--i] === v) return 1;
    }
    return 0;
  });
