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
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.drawUi(themes.prairie);

    const teams = generateTeam(this.allowedArr, 4, 10);

    // drawing
    this.gamePlay.redrawPositions([
      new PositionedCharacter(teams[0][0], this.playerFirstCell),
      new PositionedCharacter(teams[0][1], this.playerSecondCell),
      new PositionedCharacter(teams[1][0], this.enemyFirstCell),
      new PositionedCharacter(teams[1][1], this.enemySecondCell),
    ]);

    // adding eventListeners
    this.gamePlay.addCellEnterListener((event) => this.onCellEnter(event));
    this.gamePlay.addCellClickListener((event) => this.onCellClick(event));
    this.gamePlay.addCellLeaveListener((event) => this.onCellLeave(event));
  }

  onCellClick(index) {
    // TODO: react to click
    const cells = Array.from(this.gamePlay.boardEl.children);
    const charCell = cells[index].querySelector('.character');

    if (charCell === null) {
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
        this.gamePlay.deselectCell(cell);
        this.gamePlay.selectCell(index);
      }
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
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

  onCellLeave(index) {
    // TODO: react to mouse leave
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
