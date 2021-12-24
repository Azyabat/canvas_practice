class PolygonHelper {
  isPointInPolygon(polygon, inspectingPosition) {
    const isPointInsidePolygon = polygon.edgeCollection.every((edge) => {
      const isInside =
        (inspectingPosition.x - edge.start.x) * (edge.end.y - edge.start.y) -
        (inspectingPosition.y - edge.start.y) * (edge.end.x - edge.start.x);

      return isInside < 0;
    });

    return !!isPointInsidePolygon;
  }

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

  isPolygonOwnPolygon(polygon, selectedPolygon) {
    let isOwn = false;

    isOwn = selectedPolygon.dots.every((selectedPolygonPosition) => {
      return this.isPointInPolygon(polygon, { x: selectedPolygonPosition.x, y: selectedPolygonPosition.y });
    });

    if (!isOwn) {
      isOwn = polygon.dots.every((polygonDotPosition) => {
        return this.isPointInPolygon(selectedPolygon, { x: polygonDotPosition.x, y: polygonDotPosition.y });
      });
    }

    if (isOwn) {
      polygon.intersectedCollection.add(selectedPolygon.uuid);
      selectedPolygon.intersectedCollection.add(polygon.uuid);
    }

    return isOwn;
  }

  isPolygonCross(polygonCollection, selectedPolygon) {
    polygonCollection.forEach((polygon) => {
      let isCross = false;
      if (polygon.uuid === selectedPolygon.uuid) {
        return;
      }

      polygon.edgeCollection.forEach((firstEdge) => {
        if (isCross) {
          return;
        }
        isCross = selectedPolygon.edgeCollection.some((secondEdge) => {
          return this.isCrossLines(firstEdge, secondEdge);
        });
      });

      if (!isCross) {
        isCross = this.isPolygonOwnPolygon(polygon, selectedPolygon);
      }

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
