test('testing preset integration', () => {
  expect(require('../preset').babel).not.toBe(undefined);
});
