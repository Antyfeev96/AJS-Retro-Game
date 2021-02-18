import Character, { Swordsman } from '../Character';

test('You cant use Character for create chars', () => {
  expect(() => new Character(4)).toThrow('You should use classes, inherited from Character');
});

test('Swordsman should be created', () => {
  expect(() => new Swordsman(1)).not.toThrow();
});
