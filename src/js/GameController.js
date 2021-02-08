/* eslint-disable no-unused-expressions */
/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
/* eslint-disable class-methods-use-this */
import themes from './themes';
import { generateTeam } from './generators';
import { Swordsman, Bowman, Magician, Undead, Vampire, Daemon, Character } from './Character';
import PositionedCharacter from './PositionedCharacter';
import GamePlay from './GamePlay';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.allowedArr = [new Bowman(), new Swordsman(), new Undead(), new Vampire()];

    this.playerCells = [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57];
    this.enemyCells = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];

    // player cells
    this.playerFirstCell = this.playerCells[Math.floor(Math.random() * this.playerCells.length)];
    this.playerCells.splice(this.playerCells.indexOf(this.playerFirstCell, 0), 1);
    this.playerSecondCell = this.playerCells[Math.floor(Math.random() * this.playerCells.length)];

    // enemy cells
    this.enemyFirstCell = this.enemyCells[Math.floor(Math.random() * this.enemyCells.length)];
    this.enemyCells.splice(this.enemyCells.indexOf(this.enemyFirstCell, 0), 1);
    this.enemySecondCell = this.enemyCells[Math.floor(Math.random() * this.enemyCells.length)];

    // create characters
    this.teams = generateTeam(this.allowedArr, 4, 10);
    this.playerFirst = new PositionedCharacter(this.teams[0][0], this.playerFirstCell);
    this.playerSecond = new PositionedCharacter(this.teams[0][1], this.playerSecondCell);
    this.enemyFirst = new PositionedCharacter(this.teams[1][0], this.enemyFirstCell);
    this.enemySecond = new PositionedCharacter(this.teams[1][1], this.enemySecondCell);

    this.characters = [this.playerFirst, this.playerSecond, this.enemyFirst, this.enemySecond];
    this.playerTeam = [this.playerFirst, this.playerSecond];
    this.enemyTeam = [this.enemyFirst, this.enemySecond];
    this.turn = '';
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.drawUi(themes.prairie);

    // drawing
    this.gamePlay.redrawPositions([this.playerFirst, this.playerSecond, this.enemyFirst, this.enemySecond]);

    // adding eventListeners
    this.gamePlay.addCellEnterListener((event) => this.onCellEnter(event));
    this.gamePlay.addCellClickListener((event) => this.onCellClick(event));
    this.gamePlay.addCellLeaveListener((event) => this.onCellLeave(event));
    this.turn = 'player';
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
          const attacker = this.playerFirst.position === cell ? this.playerFirst.character : this.playerSecond.character;
          this.gamePlay.deselectCell(cell);
          this.gamePlay.selectCell(index);
          if (cells[index].querySelector('.character') === null) {
            if (cell === this.playerFirst.position) {
              Array.from(this.gamePlay.boardEl.children)[this.playerFirstCell].title = '';
              this.playerFirst.position = index;
              this.playerFirstCell = index;
            } else if (cell === this.playerSecond.position) {
              Array.from(this.gamePlay.boardEl.children)[this.playerSecondCell].title = '';
              this.playerSecond.position = index;
              this.playerSecondCell = index;
            }
            this.gamePlay.deselectCell(index);
            this.gamePlay.setCursor('auto');
            this.gamePlay.redrawPositions(this.characters);
            this.turn = 'enemy';
            this.enemyTurn();
          } else if (charCell.classList.contains('undead') || charCell.classList.contains('vampire') || charCell.classList.contains('daemon')) {
            [this.enemyFirst, this.enemySecond].forEach((item) => {
              if (item.position === index) {
                this.gamePlay.deselectCell(index);
                const resultAttack = Math.max(attacker.attack - item.character.defence, attacker.attack * 0.1);
                this.gamePlay.showDamage(index, resultAttack)
                  .then(() => {
                    item.character.health -= resultAttack;
                    [this.characters, this.enemyTeam].forEach((array) => {
                      array.map((elem, pos) => {
                        if (elem.character.health <= 0) {
                          array.splice(pos, 1);
                          Array.from(this.gamePlay.boardEl.children)[elem.position].title = '';
                        }
                      });
                    });
                    this.gamePlay.redrawPositions(this.characters);
                    this.turn = 'enemy';
                    this.enemyTurn();
                  });
              }
            });
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
            this.allowedArr.forEach((item) => {
              if (item.type === char) {
                this.gamePlay.showCellTooltip(`🎖${item.level}⚔${item.attack}🛡${item.defence}❤${item.health}`, index);
              }
            });
            this.gamePlay.setCursor('pointer');
          }

          if (char === 'undead'
          || char === 'vampire'
          || char === 'daemon') {
            this.allowedArr.forEach((item) => {
              if (item.type === char) {
                this.gamePlay.showCellTooltip(`🎖${item.level}⚔${item.attack}🛡${item.defence}❤${item.health}`, index);
              }
            });
            this.gamePlay.setCursor('not-allowed');
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

    for (const player of this.playerTeam) {
      if (enemyChar.type === 'undead' && this.turn === 'enemy') {
        radiusOneCell.forEach((cell) => {
          if (cell[0] === Math.floor(player.position / 8) && cell[1] === player.position % 8) {
            this.turn = 'player';
            const resultAttack = Math.max(enemyChar.attack - player.character.defence, enemyChar.attack * 0.1);
            this.gamePlay.showDamage(player.position, resultAttack)
              .then(() => {
                player.character.health -= resultAttack;
                [this.characters, this.playerTeam].forEach((array) => {
                  array.map((elem, pos) => {
                    if (elem.character.health <= 0) {
                      array.splice(pos, 1);
                      Array.from(this.gamePlay.boardEl.children)[elem.position].title = '';
                    }
                  });
                });
                this.gamePlay.redrawPositions(this.characters);
              });
          }
        });

        if (this.turn === 'enemy') {
          const filteredArray = radiusFourCells
            .filter((elem) => {
              if (elem[0] >= 0 && elem[0] < 8 && elem[1] >= 0 && elem[1] < 8) {
                return Array.from(this.gamePlay.boardEl.children)[elem[0] * 8 + elem[1]].querySelector('.character') === null;
              }
            });
          const newEnemyCell = filteredArray[Math.floor(Math.random() * filteredArray.length)];

          Array.from(this.gamePlay.boardEl.children)[enemy.position].title = '';
          enemy.position = newEnemyCell[0] * 8 + newEnemyCell[1];
          this.gamePlay.redrawPositions(this.characters);
          this.turn = 'player';
        }
      } else if (enemyChar.type === 'vampire' && this.turn === 'enemy') {
        radiusTwoCells.forEach((cell) => {
          if (cell[0] === Math.floor(player.position / 8) && cell[1] === player.position % 8) {
            this.turn = 'player';
            const resultAttack = Math.max(enemyChar.attack - player.character.defence, enemyChar.attack * 0.1);
            this.gamePlay.showDamage(player.position, resultAttack)
              .then(() => {
                player.character.health -= resultAttack;
                [this.characters, this.playerTeam].forEach((array) => {
                  array.map((elem, pos) => {
                    if (elem.character.health <= 0) {
                      array.splice(pos, 1);
                      Array.from(this.gamePlay.boardEl.children)[elem.position].title = '';
                    }
                  });
                });
                this.gamePlay.redrawPositions(this.characters);
              });
          }
        });

        if (this.turn === 'enemy') {
          const filteredArray = radiusTwoCells
            .filter((elem) => {
              if (elem[0] >= 0 && elem[0] < 8 && elem[1] >= 0 && elem[1] < 8) {
                return Array.from(this.gamePlay.boardEl.children)[elem[0] * 8 + elem[1]].querySelector('.character') === null;
              }
            });
          const newEnemyCell = filteredArray[Math.floor(Math.random() * filteredArray.length)];

          Array.from(this.gamePlay.boardEl.children)[enemy.position].title = '';
          enemy.position = newEnemyCell[0] * 8 + newEnemyCell[1];
          this.gamePlay.redrawPositions(this.characters);
          this.turn = 'player';
        }
      } else if (enemyChar.type === 'daemon' && this.turn === 'enemy') {
        radiusFourCells.forEach((cell) => {
          if (cell[0] === Math.floor(player.position / 8) && cell[1] === player.position % 8) {
            this.turn = 'player';
            const resultAttack = Math.max(enemyChar.attack - player.character.defence, enemyChar.attack * 0.1);
            this.gamePlay.showDamage(player.position, resultAttack)
              .then(() => {
                player.character.health -= resultAttack;
                [this.characters, this.playerTeam].forEach((array) => {
                  array.map((elem, pos) => {
                    if (elem.character.health <= 0) {
                      array.splice(pos, 1);
                      Array.from(this.gamePlay.boardEl.children)[elem.position].title = '';
                    }
                  });
                });
                this.gamePlay.redrawPositions(this.characters);
              });
          }
        });

        if (this.turn === 'enemy') {
          const filteredArray = radiusOneCell
            .filter((elem) => {
              if (elem[0] >= 0 && elem[0] < 8 && elem[1] >= 0 && elem[1] < 8) {
                return Array.from(this.gamePlay.boardEl.children)[elem[0] * 8 + elem[1]].querySelector('.character') === null;
              }
            });
          const newEnemyCell = filteredArray[Math.floor(Math.random() * filteredArray.length)];

          Array.from(this.gamePlay.boardEl.children)[enemy.position].title = '';
          enemy.position = newEnemyCell[0] * 8 + newEnemyCell[1];
          this.gamePlay.redrawPositions(this.characters);
          this.turn = 'player';
        }
      }
    }
  }
}
