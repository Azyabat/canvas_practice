import LinesUtils from '../utils/lines.utils';

class Polygon {
  constructor(dots, canvas, isFill) {
    this.uuid = Symbol();
    this.dots = dots;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.isFill = isFill;
    this.linesCollection = LinesUtils.getLines(dots);
  }

  draw() {
    this.ctx.beginPath();
    this.dots.forEach((positions, index) => {
      if (index === 0) {
        this.ctx.moveTo(positions.x, positions.y);
      } else {
        this.ctx.lineTo(positions.x, positions.y);
      }
    });
    this.ctx.closePath();
    this.ctx.stroke();
    if (this.isFill) {
      this.ctx.fillStyle = 'red';
      this.ctx.fill();
    }
  }

  move(differentX, differentY) {
    this.dots.forEach((pos, index) => {
      this.dots[index].x += differentX;
      this.dots[index].y += differentY;
    });

    this.linesCollection = LinesUtils.getLines(this.dots);
  }
}

export default Polygon;
