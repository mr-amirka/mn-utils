
module.exports = (handle) => {
  return (e) => {
    e.key == 'Enter' && handle();
  };
};
