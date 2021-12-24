class LinesUtils {
  getLines(dots) {
    return dots.map((positions, index) => {
      const startPostion = positions;
      let endPosition;

      if (index === dots.length - 1) {
        endPosition = dots[0];
      } else {
        endPosition = dots[index + 1];
      }

      return { start: startPostion, end: endPosition };
    });
  }
}

export default new LinesUtils();
