const Observable = require('./index');


describe('Observable', () => {
  test('it should emit', async () => {
    const promise = new Promise((resolve) => {
      const currentFolder$ = new Observable('');
      const sortType$ = new Observable('all');
      const sortingParams$ = new Observable({});
      const imagesParams$ = Observable
          .combine([
            currentFolder$,
            sortType$,
            sortingParams$,
          ])
          .map((args) => {
            return {
              path: args[0],
              sortingParams: {
                ...(args[2] || {}),
                sortType: args[1],
              },
              grouping: true,
            };
          });

      imagesParams$.on(resolve);

      currentFolder$.emit('ooops');
    });

    expect(await promise).toEqual({
      path: 'ooops',
      sortingParams: {
        sortType: 'all',
      },
      grouping: true,
    });
  });
});
