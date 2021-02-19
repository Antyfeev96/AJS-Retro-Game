import GameController from '../GameController';
import GamePlay from '../GamePlay';
import GameStateService from '../GameStateService';

const gamePlay = new GamePlay();
const stateService = new GameStateService(localStorage);
const gameCtrl = new GameController(gamePlay, stateService);
gamePlay.bindToDOM(document.body);
gameCtrl.init();

beforeEach(() => {
  gameCtrl.stateService.save({
    level: 1,
    attack: 40,
    defence: 10,
    type: 'swordsman',
    health: 50,
  });
});

test('State should be loaded', () => {
  const data = gameCtrl.stateService.load();
  expect(data).toStrictEqual({
    level: 1,
    attack: 40,
    defence: 10,
    type: 'swordsman',
    health: 50,
  });
});
