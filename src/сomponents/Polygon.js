import LinesUtils from '../utils/lines.utils';

class Polygon {
  constructor(dots) {
    this.uuid = Symbol();
    this.dots = dots;
    this.edgeCollection = LinesUtils.getLines(dots);
    this.intersectedCollection = new Set();
  }

  draw(ctx) {
    ctx.beginPath();

    this.dots.forEach((positions, index) => {
      if (index === 0) {
        ctx.moveTo(positions.x, positions.y);
      } else {
        ctx.lineTo(positions.x, positions.y);
      }
    });

    ctx.closePath();
    ctx.stroke();

    if (this.intersectedCollection.size > 0) {
      ctx.fillStyle = 'red';
      ctx.fill();
    }
  }

  move(differentX, differentY) {
    this.dots.forEach((pos, index) => {
      this.dots[index].x += differentX;
      this.dots[index].y += differentY;
    });

    this.edgeCollection = LinesUtils.getLines(this.dots);
  }
}

export default Polygon;
