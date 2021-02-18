import { Swordsman } from '../Character';

test('The information must be output', () => {
  const swordsman = new Swordsman(1);
  const div = document.createElement('div');
  div.title = `🎖${swordsman.level}⚔${swordsman.attack}🛡${swordsman.defence}❤${swordsman.health}`;
  expect(div.title).toBe('🎖1⚔40🛡10❤50');
});
