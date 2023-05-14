const jsonParse = require('./json/parse');


module.exports = (s) => {
  try {
    return jsonParse(s);
  } catch (e) {}
  return s;
};
