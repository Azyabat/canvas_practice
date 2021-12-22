class PolygonHelper {
  isCrossLines(firstLine, secondLine) {
    const x1 = firstLine.start.x;
    const y1 = firstLine.start.y;
    const x2 = firstLine.end.x;
    const y2 = firstLine.end.y;

    const x3 = secondLine.start.x;
    const y3 = secondLine.start.y;
    const x4 = secondLine.end.x;
    const y4 = secondLine.end.y;

    const aDx = x2 - x1;
    const aDy = y2 - y1;
    const bDx = x4 - x3;
    const bDy = y4 - y3;
    const commonDivisor = -bDx * aDy + aDx * bDy;

    const s = (-aDy * (x1 - x3) + aDx * (y1 - y3)) / commonDivisor;
    const t = (+bDx * (y1 - y3) - bDy * (x1 - x3)) / commonDivisor;

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
      return true;
    }

    return false;
  }

  isPolygonOwnPolygon(polygonCollection, selectedPolygon, ctx, clearCanvas) {
    let isOwn = false;

    polygonCollection.forEach((polygon) => {
      if (selectedPolygon.uuid === polygon.uuid) {
        return;
      }

      clearCanvas();
      polygon.draw(ctx);

      isOwn = selectedPolygon.dots.some((selectedPolygonPosition) => {
        return ctx.isPointInPath(selectedPolygonPosition.x, selectedPolygonPosition.y);
      });

      if (!isOwn) {
        clearCanvas();
        selectedPolygon.draw(ctx);

        isOwn = polygon.dots.some((polygonDotPosition) => {
          return ctx.isPointInPath(polygonDotPosition.x, polygonDotPosition.y);
        });
      }

      if (isOwn) {
        polygon.intersectedCollection.add(selectedPolygon.uuid);
        selectedPolygon.intersectedCollection.add(polygon.uuid);
      }
    });
  }

  isPolygonCross(polygonCollection, selectedPolygon, ctx, clearCanvas) {
    polygonCollection.forEach((polygon) => {
      let isCross = false;
      if (polygon.uuid === selectedPolygon.uuid) {
        return 0;
      }

      polygon.edgeCollection.forEach((firstEdge, index) => {
        if (isCross) {
          return;
        }
        isCross = selectedPolygon.edgeCollection.some((secondEdge) => {
          return this.isCrossLines(firstEdge, secondEdge);
        });

        if (index === polygon.edgeCollection.length - 1 && !isCross) {
          isCross = this.isPolygonOwnPolygon(polygonCollection, selectedPolygon, ctx, clearCanvas);
        }
      });

      if (isCross) {
        polygon.intersectedCollection.add(selectedPolygon.uuid);
        selectedPolygon.intersectedCollection.add(polygon.uuid);
      } else {
        polygon.intersectedCollection.delete(selectedPolygon.uuid);
        selectedPolygon.intersectedCollection.delete(polygon.uuid);
      }
    });
  }
}

export default new PolygonHelper();
