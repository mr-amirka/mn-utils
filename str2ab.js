
module.exports = (str) => {
  str = str ? ('' + str) : '';
  const length = str.length;
  const buf = new ArrayBuffer(length * 2); // 2 bytes for each char
  const bufView = new Uint16Array(buf);
  let i = 0;
  for (; i < length; i++) bufView[i] = str.charCodeAt(i);
  return buf;
};
