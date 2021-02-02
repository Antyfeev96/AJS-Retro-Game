import themes from '../js/themes';
import { characterGenerator, generateTeam } from './generators';
import { Swordsman, Bowman, Magician, Undead, Vampire, Daemon, Character } from './Character';
import GamePlay from './GamePlay';
import PositionedCharacter from './PositionedCharacter'
import Team from './Team';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.drawUi(themes.prairie);
    let playerCells = [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57]
    let enemyCells = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63
    ]
    const playerArr = [new Bowman(), new Swordsman()]
    const enemyArr = [new Undead(), new Vampire()]

    // player

    const playerFirstChar = playerArr[Math.floor(Math.random() * playerArr.length)];

    const playerSecondChar = playerArr[Math.floor(Math.random() * playerArr.length)];

    const playerFirstCell = playerCells[Math.floor(Math.random() * playerCells.length)];

    playerCells.splice(playerCells.indexOf(playerFirstCell, 0), 1);

    const playerSecondCell = playerCells[Math.floor(Math.random() * playerCells.length)];

    // enemy

    const enemyFirstChar = enemyArr[Math.floor(Math.random() * enemyArr.length)];

    const enemySecondChar = enemyArr[Math.floor(Math.random() * enemyArr.length)];

    const enemyFirstCell = enemyCells[Math.floor(Math.random() * enemyCells.length)];

    enemyCells.splice(enemyCells.indexOf(enemyFirstCell, 0), 1);

    const enemySecondCell = enemyCells[Math.floor(Math.random() * enemyCells.length)];

    // drawing
    this.gamePlay.redrawPositions([
      new PositionedCharacter(playerFirstChar, playerFirstCell), 
      new PositionedCharacter(playerSecondChar, playerSecondCell),
      new PositionedCharacter(enemyFirstChar, enemyFirstCell),
      new PositionedCharacter(enemySecondChar, enemySecondCell),
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

// const bowman = new Bowman(1)

// for (const prop of bowman) {
//   console.log(prop);
// }