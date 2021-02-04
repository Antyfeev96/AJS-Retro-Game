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
    this.playerFirstCell = this.playerCells[Math.floor(Math.random() * this.playerCells.length)];
    this.playerCells.splice(this.playerCells.indexOf(this.playerFirstCell, 0), 1);
    this.playerSecondCell = this.playerCells[Math.floor(Math.random() * this.playerCells.length)];
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

    if (this.gamePlay.boardEl.style.cursor === 'not-allowed') {
      alert('Impossible action');
    }

    if (!Array.from(this.gamePlay.boardEl.children)[index].querySelector('.character')) {
      return;
    }

    const char = Array.from(this.gamePlay.boardEl.children)[index].firstChild.classList[1];

    if (char === 'swordsman' || char === 'bowman' || char === 'magician') {
      if (this.gamePlay.boardEl.querySelector('.selected-yellow')) {
        if (this.gamePlay.boardEl.querySelector('.selected-yellow') === Array.from(this.gamePlay.boardEl.children)[index]) {
          this.gamePlay.deselectCell(index);
          return;
        }
        this.gamePlay.boardEl.querySelector('.selected-yellow').classList.toggle('selected');
      }
      this.gamePlay.selectCell(index);
    } else {
      GamePlay.showError('You cant choose enemy character');
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    const cells = Array.from(this.gamePlay.boardEl.children);
    const charCell = cells[index].querySelector('.character');
    if (this.gamePlay.boardEl.querySelector('.selected-yellow') !== null) {
      if (!charCell) {
        const selectedCell = cells.indexOf(this.gamePlay.boardEl.querySelector('.selected-yellow'));
        const x = Math.floor(selectedCell / 8);
        const y = selectedCell % 8;

        // travel and attack radius for swordsman
        if (this.gamePlay.boardEl.querySelector('.selected-yellow').querySelector('.swordsman') !== null) {
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

          this.gamePlay.setCursor('not-allowed');

          travelBinaryArr.forEach((item) => {
            if (Math.floor(index / 8) === item[0] && index % 8 === item[1]) {
              this.gamePlay.setCursor('pointer');
              this.gamePlay.selectCell(index, 'green');
            }
          });

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
              this.gamePlay.setCursor('pointer');
              this.gamePlay.selectCell(index, 'green');
            }
          });
        }

        // travel radius for bowman
        if (this.gamePlay.boardEl.querySelector('.selected-yellow').querySelector('.bowman') !== null) {
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

          this.gamePlay.setCursor('not-allowed');

          binaryArr.forEach((item) => {
            if (Math.floor(index / 8) === item[0] && index % 8 === item[1]) {
              this.gamePlay.setCursor('pointer');
              this.gamePlay.selectCell(index, 'green');
            }
          });
        }

        // travel radius for magician
        if (this.gamePlay.boardEl.querySelector('.selected-yellow').querySelector('.magician') !== null) {
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

          this.gamePlay.setCursor('not-allowed');

          binaryArr.forEach((item) => {
            if (Math.floor(index / 8) === item[0] && index % 8 === item[1]) {
              this.gamePlay.setCursor('pointer');
              this.gamePlay.selectCell(index, 'green');
            }
          });
        }
      } else if (charCell) {
        console.log(charCell.classList[1]);
        const char = cells[index].firstChild.classList[1];

        this.allowedArr.forEach((item) => {
          if (item.type === char) {
            this.gamePlay.showCellTooltip(`🎖${item.level}⚔${item.attack}🛡${item.defence}❤${item.health}`, index);
          }
        });

        if (char === 'swordsman' || char === 'bowman' || char === 'magician') {
          this.gamePlay.setCursor('pointer');
        }
      }
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    const cells = Array.from(this.gamePlay.boardEl.children);
    if (cells[index].classList.contains('selected-green')) {
      cells[index].classList.remove('selected-green');
    }
  }
}
