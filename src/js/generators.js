import { Swordsman, Bowman, Magician, Undead, Vampire, Daemon } from './Character';

/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  // TODO: write logic here
  if (maxLevel === 4) {
    return;
  }

  for (const item of allowedTypes) {
    item = Math.floor(Math.random() * allowedTypes.length)
    console.log(item);
    if (item === 0 || item === 3) {
      const attack = 25, defence = 25;
      yield {
        level,
        attack,
        defence,
        health,
        type: item
      }
    }

    if (item === 1 || item === 4) {
      const attack = 40, defence = 10;
      yield {
        level,
        attack,
        defence,
        health,
        type: item
      }
    }

    if (item === 2 || item === 5) {
      const attack = 10, defence = 40;
      yield {
        level,
        attack,
        defence,
        health,
        type: item
      }
    }
    
  }
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  const generator = characterGenerator(allowedTypes, maxLevel);
  for (const item of generator) {
    generator.next()
  }
}

console.log(generateTeam([new Bowman(1), new Swordsman(1), new Vampire(1), new Undead(1)], 4));
