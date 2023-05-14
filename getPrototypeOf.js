
module.exports = (v) => {
  return Object.getPrototypeOf ? Object.getPrototypeOf(v) : false;
};
