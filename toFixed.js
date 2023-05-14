module.exports = (v, digit) => {
  const mult = Math.pow(10, digit);
  return (Math.ceil(parseFloat(v || 0) * mult) / mult).toFixed(digit);
};
