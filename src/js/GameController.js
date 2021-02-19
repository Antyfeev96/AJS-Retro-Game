/* eslint-disable no-nested-ternary */
/* eslint-disable no-mixed-operators */
/* eslint-disable no-unused-expressions */
/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
/* eslint-disable class-methods-use-this */
import themes from './themes';
import { characterGenerator, generateTeam } from './generators';
import { Swordsman, Bowman, Magician, Undead, Vampire, Daemon } from './Character';
import PositionedCharacter from './PositionedCharacter';
import GamePlay from './GamePlay';
import GameState from './GameState';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.allowedArr = [Bowman, Swordsman, Undead, Vampire];

    this.gamePlay.addCellEnterListener((event) => this.onCellEnter(event));
    this.gamePlay.addCellClickListener((event) => this.onCellClick(event));
    this.gamePlay.addCellLeaveListener((event) => this.onCellLeave(event));
    this.gamePlay.addNewGameListener(() => this.onNewGameClick());
    this.gamePlay.addSaveGameListener(() => this.onSaveGameClick({
      level: this.level,
      theme: this.theme,
      points: this.points,
      chars: this.characters,
      playerTeam: this.playerTeam,
      enemyTeam: this.enemyTeam,
    }));
    this.gamePlay.addLoadGameListener(() => this.onLoadGameClick());

    this.playerCells = [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57];
    this.enemyCells = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];
    this.points = 0;
  }

  onNewGameClick() {
    this.init();
  }

  onSaveGameClick(obj) {
    this.stateService.delete();
    this.stateService.save(GameState.from(obj));
  }

  onLoadGameClick() {
    const data = this.stateService.load();
    this.level = data.level;
    this.theme = data.theme;
    this.points = data.points;
    this.characters = data.chars;
    this.playerTeam = data.playerTeam;
    this.enemyTeam = data.enemyTeam;
    this.gamePlay.drawUi(this.theme);
    this.gamePlay.currentLevel.innerText = `level: ${this.level}`;
    this.gamePlay.points.innerText = `points: ${this.points}`;
    this.renderScoreboard();
    this.gamePlay.redrawPositions(this.characters);
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    // player cells
    this.playerFirstCell = this.playerCells[Math.floor(Math.random() * this.playerCells.length)];
    this.playerFilteredCells = this.playerCells.filter((cell) => cell !== this.playerFirstCell);
    this.playerSecondCell = this.playerFilteredCells[Math.floor(Math.random() * this.playerFilteredCells.length)];

    // enemy cells
    this.enemyFirstCell = this.enemyCells[Math.floor(Math.random() * this.enemyCells.length)];
    this.enemyFilteredCells = this.enemyCells.filter((cell) => cell !== this.enemyFirstCell);
    this.enemySecondCell = this.enemyFilteredCells[Math.floor(Math.random() * this.enemyFilteredCells.length)];

    // create characters
    this.teams = generateTeam(this.allowedArr, 1, 2);
    this.playerFirst = new PositionedCharacter(this.teams[0][0], this.playerFirstCell);
    this.playerSecond = new PositionedCharacter(this.teams[0][1], this.playerSecondCell);
    this.enemyFirst = new PositionedCharacter(this.teams[1][0], this.enemyFirstCell);
    this.enemySecond = new PositionedCharacter(this.teams[1][1], this.enemySecondCell);

    this.playerTeam = [this.playerFirst, this.playerSecond];
    this.enemyTeam = [this.enemyFirst, this.enemySecond];
    this.characters = [...this.playerTeam, ...this.enemyTeam];
    this.level = 1;
    this.theme = themes.prairie;
    this.gamePlay.drawUi(this.theme);
    this.gamePlay.currentLevel.innerText = `level: ${this.level}`;
    // drawing
    this.gamePlay.redrawPositions(this.characters);
    this.renderScoreboard();
    // adding eventListeners
    this.turn = 'player';
  }

  generatePlayer(level) {
    const array = [Swordsman, Bowman, Magician];
    const generator = characterGenerator(array, level);
    const char = generator.next().value;
    char.attack = +(char.attack * 1.3 ** (level - 1)).toFixed(2);
    char.defence = +(char.defence * 1.3 ** (level - 1)).toFixed(2);
    const posArr = [];
    for (const characters of this.characters) {
      posArr.push(characters.position);
    }
    const filtered = this.playerCells.filter((cell) => posArr.findIndex((item) => item === cell) === -1);
    const charPos = filtered[Math.floor(Math.random() * filtered.length)];
    const player = new PositionedCharacter(char, charPos);
    this.playerTeam.push(player);
    this.characters.push(player);
  }

  generateEnemyTeam() {
    const array = [Undead, Vampire, Daemon];
    const lvlArray = this.level === 2 ? [1, 2]
      : this.level === 3 ? [1, 2, 3]
        : this.level === 4 ? [1, 2, 3, 4]
          : [this.level - 3, this.level - 2, this.level - 1, this.level];
    for (let i = 0; i < this.playerTeam.length; i += 1) {
      const level = lvlArray[Math.floor(Math.random() * lvlArray.length)];
      const generator = characterGenerator(array, level);
      const char = generator.next().value;
      char.health = 100;
      char.attack = +(char.attack * 1.3 ** (level - 1)).toFixed(2);
      char.defence = +(char.defence * 1.3 ** (level - 1)).toFixed(2);
      const posArr = [];
      for (const characters of this.characters) {
        posArr.push(characters.position);
      }
      const filtered = this.enemyCells.filter((cell) => posArr.findIndex((item) => item === cell) === -1);
      const charPos = filtered[Math.floor(Math.random() * filtered.length)];
      const player = new PositionedCharacter(char, charPos);
      this.enemyTeam.push(player);
      this.characters.push(player);
    }
  }

  increaseLevel() {
    this.level += 1;
    this.theme = this.level === 1 ? themes.prairie
      : this.level === 2 ? themes.desert
        : this.level === 3 ? themes.arctic
          : this.level === 4 ? themes.mountain
            : Object.values(themes)[Math.floor(Math.random() * Object.values(themes).length)];
    this.gamePlay.drawUi(this.theme);
    this.gamePlay.currentLevel.innerText = `level: ${this.level}`;
    for (const player of this.playerTeam) {
      this.points += player.character.health;
    }
    this.points = +this.points.toFixed(2);
    this.gamePlay.points.innerText = `points: ${this.points}`;
    this.renderScoreboard();
    for (const player of this.playerTeam) {
      player.character.level += 1;
      player.character.attack = +Math.max(player.character.attack, player.character.attack * (1.8 - player.character.health / 100)).toFixed(2);
      player.character.defence = +Math.max(player.character.defence, player.character.defence * (1.8 - player.character.health / 100)).toFixed(2);
      player.character.health += 80;
      if (player.character.health > 100) {
        player.character.health = 100;
      }
    }
  }

  renderScoreboard() {
    const data = this.stateService.loadPoints();
    for (let i = 0; i < data.length; i += 1) {
      this.gamePlay.results[i].innerText = data[i];
    }
  }

  onCellClick(index) {
    // TODO: react to click
    if (this.turn === 'player') {
      const cells = Array.from(this.gamePlay.boardEl.children);
      const charCell = cells[index].querySelector('.character');

      if (charCell === null && this.gamePlay.boardEl.querySelector('.selected-yellow') === null) {
        return;
      }

      if (this.gamePlay.boardEl.style.cursor === 'not-allowed') {
        GamePlay.showError('Impossible action');
        return;
      }

      if (this.gamePlay.boardEl.querySelector('.selected-yellow') === null) {
        this.gamePlay.selectCell(index);
      } else if (this.gamePlay.boardEl.querySelector('.selected-yellow') !== null) {
        if (cells[index] === this.gamePlay.boardEl.querySelector('.selected-yellow')) {
          this.gamePlay.deselectCell(index);
        } else {
          const cell = cells.indexOf(this.gamePlay.boardEl.querySelector('.selected-yellow'));
          const attackPlayer = this.playerTeam.find((player) => player.position === cell);
          const attacker = attackPlayer.character;
          this.gamePlay.deselectCell(cell);
          this.gamePlay.selectCell(index);
          if (cells[index].querySelector('.character') === null) {
            [this.playerTeam, this.characters].forEach((array) => {
              for (const player of array) {
                if (cell === player.position) {
                  Array.from(this.gamePlay.boardEl.children)[cell].title = '';
                  player.position = index;
                }
              }
            });
            this.gamePlay.deselectCell(index);
            this.gamePlay.setCursor('auto');
            this.gamePlay.redrawPositions(this.characters);
            this.turn = 'enemy';
            this.enemyTurn();
          } else if (charCell.classList.contains('undead') || charCell.classList.contains('vampire') || charCell.classList.contains('daemon')) {
            for (const char of this.enemyTeam) {
              if (char.position === index) {
                this.gamePlay.deselectCell(index);
                const deltaPos = Math.abs(char.position - attackPlayer.position);

                let modify;

                switch (deltaPos) {
                  case 2:
                  case 14:
                  case 16:
                  case 18:
                    modify = 0.9;
                    break;
                  case 3:
                  case 21:
                  case 24:
                  case 27:
                    modify = 0.8;
                    break;
                  case 4:
                  case 28:
                  case 32:
                  case 36:
                    modify = 0.7;
                    break;
                  default:
                    modify = 1;
                }
                const resultAttack = +(Math.max(attacker.attack - char.character.defence, attacker.attack * 0.1) * modify).toFixed(2);
                this.gamePlay.showDamage(index, resultAttack)
                  .then(() => {
                    char.character.health = +(char.character.health - resultAttack).toFixed(2);
                    [this.characters, this.enemyTeam].forEach((array) => {
                      array.map((elem, pos) => {
                        if (elem.character.health <= 0) {
                          array.splice(pos, 1);
                          Array.from(this.gamePlay.boardEl.children)[elem.position].title = '';
                        }
                      });
                    });
                    if (this.enemyTeam.length === 0) {
                      this.increaseLevel();
                      this.generatePlayer(this.level - 1);
                      this.generateEnemyTeam();
                      this.characters = [...this.playerTeam, ...this.enemyTeam];
                      this.gamePlay.redrawPositions(this.characters);
                    } else {
                      this.gamePlay.redrawPositions(this.characters);
                      this.turn = 'enemy';
                      this.enemyTurn();
                    }
                  });
              }
            }
          }
        }
      }
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    if (this.turn === 'player') {
      const cells = Array.from(this.gamePlay.boardEl.children);
      const charCell = cells[index].querySelector('.character');

      const selectedCell = this.gamePlay.boardEl.querySelector('.selected-yellow');
      const selectedCellIndex = cells.indexOf(selectedCell);
      const x = Math.floor(selectedCellIndex / 8);
      const y = selectedCellIndex % 8;

      if (selectedCell !== null) {
        if (charCell === null) {
          // travel radius for swordsman
          if (selectedCell.querySelector('.swordsman') !== null) {
            this.gamePlay.setCursor('not-allowed');

            const travelBinaryArr = [
              [x + 1, y], [x + 2, y], [x + 3, y], [x + 4, y],
              [x - 1, y], [x - 2, y], [x - 3, y], [x - 4, y],
              [x, y + 1], [x, y + 2], [x, y + 3], [x, y + 4],
              [x, y - 1], [x, y - 2], [x, y - 3], [x, y - 4],
              [x + 1, y - 1], [x + 2, y - 2], [x + 3, y - 3], [x + 4, y - 4],
              [x - 1, y + 1], [x - 2, y + 2], [x - 3, y + 3], [x - 4, y + 4],
              [x + 1, y + 1], [x + 2, y + 2], [x + 3, y + 3], [x + 4, y + 4],
              [x - 1, y - 1], [x - 2, y - 2], [x - 3, y - 3], [x - 4, y - 4],
            ];

            travelBinaryArr.forEach((item) => {
              if (Math.floor(index / 8) === item[0] && index % 8 === item[1]) {
                this.gamePlay.setCursor('pointer');
                this.gamePlay.selectCell(index, 'green');
              }
            });
          }

          // travel radius for bowman
          if (selectedCell.querySelector('.bowman') !== null) {
            this.gamePlay.setCursor('not-allowed');

            const binaryArr = [
              [x + 1, y], [x + 2, y],
              [x - 1, y], [x - 2, y],
              [x, y + 1], [x, y + 2],
              [x, y - 1], [x, y - 2],
              [x + 1, y - 1], [x + 2, y - 2],
              [x - 1, y + 1], [x - 2, y + 2],
              [x + 1, y + 1], [x + 2, y + 2],
              [x - 1, y - 1], [x - 2, y - 2],
            ];

            binaryArr.forEach((item) => {
              if (Math.floor(index / 8) === item[0] && index % 8 === item[1]) {
                this.gamePlay.setCursor('pointer');
                this.gamePlay.selectCell(index, 'green');
              }
            });
          }

          // travel radius for magician
          if (selectedCell.querySelector('.magician') !== null) {
            this.gamePlay.setCursor('not-allowed');

            const binaryArr = [
              [x + 1, y],
              [x - 1, y],
              [x, y + 1],
              [x, y - 1],
              [x + 1, y - 1],
              [x - 1, y + 1],
              [x + 1, y + 1],
              [x - 1, y - 1],
            ];

            binaryArr.forEach((item) => {
              if (Math.floor(index / 8) === item[0] && index % 8 === item[1]) {
                this.gamePlay.setCursor('pointer');
                this.gamePlay.selectCell(index, 'green');
              }
            });
          }
        }

        if (charCell !== null) {
          if (charCell.classList[1] === 'undead' || charCell.classList[1] === 'vampire' || charCell.classList[1] === 'daemon') {
            // attack radius for swordsman
            if (selectedCell.querySelector('.swordsman') !== null) {
              this.gamePlay.setCursor('not-allowed');

              const attackBinaryArr = [
                [x + 1, y],
                [x - 1, y],
                [x, y + 1],
                [x, y - 1],
                [x + 1, y - 1],
                [x - 1, y + 1],
                [x + 1, y + 1],
                [x - 1, y - 1],
              ];

              attackBinaryArr.forEach((item) => {
                if (Math.floor(index / 8) === item[0] && index % 8 === item[1]) {
                  this.gamePlay.setCursor('crosshair');
                  this.gamePlay.selectCell(index, 'red');
                }
              });
            }

            // attack radius for bowman
            if (selectedCell.querySelector('.bowman') !== null) {
              this.gamePlay.setCursor('not-allowed');

              const attackBinaryArr = [
                [x + 1, y], [x + 2, y],
                [x - 1, y], [x - 2, y],
                [x, y + 1], [x, y + 2],
                [x, y - 1], [x, y - 2],
                [x + 1, y - 1], [x + 2, y - 2],
                [x - 1, y + 1], [x - 2, y + 2],
                [x + 1, y + 1], [x + 2, y + 2],
                [x - 1, y - 1], [x - 2, y - 2],
              ];

              attackBinaryArr.forEach((item) => {
                if (Math.floor(index / 8) === item[0] && index % 8 === item[1]) {
                  this.gamePlay.setCursor('crosshair');
                  this.gamePlay.selectCell(index, 'red');
                }
              });
            }

            // attack radius for magician
            if (selectedCell.querySelector('.magician') !== null) {
              this.gamePlay.setCursor('not-allowed');

              const attackBinaryArr = [
                [x + 1, y], [x + 2, y], [x + 3, y], [x + 4, y],
                [x - 1, y], [x - 2, y], [x - 3, y], [x - 4, y],
                [x, y + 1], [x, y + 2], [x, y + 3], [x, y + 4],
                [x, y - 1], [x, y - 2], [x, y - 3], [x, y - 4],
                [x + 1, y - 1], [x + 2, y - 2], [x + 3, y - 3], [x + 4, y - 4],
                [x - 1, y + 1], [x - 2, y + 2], [x - 3, y + 3], [x - 4, y + 4],
                [x + 1, y + 1], [x + 2, y + 2], [x + 3, y + 3], [x + 4, y + 4],
                [x - 1, y - 1], [x - 2, y - 2], [x - 3, y - 3], [x - 4, y - 4],
              ];

              attackBinaryArr.forEach((item) => {
                if (Math.floor(index / 8) === item[0] && index % 8 === item[1]) {
                  this.gamePlay.setCursor('crosshair');
                  this.gamePlay.selectCell(index, 'red');
                }
              });
            }
          } else if (charCell.classList[1] === 'swordsman' || charCell.classList[1] === 'bowman' || charCell.classList[1] === 'magician') {
            this.gamePlay.setCursor('pointer');
          }
        }
      } else if (selectedCell === null) {
        if (charCell) {
          const char = charCell.classList[1];
          if (char === 'swordsman'
          || char === 'bowman'
          || char === 'magician') {
            for (const player of this.playerTeam) {
              if (player.position === index) {
                const playerChar = player.character;
                this.gamePlay.showCellTooltip(`🎖${playerChar.level}⚔${playerChar.attack}🛡${playerChar.defence}❤${playerChar.health}`, index);
                this.gamePlay.setCursor('pointer');
              }
            }
          } else if (char === 'undead'
          || char === 'vampire'
          || char === 'daemon') {
            for (const enemy of this.enemyTeam) {
              if (enemy.position === index) {
                const enemyChar = enemy.character;
                this.gamePlay.showCellTooltip(`🎖${enemyChar.level}⚔${enemyChar.attack}🛡${enemyChar.defence}❤${enemyChar.health}`, index);
                this.gamePlay.setCursor('not-allowed');
              }
            }
          }
        }
      }
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    if (this.turn === 'player') {
      const cells = Array.from(this.gamePlay.boardEl.children);

      this.gamePlay.setCursor('auto');

      if (cells[index].classList.contains('selected-green', 'selected')) {
        cells[index].classList.remove('selected-green', 'selected');
      }

      if (cells[index].classList.contains('selected-red', 'selected')) {
        cells[index].classList.remove('selected-red', 'selected');
      }
    }
  }

  enemyTurn() {
    const enemy = this.enemyTeam[Math.floor(Math.random() * this.enemyTeam.length)];

    const x = Math.floor(enemy.position / 8);
    const y = enemy.position % 8;
    const enemyChar = enemy.character;

    const player = this.playerTeam[Math.floor(Math.random() * this.playerTeam.length)];
    const xP = Math.floor(player.position / 8);
    const yP = player.position % 8;
    const playerChar = player.character;

    const deltaPos = Math.abs(enemy.position - player.position);

    let modify;

    switch (deltaPos) {
      case 2:
      case 14:
      case 16:
      case 18:
        modify = 0.9;
        break;
      case 3:
      case 21:
      case 24:
      case 27:
        modify = 0.8;
        break;
      case 4:
      case 28:
      case 32:
      case 36:
        modify = 0.7;
        break;
      default:
        modify = 1;
    }

    const radiusOneCell = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
      [x + 1, y - 1],
      [x - 1, y + 1],
      [x + 1, y + 1],
      [x - 1, y - 1],
    ];

    const radiusTwoCells = [
      [x + 1, y], [x + 2, y],
      [x - 1, y], [x - 2, y],
      [x, y + 1], [x, y + 2],
      [x, y - 1], [x, y - 2],
      [x + 1, y - 1], [x + 2, y - 2],
      [x - 1, y + 1], [x - 2, y + 2],
      [x + 1, y + 1], [x + 2, y + 2],
      [x - 1, y - 1], [x - 2, y - 2],
    ];

    const radiusFourCells = [
      [x + 1, y], [x + 2, y], [x + 3, y], [x + 4, y],
      [x - 1, y], [x - 2, y], [x - 3, y], [x - 4, y],
      [x, y + 1], [x, y + 2], [x, y + 3], [x, y + 4],
      [x, y - 1], [x, y - 2], [x, y - 3], [x, y - 4],
      [x + 1, y - 1], [x + 2, y - 2], [x + 3, y - 3], [x + 4, y - 4],
      [x - 1, y + 1], [x - 2, y + 2], [x - 3, y + 3], [x - 4, y + 4],
      [x + 1, y + 1], [x + 2, y + 2], [x + 3, y + 3], [x + 4, y + 4],
      [x - 1, y - 1], [x - 2, y - 2], [x - 3, y - 3], [x - 4, y - 4],
    ];

    if (this.turn !== 'enemy') return;
    if (enemyChar.type === 'undead') {
      const cell = radiusOneCell.find((item) => item[0] === xP && item[1] === yP);
      if (cell) {
        const cellPos = cell[0] * 8 + cell[1];
        const resultAttack = +Math.max(enemyChar.attack - playerChar.defence, enemyChar.attack * 0.1).toFixed(2);
        this.gamePlay.showDamage(cellPos, resultAttack)
          .then(() => {
            player.character.health = +(player.character.health - resultAttack).toFixed(2);
            this.characters = [...this.playerTeam, ...this.enemyTeam];
            [this.characters, this.playerTeam].forEach((array) => {
              array.map((elem, pos) => {
                if (elem.character.health <= 0) {
                  array.splice(pos, 1);
                  Array.from(this.gamePlay.boardEl.children)[elem.position].title = '';
                }
              });
            });
            if (this.playerTeam.length === 0) {
              this.gamePlay.redrawPositions(this.enemyTeam);
              alert('LuL you lost in retro game');
              this.stateService.addPoints(this.points);
              this.renderScoreboard();
              this.turn = 'gameover';
            } else {
              this.gamePlay.redrawPositions(this.characters);
              this.turn = 'player';
            }
          });
      } else {
        const filteredArray = radiusFourCells
          .filter((elem) => {
            if (elem[0] >= 0 && elem[0] < 8 && elem[1] >= 0 && elem[1] < 8) {
              return Array.from(this.gamePlay.boardEl.children)[elem[0] * 8 + elem[1]].querySelector('.character') === null;
            }
          });
        const newEnemyCell = filteredArray[Math.floor(Math.random() * filteredArray.length)];

        Array.from(this.gamePlay.boardEl.children)[enemy.position].title = '';
        [this.characters, this.enemyTeam].forEach((array) => {
          for (const char of array) {
            if (char.position === enemy.position) {
              char.position = newEnemyCell[0] * 8 + newEnemyCell[1];
            }
          }
        });
        this.gamePlay.redrawPositions(this.characters);
        this.turn = 'player';
      }
    } else if (enemyChar.type === 'vampire') {
      const cell = radiusTwoCells.find((item) => item[0] === xP && item[1] === yP);
      if (cell) {
        const cellPos = cell[0] * 8 + cell[1];
        const resultAttack = +(Math.max(enemyChar.attack - playerChar.defence, enemyChar.attack * 0.1) * modify).toFixed(2);
        this.gamePlay.showDamage(cellPos, resultAttack)
          .then(() => {
            player.character.health = +(player.character.health - resultAttack).toFixed(2);
            this.characters = [...this.playerTeam, ...this.enemyTeam];
            [this.characters, this.playerTeam].forEach((array) => {
              array.map((elem, pos) => {
                if (elem.character.health <= 0) {
                  array.splice(pos, 1);
                  Array.from(this.gamePlay.boardEl.children)[elem.position].title = '';
                }
              });
            });
            if (this.playerTeam.length === 0) {
              this.gamePlay.redrawPositions(this.enemyTeam);
              alert('LuL you lost in retro game');
              this.stateService.addPoints(this.points);
              this.renderScoreboard();
              this.turn = 'gameover';
            } else {
              this.gamePlay.redrawPositions(this.characters);
              this.turn = 'player';
            }
          });
      } else {
        const filteredArray = radiusTwoCells
          .filter((elem) => {
            if (elem[0] >= 0 && elem[0] < 8 && elem[1] >= 0 && elem[1] < 8) {
              return Array.from(this.gamePlay.boardEl.children)[elem[0] * 8 + elem[1]].querySelector('.character') === null;
            }
          });
        const newEnemyCell = filteredArray[Math.floor(Math.random() * filteredArray.length)];

        Array.from(this.gamePlay.boardEl.children)[enemy.position].title = '';
        [this.characters, this.enemyTeam].forEach((array) => {
          for (const char of array) {
            if (char.position === enemy.position) {
              char.position = newEnemyCell[0] * 8 + newEnemyCell[1];
            }
          }
        });
        this.gamePlay.redrawPositions(this.characters);
        this.turn = 'player';
      }
    } else if (enemyChar.type === 'daemon') {
      const cell = radiusFourCells.find((item) => item[0] === xP && item[1] === yP);
      if (cell) {
        const cellPos = cell[0] * 8 + cell[1];
        const resultAttack = +(Math.max(enemyChar.attack - playerChar.defence, enemyChar.attack * 0.1) * modify).toFixed(2);
        this.gamePlay.showDamage(cellPos, resultAttack)
          .then(() => {
            player.character.health = +(player.character.health - resultAttack).toFixed(2);
            this.characters = [...this.playerTeam, ...this.enemyTeam];
            [this.characters, this.playerTeam].forEach((array) => {
              array.map((elem, pos) => {
                if (elem.character.health <= 0) {
                  array.splice(pos, 1);
                  Array.from(this.gamePlay.boardEl.children)[elem.position].title = '';
                }
              });
            });
            if (this.playerTeam.length === 0) {
              this.gamePlay.redrawPositions(this.enemyTeam);
              alert('LuL you lost in retro game');
              this.stateService.addPoints(this.points);
              this.renderScoreboard();
              this.turn = 'gameover';
            } else {
              this.gamePlay.redrawPositions(this.characters);
              this.turn = 'player';
            }
          });
      } else {
        const filteredArray = radiusOneCell
          .filter((elem) => {
            if (elem[0] >= 0 && elem[0] < 8 && elem[1] >= 0 && elem[1] < 8) {
              return Array.from(this.gamePlay.boardEl.children)[elem[0] * 8 + elem[1]].querySelector('.character') === null;
            }
          });
        const newEnemyCell = filteredArray[Math.floor(Math.random() * filteredArray.length)];

        Array.from(this.gamePlay.boardEl.children)[enemy.position].title = '';
        [this.characters, this.enemyTeam].forEach((array) => {
          for (const char of array) {
            if (char.position === enemy.position) {
              char.position = newEnemyCell[0] * 8 + newEnemyCell[1];
            }
          }
        });
        this.gamePlay.redrawPositions(this.characters);
        this.turn = 'player';
      }
    }
  }
}
