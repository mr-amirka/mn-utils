
module.exports = (set) => {
  return (name) => {
    return (value) => {
      set({
        [name]: value,
      });
    };
  };
};
