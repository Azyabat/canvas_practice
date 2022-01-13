import Polygon from '../сomponents/Polygon';
import { BUFFER_DISTANCE, SNAPPING_TOLERANCE } from './const';

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

  isPolygonCrossing(selectedPolygon, inscpectedPolygon) {
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

  findPolygonIntersection(polygonCollection, selectedPolygon) {
    let isCrossSelectedPolygon = false;

    polygonCollection.forEach((polygon) => {
      if (polygon.uuid === selectedPolygon.uuid) {
        return;
      }

      const isCross = this.isPolygonCrossing(selectedPolygon, polygon);

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
        { x: leftEdge.start.x, y: leftEdge.start.y - SNAPPING_TOLERANCE },
        { x: leftEdge.start.x - BUFFER_DISTANCE, y: leftEdge.start.y - SNAPPING_TOLERANCE },
        { x: leftEdge.end.x - BUFFER_DISTANCE, y: leftEdge.end.y + SNAPPING_TOLERANCE },
        { x: leftEdge.end.x, y: leftEdge.end.y + SNAPPING_TOLERANCE },
      ],
      true
    );
    const rightBuffer = new Polygon(
      [
        { x: rightEdge.start.x, y: rightEdge.start.y + SNAPPING_TOLERANCE },
        { x: rightEdge.start.x + BUFFER_DISTANCE, y: rightEdge.start.y + SNAPPING_TOLERANCE },
        { x: rightEdge.end.x + BUFFER_DISTANCE, y: rightEdge.end.y - SNAPPING_TOLERANCE },
        { x: rightEdge.end.x, y: rightEdge.end.y - SNAPPING_TOLERANCE },
      ],
      true
    );
    const topBuffer = new Polygon(
      [
        { x: topEdge.start.x + SNAPPING_TOLERANCE, y: topEdge.start.y },
        { x: topEdge.start.x + SNAPPING_TOLERANCE, y: topEdge.start.y - BUFFER_DISTANCE },
        { x: topEdge.end.x - SNAPPING_TOLERANCE, y: topEdge.end.y - BUFFER_DISTANCE },
        { x: topEdge.end.x - SNAPPING_TOLERANCE, y: topEdge.end.y },
      ],
      true
    );
    const bottomBuffer = new Polygon(
      [
        { x: bottomEdge.start.x - SNAPPING_TOLERANCE, y: bottomEdge.start.y },
        { x: bottomEdge.start.x - SNAPPING_TOLERANCE, y: bottomEdge.start.y + BUFFER_DISTANCE },
        { x: bottomEdge.end.x + SNAPPING_TOLERANCE, y: bottomEdge.end.y + BUFFER_DISTANCE },
        { x: bottomEdge.end.x + SNAPPING_TOLERANCE, y: bottomEdge.end.y },
      ],
      true
    );

    return { left: leftBuffer, right: rightBuffer, top: topBuffer, bottom: bottomBuffer };
  }

  findSnap(selectedPolygon, polygonCollection) {
    let isRightSnap;
    let isLeftSnap;
    let isTopSnap;
    let isBottomSnap;

    if (selectedPolygon.snapDirectionX !== 0 || selectedPolygon.snapDirectionY !== 0) {
      return;
    }

    for (const polygon of polygonCollection) {
      if (selectedPolygon.uuid === polygon.uuid) {
        continue;
      }

      isRightSnap = this.isPolygonCrossing(selectedPolygon.buffers.right, polygon);
      isLeftSnap = this.isPolygonCrossing(selectedPolygon.buffers.left, polygon);
      isTopSnap = this.isPolygonCrossing(selectedPolygon.buffers.top, polygon);
      isBottomSnap = this.isPolygonCrossing(selectedPolygon.buffers.bottom, polygon);

      if (isRightSnap || isLeftSnap || isTopSnap || isBottomSnap) {
        selectedPolygon.snapedPolygon = polygon;
      }

      if (isRightSnap) {
        const differenceX =
          polygon.edgeCollection.left.start.x - selectedPolygon.edgeCollection.right.start.x - SNAPPING_TOLERANCE;
        selectedPolygon.move(differenceX, 0);

        selectedPolygon.snapDirectionX = 1;
        selectedPolygon.snapDirectionY = 0;

        return;
      }

      if (isLeftSnap) {
        const differenceX =
          polygon.edgeCollection.right.start.x - selectedPolygon.edgeCollection.left.start.x + SNAPPING_TOLERANCE;
        selectedPolygon.move(differenceX, 0);

        selectedPolygon.snapDirectionX = -1;
        selectedPolygon.snapDirectionY = 0;

        return;
      }

      if (isTopSnap) {
        const differenceY =
          polygon.edgeCollection.bottom.start.y - selectedPolygon.edgeCollection.top.start.y + SNAPPING_TOLERANCE;
        selectedPolygon.move(0, differenceY);

        selectedPolygon.snapDirectionY = -1;
        selectedPolygon.snapDirectionX = 0;

        return;
      }

      if (isBottomSnap) {
        const differenceY =
          polygon.edgeCollection.top.start.y - selectedPolygon.edgeCollection.bottom.start.y - SNAPPING_TOLERANCE;
        selectedPolygon.move(0, differenceY);

        selectedPolygon.snapDirectionY = 1;
        selectedPolygon.snapDirectionX = 0;

        return;
      }
    }
  }

  isPossibilityMove(firstPolygon, secondPolygon, direction, differentNumber) {
    if (direction === 'X') {
      if (
        firstPolygon.edgeCollection.left.start.x + differentNumber > secondPolygon.edgeCollection.left.start.x ||
        firstPolygon.edgeCollection.right.start.x + differentNumber < secondPolygon.edgeCollection.right.start.x
      ) {
        return false;
      }

      return true;
    }

    if (direction === 'Y') {
      if (
        firstPolygon.edgeCollection.top.start.y + differentNumber > secondPolygon.edgeCollection.top.start.y ||
        firstPolygon.edgeCollection.bottom.start.y + differentNumber < secondPolygon.edgeCollection.bottom.start.y
      ) {
        return false;
      }

      return true;
    }
  }

  isMayMove(selectedPolygon, snappedPolygon, direction, differentNumber) {
    if (direction === 'X') {
      const lengthSelectedPolygon =
        selectedPolygon.edgeCollection.top.end.x - selectedPolygon.edgeCollection.top.start.x;
      const lengthSnappedPolygon = snappedPolygon.edgeCollection.top.end.x - snappedPolygon.edgeCollection.top.start.x;

      if (lengthSelectedPolygon > lengthSnappedPolygon) {
        return this.isPossibilityMove(selectedPolygon, snappedPolygon, 'X', differentNumber);
      }
      return this.isPossibilityMove(snappedPolygon, selectedPolygon, 'X', differentNumber);
    }

    if (direction === 'Y') {
      const lengthSelectedPolygon =
        selectedPolygon.edgeCollection.right.end.y - selectedPolygon.edgeCollection.right.start.y;
      const lengthSnappedPolygon =
        snappedPolygon.edgeCollection.right.end.y - snappedPolygon.edgeCollection.right.start.y;

      if (lengthSelectedPolygon > lengthSnappedPolygon) {
        return this.isPossibilityMove(selectedPolygon, snappedPolygon, 'Y', differentNumber);
      }
      return this.isPossibilityMove(snappedPolygon, selectedPolygon, 'Y', differentNumber);
    }
  }

  getDifferentPosition(snapDirection, differentNumber) {
    let newDifferentNumber = differentNumber;

    if (
      snapDirection !== 0 &&
      ((snapDirection > 0 && differentNumber > 0) ||
        (snapDirection < 0 && differentNumber < 0) ||
        (snapDirection > 0 && differentNumber < 0) ||
        (snapDirection < 0 && differentNumber > 0 && (differentNumber !== 30 || differentNumber !== -30)))
    ) {
      newDifferentNumber = 0;
    }

    if (
      (snapDirection < 0 && differentNumber > 0 && differentNumber === 30) ||
      (snapDirection > 0 && differentNumber < 0 && differentNumber === -30)
    ) {
      newDifferentNumber = differentNumber;
    }

    return newDifferentNumber;
  }
}

export default new PolygonHelper();
