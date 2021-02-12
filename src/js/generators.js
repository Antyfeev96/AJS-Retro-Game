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
  for (const item in allowedTypes) {
    const char = Math.floor(Math.random() * allowedTypes.length);
    yield new allowedTypes[char]();
  }
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here

  const playerTeam = new Team();
  const enemyTeam = new Team();

  do {
    const generator = characterGenerator(allowedTypes, maxLevel);
    const char = generator.next();
    if (playerTeam.array.length < 2 && (char.value.type === 'swordsman' || char.value.type === 'bowman')) {
      playerTeam.add(char.value);
    }
    if (enemyTeam.array.length < 2 && (char.value.type === 'undead' || char.value.type === 'vampire')) {
      enemyTeam.add(char.value);
    }
  } while (playerTeam.array.length < 2 || enemyTeam.array.length < 2);

  return [playerTeam.array, enemyTeam.array];
}
