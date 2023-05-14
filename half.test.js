const half = require('./half');

describe('half', () => {
  test('it should divides the string in half using a separator', () => {
    expect(half('/home#team', '#')).toEqual(['/home', 'team', '#']);
    expect(half('/home#team#contacts', '#'))
        .toEqual(['/home', 'team#contacts', '#']);
    expect(half('/home', '#')).toEqual(['/home', '', '']);
    expect(half('/home', '#', true)).toEqual(['', '/home', '']);
    expect(half('/home#', '#')).toEqual(['/home', '', '#']);
    expect(half('/home#', '#', true)).toEqual(['/home', '', '#']);
    expect(half('#team', '#')).toEqual(['', 'team', '#']);
    expect(half('#team', '#', true)).toEqual(['', 'team', '#']);
    expect(half('/home?team#contacts', '?'))
        .toEqual(['/home', 'team#contacts', '?']);
  });

  // eslint-disable-next-line
  test('it should divides the string in half using last searched separator', () => {
    expect(half.last('/home#team', '#')).toEqual(['/home', 'team', '#']);
    expect(half.last('/home#team#contacts', '#'))
        .toEqual(['/home#team', 'contacts', '#']);
    expect(half.last('/home', '#')).toEqual(['/home', '', '']);
    expect(half.last('/home', '#', true)).toEqual(['', '/home', '']);
    expect(half.last('/home#', '#')).toEqual(['/home', '', '#']);
    expect(half.last('/home#', '#', true)).toEqual(['/home', '', '#']);
    expect(half.last('#team', '#')).toEqual(['', 'team', '#']);
    expect(half.last('#team', '#', true)).toEqual(['', 'team', '#']);
    expect(half.last('/home?team#contacts', '?'))
        .toEqual(['/home', 'team#contacts', '?']);
  });
});
