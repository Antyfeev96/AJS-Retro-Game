import GameController from '../GameController';
import GamePlay from '../GamePlay';
import GameStateService from '../GameStateService';

const gamePlay = new GamePlay();
const stateService = new GameStateService(localStorage);
const gameCtrl = new GameController(gamePlay, stateService);
gamePlay.bindToDOM(document.body);
gameCtrl.init();

test('Cursor should be pointer in player cell', () => {
  gameCtrl.playerTeam[0].position = 0;
  const eventCheck = (cell) => {
    if (cell === gameCtrl.playerTeam[0].position) {
      gameCtrl.gamePlay.setCursor('pointer');
      return gameCtrl.gamePlay.boardEl.style.cursor === 'pointer';
    }
    return false;
  };
  expect(eventCheck(0)).toBe(true);
});

test('Character cell should be deselected', () => {
  const cells = Array.from(gameCtrl.gamePlay.boardEl.children);
  const pos = gameCtrl.playerTeam[0].position;
  gameCtrl.gamePlay.selectCell(pos, 'yellow');
  gameCtrl.gamePlay.deselectCell(pos);
  expect(cells[pos].classList.contains('selected-green')).toBe(false);
});

test('Empty cell should have green circle', () => {
  const cells = Array.from(gameCtrl.gamePlay.boardEl.children);
  const emptyCell = 20;
  cells[emptyCell].classList.remove('character');
  gameCtrl.gamePlay.selectCell(emptyCell, 'green');
  gameCtrl.gamePlay.setCursor('pointer');
  expect(cells[emptyCell].classList.contains('selected-green')).toBe(true);
  expect(gameCtrl.gamePlay.boardEl.style.cursor).toBe('pointer');
});

test('Unavailable cell should have not-allowed cursor', () => {
  gameCtrl.gamePlay.setCursor('not-allowed');
  expect(gameCtrl.gamePlay.boardEl.style.cursor).toBe('not-allowed');
});

test('Enemy cell should have red circle and crosshair cursor', () => {
  const cells = Array.from(gameCtrl.gamePlay.boardEl.children);
  const enemyCell = 20;
  gameCtrl.gamePlay.selectCell(enemyCell, 'red');
  gameCtrl.gamePlay.setCursor('crosshair');
  expect(cells[enemyCell].classList.contains('selected-red')).toBe(true);
  expect(gameCtrl.gamePlay.boardEl.style.cursor).toBe('crosshair');
});
