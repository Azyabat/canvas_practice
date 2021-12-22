class Mouse {
  constructor() {
    this.x = undefined;
    this.y = undefined;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }
}

export default new Mouse();
