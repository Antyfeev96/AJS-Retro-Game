/* eslint-disable guard-for-in */
import Team from './Team';

/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  // TODO: write logic here
  const char = Math.floor(Math.random() * allowedTypes.length);
  yield new allowedTypes[char](maxLevel);
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here

  const playerTeam = new Team();
  const enemyTeam = new Team();

  for (let i = 0; playerTeam.array.length < characterCount; i += 1) {
    const generator = characterGenerator(allowedTypes, maxLevel);
    const char = generator.next();
    if (char.value.type === 'swordsman' || char.value.type === 'bowman') {
      playerTeam.add(char.value);
    }
  }

  for (let i = 0; enemyTeam.array.length < characterCount; i += 1) {
    const generator = characterGenerator(allowedTypes, maxLevel);
    const char = generator.next();
    if (char.value.type === 'undead' || char.value.type === 'vampire') {
      enemyTeam.add(char.value);
    }
  }

  return [playerTeam.array, enemyTeam.array];
}
