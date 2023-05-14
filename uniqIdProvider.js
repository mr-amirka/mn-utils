
module.exports = (prefix, initialId) => {
  initialId || (initialId = 0);
  prefix || (prefix = '');
  return () => {
    const id = initialId;
    initialId++;
    return prefix + id;
  };
};
