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
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.drawUi(themes.prairie);

    const playerCells = [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57];
    const enemyCells = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];

    const teams = generateTeam(this.allowedArr, 4, 10);

    // player cells

    const playerFirstCell = playerCells[Math.floor(Math.random() * playerCells.length)];

    playerCells.splice(playerCells.indexOf(playerFirstCell, 0), 1);

    const playerSecondCell = playerCells[Math.floor(Math.random() * playerCells.length)];

    // enemy cells

    const enemyFirstCell = enemyCells[Math.floor(Math.random() * enemyCells.length)];

    enemyCells.splice(enemyCells.indexOf(enemyFirstCell, 0), 1);

    const enemySecondCell = enemyCells[Math.floor(Math.random() * enemyCells.length)];

    // drawing
    this.gamePlay.redrawPositions([
      new PositionedCharacter(teams[0][0], playerFirstCell),
      new PositionedCharacter(teams[0][1], playerSecondCell),
      new PositionedCharacter(teams[1][0], enemyFirstCell),
      new PositionedCharacter(teams[1][1], enemySecondCell),
    ]);

    // adding eventListeners
    this.gamePlay.addCellEnterListener((event) => this.onCellEnter(event));
    this.gamePlay.addCellClickListener((event) => this.onCellClick(event));
    this.gamePlay.addCellLeaveListener((event) => this.onCellLeave(event));
  }

  onCellClick(index) {
    // TODO: react to click
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
    if (this.gamePlay.boardEl.querySelector('.selected-yellow') !== null) {
      if (!cells[index].querySelector('.character')) {
        const selectedCell = cells.indexOf(this.gamePlay.boardEl.querySelector('.selected-yellow'));
        const arr = [
          selectedCell - 1, selectedCell - 2, selectedCell - 3, selectedCell - 4,
          selectedCell + 1, selectedCell + 2, selectedCell + 3, selectedCell + 4,
          selectedCell - 7, selectedCell - 14, selectedCell - 21, selectedCell - 28,
          selectedCell + 7, selectedCell + 14, selectedCell + 21, selectedCell + 28,
          selectedCell - 8, selectedCell - 16, selectedCell - 24, selectedCell - 32,
          selectedCell + 8, selectedCell + 16, selectedCell + 24, selectedCell + 32,
          selectedCell - 9, selectedCell - 18, selectedCell - 27, selectedCell - 36,
          selectedCell + 9, selectedCell + 18, selectedCell + 27, selectedCell + 36,
        ];
        arr.forEach((item) => {
          if (index === item) {
            this.gamePlay.setCursor('pointer');
            this.gamePlay.selectCell(index, 'green');
          }
        });
      } else {
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
