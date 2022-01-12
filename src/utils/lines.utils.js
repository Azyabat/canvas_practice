class LinesUtils {
  getLines(dots) {
    const result = {};
    const dotsX = dots.map((positions) => {
      return positions.x;
    });

    const dotsY = dots.map((positions) => {
      return positions.y;
    });

    const maxX = Math.max.apply(null, dotsX);
    const minX = Math.min.apply(null, dotsX);
    const maxY = Math.max.apply(null, dotsY);
    const minY = Math.min.apply(null, dotsY);

    const lines = dots.map((positions, index) => {
      const startPostion = positions;
      let endPosition;

      if (index === dots.length - 1) {
        endPosition = dots[0];
      } else {
        endPosition = dots[index + 1];
      }

      return { start: startPostion, end: endPosition };
    });

    result.right = lines.filter((line) => line.start.x === maxX && line.end.x === maxX)[0];
    result.left = lines.filter((line) => line.start.x === minX && line.end.x === minX)[0];
    result.bottom = lines.filter((line) => line.start.y === maxY && line.end.y === maxY)[0];
    result.top = lines.filter((line) => line.start.y === minY && line.end.y === minY)[0];
    result.lines = lines;

    return result;
  }
}

export default new LinesUtils();
