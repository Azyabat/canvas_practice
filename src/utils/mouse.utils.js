class MouseHelper {
  constructor() {
    this.x = undefined;
    this.y = undefined;
  }

  setNewCursorPosition(position) {
    this.x = position[0];
    this.y = position[1];
  }
}

export default new MouseHelper();
