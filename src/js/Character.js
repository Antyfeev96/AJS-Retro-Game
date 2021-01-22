export default class Character {
  constructor(level, type = 'generic') {
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
    // TODO: throw error if user use "new Character()"
    if (new.target) {
      throw new Error('You should use classes, inherited from Character')
    }
  }
}

class Swordsman extends Character {
  constructor() {
    super(1, type = 'swordsman') 
    this.level = level;
    this.attack = 40;
    this.defence = 10;
    this.health = 50;
    this.type = type;
  }
}

class Bowman extends Character {
  constructor() {
    super(1, type = 'bowman') 
    this.level = level;
    this.attack = 25;
    this.defence = 25;
    this.health = 50;
    this.type = type;
  }
}

class Magician extends Character {
  constructor() {
    super(1, type = 'magician') 
    this.level = level;
    this.attack = 10;
    this.defence = 40;
    this.health = 50;
    this.type = type;
  }
}

class Undead extends Character {
  constructor() {
    super(1, type = 'undead') 
    this.level = level;
    this.attack = 40;
    this.defence = 10;
    this.health = 50;
    this.type = type;
  }
}

class Vampire extends Character {
  constructor() {
    super(1, type = 'vampire') 
    this.level = level;
    this.attack = 25;
    this.defence = 25;
    this.health = 50;
    this.type = type;
  }
}

class Daemon extends Character {
  constructor() {
    super(1, type = 'daemon') 
    this.level = level;
    this.attack = 10;
    this.defence = 40;
    this.health = 50;
    this.type = type;
  }
}
