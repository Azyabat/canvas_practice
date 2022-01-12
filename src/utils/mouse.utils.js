class Mouse {
  constructor() {
    this.x = undefined;
    this.y = undefined;
    this.downPositionX = undefined;
    this.downPositionY = undefined;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  setDownPosition(x, y) {
    this.downPositionX = x;
    this.downPositionY = y;
  }
}

export default new Mouse();
