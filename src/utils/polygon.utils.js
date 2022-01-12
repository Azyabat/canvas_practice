import Polygon from '../сomponents/Polygon';
import { bufferDistance } from './const';
import Mouse from './mouse.utils';

class PolygonHelper {
  isPointInPolygon(polygon, inspectingPosition) {
    const isPointInsidePolygon = polygon.edgeCollection.lines.every((edge) => {
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

    return isOwn;
  }

  isCrossing(selectedPolygon, inscpectedPolygon) {
    let isCross = false;

    inscpectedPolygon.edgeCollection.lines.forEach((firstEdge) => {
      if (isCross) {
        return;
      }

      isCross = selectedPolygon.edgeCollection.lines.some((secondEdge) => {
        return this.isCrossLines(firstEdge, secondEdge);
      });

      if (!isCross) {
        isCross = this.isPolygonOwnPolygon(selectedPolygon, inscpectedPolygon);
      }
    });

    return isCross;
  }

  isPolygonCross(polygonCollection, selectedPolygon) {
    let isCrossSelectedPolygon = false;

    polygonCollection.forEach((polygon) => {
      if (polygon.uuid === selectedPolygon.uuid) {
        return;
      }

      const isCross = this.isCrossing(selectedPolygon, polygon);

      polygon.isIntersected = isCross;

      if (!isCrossSelectedPolygon && isCross) {
        isCrossSelectedPolygon = true;
      }
    });

    selectedPolygon.isIntersected = isCrossSelectedPolygon;
  }

  getBuffers(edgeCollection) {
    const leftEdge = edgeCollection.left;
    const rightEdge = edgeCollection.right;
    const topEdge = edgeCollection.top;
    const bottomEdge = edgeCollection.bottom;

    const leftBuffer = new Polygon(
      [
        { x: leftEdge.start.x, y: leftEdge.start.y - 2 },
        { x: leftEdge.start.x - bufferDistance, y: leftEdge.start.y - 2 },
        { x: leftEdge.end.x - bufferDistance, y: leftEdge.end.y + 2 },
        { x: leftEdge.end.x, y: leftEdge.end.y + 2 },
      ],
      true
    );
    const rightBuffer = new Polygon(
      [
        { x: rightEdge.start.x, y: rightEdge.start.y + 2 },
        { x: rightEdge.start.x + bufferDistance, y: rightEdge.start.y + 2 },
        { x: rightEdge.end.x + bufferDistance, y: rightEdge.end.y - 2 },
        { x: rightEdge.end.x, y: rightEdge.end.y - 2 },
      ],
      true
    );
    const topBuffer = new Polygon(
      [
        { x: topEdge.start.x + 2, y: topEdge.start.y },
        { x: topEdge.start.x + 2, y: topEdge.start.y - bufferDistance },
        { x: topEdge.end.x - 2, y: topEdge.end.y - bufferDistance },
        { x: topEdge.end.x - 2, y: topEdge.end.y },
      ],
      true
    );
    const bottomBuffer = new Polygon(
      [
        { x: bottomEdge.start.x - 2, y: bottomEdge.start.y },
        { x: bottomEdge.start.x - 2, y: bottomEdge.start.y + bufferDistance },
        { x: bottomEdge.end.x + 2, y: bottomEdge.end.y + bufferDistance },
        { x: bottomEdge.end.x + 2, y: bottomEdge.end.y },
      ],
      true
    );

    return { left: leftBuffer, right: rightBuffer, top: topBuffer, bottom: bottomBuffer };
  }

  isNeedSnap(selectedPolygon, polygonCollection) {
    let isRightSnap;
    let isLeftSnap;
    let isTopSnap;
    let isBottomSnap = false;

    if (selectedPolygon.isSnapedX !== 0 || selectedPolygon.isSnapedY !== 0) {
      return;
    }

    polygonCollection.forEach((polygon) => {
      if (selectedPolygon.uuid === polygon.uuid) {
        return;
      }

      isRightSnap = this.isCrossing(selectedPolygon.buffers.right, polygon);
      isLeftSnap = this.isCrossing(selectedPolygon.buffers.left, polygon);
      isTopSnap = this.isCrossing(selectedPolygon.buffers.top, polygon);
      isBottomSnap = this.isCrossing(selectedPolygon.buffers.bottom, polygon);

      !selectedPolygon.isSnapedX && !selectedPolygon.isSnapedY && Mouse.setDownPosition(Mouse.x, Mouse.y);

      if (isRightSnap || isLeftSnap || isTopSnap || isBottomSnap) {
        selectedPolygon.snapedPolygon = polygon;
      }

      if (isRightSnap) {
        const differenceX = polygon.edgeCollection.left.start.x - selectedPolygon.edgeCollection.right.start.x - 2;
        selectedPolygon.move(differenceX, 0);

        selectedPolygon.isSnapedX = 1;
        selectedPolygon.isSnapedY = 0;
      }

      if (isLeftSnap) {
        const differenceX = polygon.edgeCollection.right.start.x - selectedPolygon.edgeCollection.left.start.x + 2;
        selectedPolygon.move(differenceX, 0);

        selectedPolygon.isSnapedX = -1;
        selectedPolygon.isSnapedY = 0;
      }

      if (isTopSnap) {
        const differenceY = polygon.edgeCollection.bottom.start.y - selectedPolygon.edgeCollection.top.start.y + 2;
        selectedPolygon.move(0, differenceY);

        selectedPolygon.isSnapedY = -1;
        selectedPolygon.isSnapedX = 0;
      }

      if (isBottomSnap) {
        const differenceY = polygon.edgeCollection.top.start.y - selectedPolygon.edgeCollection.bottom.start.y - 2;
        selectedPolygon.move(0, differenceY);

        selectedPolygon.isSnapedY = 1;
        selectedPolygon.isSnapedX = 0;
      }
    });
  }

  isMayMove(selectedPolygon, snappedPolygon, direction, differentNumber) {
    if (direction === 'X') {
      const lengthSelectedPolygon =
        selectedPolygon.edgeCollection.top.end.x - selectedPolygon.edgeCollection.top.start.x;
      const lengthSnappedPolygon = snappedPolygon.edgeCollection.top.end.x - snappedPolygon.edgeCollection.top.start.x;

      if (lengthSelectedPolygon > lengthSnappedPolygon) {
        if (
          selectedPolygon.edgeCollection.left.start.x + differentNumber > snappedPolygon.edgeCollection.left.start.x ||
          selectedPolygon.edgeCollection.right.start.x + differentNumber < snappedPolygon.edgeCollection.right.start.x
        ) {
          return false;
        }
      } else if (
        selectedPolygon.edgeCollection.left.start.x + differentNumber < snappedPolygon.edgeCollection.left.start.x ||
        selectedPolygon.edgeCollection.right.start.x + differentNumber > snappedPolygon.edgeCollection.right.start.x
      ) {
        return false;
      }

      return true;
    }

    if (direction === 'Y') {
      const lengthSelectedPolygon =
        selectedPolygon.edgeCollection.right.end.y - selectedPolygon.edgeCollection.right.start.y;
      const lengthSnappedPolygon =
        snappedPolygon.edgeCollection.right.end.y - snappedPolygon.edgeCollection.right.start.y;

      if (lengthSelectedPolygon > lengthSnappedPolygon) {
        if (
          selectedPolygon.edgeCollection.top.start.y + differentNumber > snappedPolygon.edgeCollection.top.start.y ||
          selectedPolygon.edgeCollection.bottom.start.y + differentNumber < snappedPolygon.edgeCollection.bottom.start.y
        ) {
          return false;
        }
      } else if (
        selectedPolygon.edgeCollection.top.start.y + differentNumber < snappedPolygon.edgeCollection.top.start.y ||
        selectedPolygon.edgeCollection.bottom.start.y + differentNumber > snappedPolygon.edgeCollection.bottom.start.y
      ) {
        return false;
      }

      return true;
    }
  }
}

export default new PolygonHelper();
