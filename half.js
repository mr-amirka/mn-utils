const half = module.exports = halfProvider(''.indexOf);
half.last = halfProvider(''.lastIndexOf);
half.provider = halfProvider;

function halfProvider(indexOf) {
  return (input, separator, right) => {
    const i = indexOf.call(input, separator);
    return i < 0
      ? (right ? ['', input, ''] : [input, '', ''])
      : [input.substr(0, i), input.substr(i + separator.length), separator];
  };
}
