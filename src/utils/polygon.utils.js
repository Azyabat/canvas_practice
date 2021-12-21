class PolygonHelper {
  checkInside(x, y, polygon) {
    const polygonXPositions = polygon.dots.map((pol) => {
      return pol.x;
    });
    const polygonYPositions = polygon.dots.map((pol) => {
      return pol.y;
    });

    let i;
    let j = polygon.dots.length - 1;
    let oddNodes = false;

    for (i = 0; i < polygon.dots.length; i += 1) {
      if (
        ((polygonYPositions[i] < y && polygonYPositions[j] >= y) ||
          (polygonYPositions[j] < y && polygonYPositions[i] >= y)) &&
        (polygonXPositions[i] <= x || polygonXPositions[j] <= x)
      ) {
        oddNodes =
          polygonXPositions[i] +
            ((y - polygonYPositions[i]) / (polygonYPositions[j] - polygonYPositions[i])) *
              (polygonXPositions[j] - polygonXPositions[i]) <
          x;
      }
      j = i;
    }

    return !!oddNodes;
  }

  crossLines(firstLine, secondLine) {
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
    const s = (-aDy * (x1 - x3) + aDx * (y1 - y3)) / (-bDx * aDy + aDx * bDy);
    const t = (+bDx * (y1 - y3) - bDy * (x1 - x3)) / (-bDx * aDy + aDx * bDy);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
      return true;
    }
  }

  checkPolygonOwnPolygon(firstPolygon, polygonCollection) {
    let isDotInside = false;

    firstPolygon.dots.forEach((dots) => {
      polygonCollection.forEach((secondPolygon) => {
        if (firstPolygon.uuid === secondPolygon.uuid || isDotInside) {
          return;
        }

        isDotInside = this.checkInside(dots.x, dots.y, secondPolygon);

        if (isDotInside) {
          secondPolygon.isFill = true;
        }
      });
    });

    return isDotInside;
  }

  checkCross(polygonCollection, renderCallback) {
    polygonCollection.forEach((polygon) => {
      polygon.linesCollection.forEach((firstLine) => {
        polygonCollection.forEach((secondPolygon) => {
          if (secondPolygon.uuid === polygon.uuid) {
            return;
          }

          secondPolygon.linesCollection.forEach((secondLine) => {
            const isCross =
              this.crossLines(firstLine, secondLine) ||
              this.checkPolygonOwnPolygon(polygon, polygonCollection);

            if (isCross) {
              polygon.isFill = true;
              return 0;
            }
          });
        });
      });
    });
    renderCallback();
  }

  disableAllPolygonFill(polygonCollection) {
    polygonCollection.forEach((polygon) => {
      polygon.isFill = false;
    });
  }
}

export default new PolygonHelper();
