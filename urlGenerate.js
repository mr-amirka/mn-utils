const space = '-';
const translite = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
  'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm',
  'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
  'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'sh', 'ы': 'y',
  'э': 'e', 'ю': 'yu', 'я': 'ya',
};
const regexpWord = /[A-Za-z]/;
const regexpSpace = /\-+/g;
const regexpTrim = /^\-*|\-*$/g;

module.exports = (input) => {
  input = input.toLowerCase();
  const length = input.length;
  let output = '', ch, i = 0; // eslint-disable-line
  for (; i < length; i++) {
    output += regexpWord.test(ch = input[i]) ? ch : (translite[ch] || space);
  }
  return output.replace(regexpSpace, space).replace(regexpTrim, '');
};
