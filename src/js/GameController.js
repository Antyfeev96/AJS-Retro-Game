/* eslint-disable object-curly-newline */
/* eslint-disable class-methods-use-this */
import themes from './themes';
import { characterGenerator, generateTeam } from './generators';
import { Swordsman, Bowman, Magician, Undead, Vampire, Daemon, Character } from './Character';
import PositionedCharacter from './PositionedCharacter';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.drawUi(themes.prairie);

    const playerCells = [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57];
    const enemyCells = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];

    const teams = generateTeam([new Bowman(), new Swordsman(), new Undead(), new Vampire()], 4, 10);

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
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }
}
