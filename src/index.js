import Polygon from './сomponents/Polygon';
import PolygonHelper from './utils/polygon.utils';
import Mouse from './utils/mouse.utils';
import jsonData from '../config/data.json';
import '../styles/styles.css';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const widthCanvas = window.innerWidth - 40;
const heightCanvas = window.innerHeight - 40;
const polygonCollection = [];

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function render() {
  clearCanvas();

  polygonCollection.forEach((polygon) => {
    polygon.draw(ctx);
  });
}

(function init() {
  const elementsData = jsonData.data;
  let selectedPolygon;

  canvas.setAttribute('width', widthCanvas);
  canvas.setAttribute('height', heightCanvas);

  elementsData.forEach((element) => {
    polygonCollection.push(new Polygon(element.dots));
  });

  render();

  canvas.onmousedown = (event) => {
    const x = event.offsetX;
    const y = event.offsetY;

    polygonCollection.forEach((polygon) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      polygon.draw(ctx);
      const isInside = ctx.isPointInPath(x, y);

      render();

      if (isInside) {
        Mouse.setPosition(x, y);
        selectedPolygon = polygon;
      }
    });
  };

  canvas.onmousemove = (event) => {
    if (!selectedPolygon) {
      return;
    }

    const newX = event.offsetX;
    const newY = event.offsetY;
    const differenceX = newX - Mouse.x;
    const differenceY = newY - Mouse.y;

    selectedPolygon.move(differenceX, differenceY);
    Mouse.setPosition(newX, newY);
    render();
  };

  canvas.onmouseup = () => {
    if (!selectedPolygon) {
      return;
    }

    PolygonHelper.isPolygonCross(polygonCollection, selectedPolygon, ctx, clearCanvas);

    render();

    selectedPolygon = undefined;
  };
})();
