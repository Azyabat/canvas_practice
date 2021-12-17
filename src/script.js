import Element from "./ElementComponent";
import jsonData from "./data.json";
import './styles.css';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const widthCanvas = window.innerWidth - 40;
const heightCanvas = window.innerHeight - 40;
const elementsData = jsonData.data;
const elementsCollection = [];
const intersectionElements = new Set();

let lastCursorPositionX, lastCursorPositionY;

function checkInside (x, y, polygon) {

    var i, j=polygon.length-1 ;
    var  oddNodes=false;

    var polyX = polygon.map((pol)=>{return pol[0]});
    var polyY = polygon.map((pol)=>{return pol[1]});

    for (i=0; i<polygon.length; i++) {
        if ((polyY[i]< y && polyY[j]>=y ||  polyY[j]< y && polyY[i]>=y) &&  (polyX[i]<=x || polyX[j]<=x)) {
          oddNodes^=(polyX[i]+(y-polyY[i])/(polyY[j]-polyY[i])*(polyX[j]-polyX[i])<x); 
        }
        j=i; 
    }
        if(oddNodes){
            return true;
        }else{
            return false;
        }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);   

    render()
}

function crossLines(pos1, pos2, pos3, pos4){
    const x1 = pos1[0];
    const y1 = pos1[1];
    const x2 = pos2[0];
    const y2 = pos2[1];
    const x3 = pos3[0];
    const y3 = pos3[1];
    const x4 = pos4[0];
    const y4 = pos4[1];

    var a_dx = x2 - x1;
    var a_dy = y2 - y1;
    var b_dx = x4 - x3;
    var b_dy = y4 - y3;
    var s = (-a_dy * (x1 - x3) + a_dx * (y1 - y3)) / (-b_dx * a_dy + a_dx * b_dy);
    var t = (+b_dx * (y1 - y3) - b_dy * (x1 - x3)) / (-b_dx * a_dy + a_dx * b_dy);
    if((s >= 0 && s <= 1 && t >= 0 && t <= 1)){
     return true;
    }
}

function checkCross() {
    elementsCollection.forEach((polygon, index)=>{
        polygon.dots.forEach((pos, dotsIndex)=>{
            let position1 = pos, position2;
            
            if(dotsIndex === polygon.dots.length -1){
                position2 = polygon.dots[0]
            }else{
                position2 = polygon.dots[dotsIndex + 1];
            }

            elementsCollection.forEach((secondPolygon, secondIndex)=>{
                if(secondIndex === index){
                    return;
                }

                secondPolygon.dots.forEach((position, positionIndex)=>{
                    let position3 = position, position4;

                    if(positionIndex === secondPolygon.dots.length -1){
                        position4 = secondPolygon.dots[0]
                    }else{
                        position4 = secondPolygon.dots[positionIndex + 1];
                    }

                    const isCross = crossLines(position1, position2, position3, position4);

                    if(isCross){
                        intersectionElements.add(polygon.name);
                        return 0;
                    }
                })
            })
        })
    })

    clearCanvas()
}

function render() {
    elementsCollection.forEach((elem)=>{
        const isFill = intersectionElements.has(elem.name);
        elem.draw(isFill);
    })
}

(function init() {
    canvas.setAttribute("width", widthCanvas);
    canvas.setAttribute("height", heightCanvas);

    elementsData.forEach((element)=>{
        elementsCollection.push(new Element(element.dots, canvas, element.name))
    });

    render()

    canvas.onmousedown = function(event) {
        const x = event.offsetX;
        const y = event.offsetY;

        elementsCollection.forEach((elementComponent)=>{
            const isInside = checkInside(x,y, elementComponent.dots);
            
            if(isInside){
                lastCursorPositionX = x;
                lastCursorPositionY = y;

                canvas.onmousemove = (event) => {
                    const newX = event.offsetX;
                    const newY = event.offsetY;
                    const differenceX = newX - lastCursorPositionX;
                    const differenceY = newY - lastCursorPositionY;

                    elementComponent.move(differenceX, differenceY);
                    clearCanvas();

                    lastCursorPositionX = newX;
                    lastCursorPositionY = newY;

                    canvas.onmouseup = () =>{
                        intersectionElements.clear();  
                        checkCross();
                        canvas.onmousemove = null;   
                    }
                }
            }
        })
            
    }
})()