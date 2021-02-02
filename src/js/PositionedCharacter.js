/* eslint-disable consistent-return */
/* eslint-disable prefer-destructuring */
import Character from './Character';

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

    this[Symbol.iterator] = () => {
      const char = this.character;
      let current = char.level;

      return {
        next() {
          if (current === char.level) {
            current = char.attack;
            return {
              done: false,
              value: char.level,
            };
          }

          if (current === char.attack) {
            current = char.defence;
            return {
              done: false,
              value: char.attack,
            };
          }

          if (current === char.defence) {
            current = char.health;
            return {
              done: false,
              value: char.defence,
            };
          }

          if (current === char.health) {
            current = char.type;
            return {
              done: false,
              value: char.health,
            };
          }

          if (current === char.type) {
            current = 'stop';
            return {
              done: false,
              value: char.type,
            };
          }

          if (current === 'stop') {
            return {
              done: true,
            };
          }
        },
      };
    };
  }
}
