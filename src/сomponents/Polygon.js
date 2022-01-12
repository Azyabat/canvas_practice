import LinesHelper from '../utils/lines.utils';
import PolygonHelper from '../utils/polygon.utils';

class Polygon {
  constructor(dots, isBufferPolygon) {
    this.uuid = Symbol();
    this.dots = dots;
    this.edgeCollection = LinesHelper.getLines(dots);
    this.isIntersected = false;
    this.buffers = isBufferPolygon ? undefined : PolygonHelper.getBuffers(this.edgeCollection);
    this.isSnapedX = 0;
    this.isSnapedY = 0;
    this.snapedPolygon = undefined;
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

    if (this.isIntersected) {
      ctx.fillStyle = 'red';
      ctx.fill();
    }
  }

  move(differentX, differentY) {
    let newDifferentX = differentX;
    let newDifferentY = differentY;

    if (
      this.isSnapedX !== 0 &&
      ((this.isSnapedX > 0 && differentX > 0) ||
        (this.isSnapedX < 0 && differentX < 0) ||
        (this.isSnapedX > 0 && differentX < 0) ||
        (this.isSnapedX < 0 && differentX > 0 && (differentX !== 30 || differentX !== -30)))
    ) {
      newDifferentX = 0;
    }

    if (
      (this.isSnapedX < 0 && differentX > 0 && differentX === 30) ||
      (this.isSnapedX > 0 && differentX < 0 && differentX === -30)
    ) {
      newDifferentX = differentX;
    }

    if (
      this.isSnapedY !== 0 &&
      ((this.isSnapedY > 0 && differentY > 0) ||
        (this.isSnapedY < 0 && differentY < 0) ||
        (this.isSnapedY > 0 && differentY < 0) ||
        (this.isSnapedY < 0 && differentY > 0 && (differentY !== 30 || differentY !== -30)))
    ) {
      newDifferentY = 0;
    }

    if (
      (this.isSnapedY < 0 && differentY > 0 && differentY === 30) ||
      (this.isSnapedY > 0 && differentY < 0 && differentY === -30)
    ) {
      newDifferentY = differentY;
    }

    if (this.isSnapedY !== 0) {
      const mayMoveX = PolygonHelper.isMayMove(this, this.snapedPolygon, 'X', newDifferentX);

      if (!mayMoveX) {
        newDifferentX = 0;
      }
    }

    if (this.isSnapedX !== 0) {
      const mayMoveY = PolygonHelper.isMayMove(this, this.snapedPolygon, 'Y', newDifferentY);

      if (!mayMoveY) {
        newDifferentY = 0;
      }
    }

    this.dots.forEach((pos, index) => {
      this.dots[index].x += newDifferentX;
      this.dots[index].y += newDifferentY;
    });

    this.edgeCollection = LinesHelper.getLines(this.dots);

    if (this.buffers) {
      this.buffers = PolygonHelper.getBuffers(this.edgeCollection);
    }
  }
}

export default Polygon;
