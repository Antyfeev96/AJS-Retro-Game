export default class GameStateService {
  constructor(storage) {
    this.storage = storage;
    this.topPoints = [];
    this.savePoints();
  }

  save(state) {
    this.storage.setItem('state', JSON.stringify(state));
  }

  load() {
    try {
      return JSON.parse(this.storage.getItem('state'));
    } catch (e) {
      throw new Error('Invalid state');
    }
  }

  savePoints() {
    if (this.storage.getItem('points') !== null) {
      return;
    }
    this.storage.setItem('points', JSON.stringify(this.topPoints));
  }

  addPoints(result) {
    const data = JSON.parse(this.storage.getItem('points'));
    data.push(result);
    data.sort((a, b) => b - a);
    this.storage.setItem('points', JSON.stringify(data));
  }

  loadPoints() {
    try {
      return JSON.parse(this.storage.getItem('points'));
    } catch (e) {
      throw new Error('Invalid state');
    }
  }

  delete() {
    this.storage.removeItem('state');
  }
}
