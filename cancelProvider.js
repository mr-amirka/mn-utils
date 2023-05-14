
module.exports = (clearFn, id) => {
  return () => {
    clearFn(id);
  };
};
