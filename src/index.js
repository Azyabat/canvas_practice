import Polygon from './Components/Polygon';
import jsonData from './configs/data.json';
import '../styles/styles.css';
import PolygonHelper from './utils/polygon.utils';
import MouseHelper from './utils/mouse.utils';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const widthCanvas = window.innerWidth - 40;
const heightCanvas = window.innerHeight - 40;
const polygonCollection = [];

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  polygonCollection.forEach((polygon) => {
    polygon.draw();
  });
}

(function init() {
  const elementsData = jsonData.data;
  let selectedPolygon;

  canvas.setAttribute('width', widthCanvas);
  canvas.setAttribute('height', heightCanvas);

  elementsData.forEach((element) => {
    polygonCollection.push(new Polygon(element.dots, canvas));
  });

  render();

  canvas.onmousedown = (event) => {
    const x = event.offsetX;
    const y = event.offsetY;

    polygonCollection.forEach((polygon) => {
      const isInside = PolygonHelper.checkInside(x, y, polygon);

      if (isInside) {
        MouseHelper.setNewCursorPosition([x, y]);
        selectedPolygon = polygon;
      }
    });
  };

  canvas.onmousemove = (event) => {
    if (selectedPolygon) {
      const newX = event.offsetX;
      const newY = event.offsetY;
      const differenceX = newX - MouseHelper.x;
      const differenceY = newY - MouseHelper.y;

      selectedPolygon.move(differenceX, differenceY);
      render();

      MouseHelper.setNewCursorPosition([newX, newY]);
    }
  };

  canvas.onmouseup = () => {
    PolygonHelper.disableAllPolygonFill(polygonCollection);
    PolygonHelper.checkCross(polygonCollection, render);
    selectedPolygon = undefined;
  };
})();
