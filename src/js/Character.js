/* eslint-disable consistent-return */
/* eslint-disable prefer-template */
/* eslint-disable max-classes-per-file */
export default class Character {
  constructor(level, type = 'generic') {
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
    // TODO: throw error if user use "new Character()"
    if (Character.target) {
      throw new Error('You should use classes, inherited from Character');
    }
  }
}

export class Swordsman extends Character {
  constructor() {
    super(1);
    this.attack = 40;
    this.defence = 10;
    this.health = 50;
    this.type = 'swordsman';

    this[Symbol.iterator] = () => {
      const character = this;
      let current = 1;

      return {
        next() {
          if (current === 1) {
            current = 2;
            return {
              done: false,
              value: character.level,
            };
          }

          if (current === 2) {
            current = 3;
            return {
              done: false,
              value: character.attack,
            };
          }

          if (current === 3) {
            current = 4;
            return {
              done: false,
              value: character.defence,
            };
          }

          if (current === 4) {
            current = 5;
            return {
              done: false,
              value: character.health,
            };
          }

          if (current === 5) {
            current = 'stop';
            return {
              done: false,
              value: character.type,
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

export class Bowman extends Character {
  constructor() {
    super(1);
    this.attack = 25;
    this.defence = 25;
    this.health = 50;
    this.type = 'bowman';

    this[Symbol.iterator] = () => {
      const character = this;
      let current = 1;

      return {
        next() {
          if (current === 1) {
            current = 2;
            return {
              done: false,
              value: character.level,
            };
          }

          if (current === 2) {
            current = 3;
            return {
              done: false,
              value: character.attack,
            };
          }

          if (current === 3) {
            current = 4;
            return {
              done: false,
              value: character.defence,
            };
          }

          if (current === 4) {
            current = 5;
            return {
              done: false,
              value: character.health,
            };
          }

          if (current === 5) {
            current = 'stop';
            return {
              done: false,
              value: character.type,
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

export class Magician extends Character {
  constructor() {
    super(1);
    this.attack = 10;
    this.defence = 40;
    this.health = 50;
    this.type = 'magician';

    this[Symbol.iterator] = () => {
      const character = this;
      let current = 1;

      return {
        next() {
          if (current === 1) {
            current = 2;
            return {
              done: false,
              value: character.level,
            };
          }

          if (current === 2) {
            current = 3;
            return {
              done: false,
              value: character.attack,
            };
          }

          if (current === 3) {
            current = 4;
            return {
              done: false,
              value: character.defence,
            };
          }

          if (current === 4) {
            current = 5;
            return {
              done: false,
              value: character.health,
            };
          }

          if (current === 5) {
            current = 'stop';
            return {
              done: false,
              value: character.type,
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

export class Undead extends Character {
  constructor() {
    super(1);
    this.attack = 40;
    this.defence = 10;
    this.health = 50;
    this.type = 'undead';

    this[Symbol.iterator] = () => {
      const character = this;
      let current = 1;

      return {
        next() {
          if (current === 1) {
            current = 2;
            return {
              done: false,
              value: character.level,
            };
          }

          if (current === 2) {
            current = 3;
            return {
              done: false,
              value: character.attack,
            };
          }

          if (current === 3) {
            current = 4;
            return {
              done: false,
              value: character.defence,
            };
          }

          if (current === 4) {
            current = 5;
            return {
              done: false,
              value: character.health,
            };
          }

          if (current === 5) {
            current = 'stop';
            return {
              done: false,
              value: character.type,
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

export class Vampire extends Character {
  constructor() {
    super(1);
    this.attack = 25;
    this.defence = 25;
    this.health = 50;
    this.type = 'vampire';

    this[Symbol.iterator] = () => {
      const character = this;
      let current = 1;

      return {
        next() {
          if (current === 1) {
            current = 2;
            return {
              done: false,
              value: character.level,
            };
          }

          if (current === 2) {
            current = 3;
            return {
              done: false,
              value: character.attack,
            };
          }

          if (current === 3) {
            current = 4;
            return {
              done: false,
              value: character.defence,
            };
          }

          if (current === 4) {
            current = 5;
            return {
              done: false,
              value: character.health,
            };
          }

          if (current === 5) {
            current = 'stop';
            return {
              done: false,
              value: character.type,
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

export class Daemon extends Character {
  constructor() {
    super(1);
    this.attack = 10;
    this.defence = 40;
    this.health = 50;
    this.type = 'daemon';

    this[Symbol.iterator] = () => {
      const character = this;
      let current = 1;

      return {
        next() {
          if (current === 1) {
            current = 2;
            return {
              done: false,
              value: character.level,
            };
          }

          if (current === 2) {
            current = 3;
            return {
              done: false,
              value: character.attack,
            };
          }

          if (current === 3) {
            current = 4;
            return {
              done: false,
              value: character.defence,
            };
          }

          if (current === 4) {
            current = 5;
            return {
              done: false,
              value: character.health,
            };
          }

          if (current === 5) {
            current = 'stop';
            return {
              done: false,
              value: character.type,
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
