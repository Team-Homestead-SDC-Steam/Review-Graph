/* eslint-disable no-undef */
const seed = require('./seed');

test('Checks if subsequent SQL calls are different from each other', () => {
  // eslint-disable-next-line no-self-compare
  expect(seed.getInserts().length === seed.getInserts().length).toBe(false);
});

// more tests here
