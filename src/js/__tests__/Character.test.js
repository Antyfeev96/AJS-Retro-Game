import Character from '../Character';

test('You cant use Character for create chars', () => {
  expect(() => new Character(4)).toThrow('You should use classes, inherited from Character');
});
