module.exports = (v) => {
  try {
    return JSON.parse(v);
  } catch (ex) {}
  return null;
};
