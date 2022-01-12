import Polygon from './сomponents/Polygon';
import PolygonHelper from './utils/polygon.utils';
import Mouse from './utils/mouse.utils';
import jsonData from '../config/data.json';
import '../styles/styles.css';
import { bufferDistance } from './utils/const';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const widthCanvas = window.innerWidth - 40;
const heightCanvas = window.innerHeight - 40;
const polygonCollection = [];

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

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

    Mouse.setDownPosition(x, y);

    polygonCollection.forEach((polygon) => {
      const isInside = PolygonHelper.isPointInPolygon(polygon, { x, y });

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
    PolygonHelper.isPolygonCross(polygonCollection, selectedPolygon);
    PolygonHelper.isNeedSnap(selectedPolygon, polygonCollection);
    Mouse.setPosition(newX, newY);

    if (selectedPolygon.isSnapedY) {
      if (Mouse.downPositionY - Mouse.y > bufferDistance) {
        selectedPolygon.move(0, -30);
        selectedPolygon.isSnapedY = 0;
      } else if (Mouse.downPositionY - Mouse.y < -bufferDistance) {
        selectedPolygon.move(0, 30);
        selectedPolygon.isSnapedY = 0;
      }
    }

    if (selectedPolygon.isSnapedX) {
      if (Mouse.downPositionX - Mouse.x > bufferDistance) {
        selectedPolygon.move(-30, 0);
        selectedPolygon.isSnapedX = 0;
        selectedPolygon.snapedPolygon = undefined;
      } else if (Mouse.downPositionX - Mouse.x < -bufferDistance) {
        selectedPolygon.move(30, 0);
        selectedPolygon.isSnapedX = 0;
        selectedPolygon.snapedPolygon = undefined;
      }
    }

    render();
  };

  canvas.onmouseup = (event) => {
    if (!selectedPolygon) {
      return;
    }

    if (selectedPolygon.isIntersected) {
      const newX = Mouse.downPositionX - event.offsetX;
      const newY = Mouse.downPositionY - event.offsetY;

      selectedPolygon.move(newX, newY);
      PolygonHelper.isPolygonCross(polygonCollection, selectedPolygon);
      render();
    }

    selectedPolygon = undefined;
  };
})();
