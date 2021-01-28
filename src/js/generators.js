import { Swordsman, Bowman, Magician, Undead, Vampire, Daemon } from './Character';
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
    const char = Math.floor(Math.random() * allowedTypes.length)
    if (char === 0) {
      yield allowedTypes[0]
    }

    if (char === 1) {
      yield allowedTypes[1]
    }

    if (char === 2) {
      yield allowedTypes[2]
    }

    if (char === 3) {
      yield allowedTypes[3]
    }

  }
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  const generator = characterGenerator(allowedTypes, maxLevel);

  const playerTeam = new Team();
  const uiTeam = new Team();
  
  for (let item of generator) {

    if (item.type === 'swordsman' || item.type === 'bowman') {
      playerTeam.add(item)
    }

    if (item.type === 'undead' || item.type === 'vampire') {
      uiTeam.add(item)
    }
    
  }
}
