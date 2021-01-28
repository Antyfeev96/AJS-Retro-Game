import Character, { Bowman } from './Character';
import GamePlay from './GamePlay';
import characterGenerator from './generators';

export default class PositionedCharacter {
  constructor(character, position) {
    if (!(character instanceof Character)) {
      throw new Error('character must be instance of Character or its children');
    }

    if (typeof position !== 'number') {
      throw new Error('position must be a number');
    }

    this.character = character;
    this.position = position;

    this[Symbol.iterator] = function() {
      const character = this.character;
      let current = character.level;
    
      return {
        next() {
          if (current === character.level) {
            current = character.attack
            return {
              done: false,
              value: character.level
            }
          } else if (current === character.attack) {
            current = character.defence
            return {
              done: false,
              value: character.attack
            }
          } else if (current === character.defence) {
            current = character.health
            return {
              done: false,
              value: character.defence
            }
          } else if (current === character.health) {
            current = character.type
            return {
              done: false,
              value: character.health
            }
          }
          if (current === character.type) {
            current = 'stop'
            return {
              done: false,
              value: character.type
            }
          }

          if (current === 'stop') {
            return {
              done: true
            }
          }
        }
      }
    }
  }
}

