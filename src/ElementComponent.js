class Element{
    constructor(dots, canvas){
        this.dots = dots;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    draw(isFill){
        this.ctx.beginPath();
        this.dots.forEach((positions, index)=>{
            if(index === 0){
                this.ctx.moveTo(positions[0], positions[1]);
            }else{
                this.ctx.lineTo(positions[0], positions[1]);
            }
        })
        this.ctx.closePath();
        this.ctx.stroke(); 
        if(isFill){
            this.ctx.fillStyle = "red"; 
            this.ctx.fill()
        }
    }

    move(differentX, differentY){    
       let newPosition = this.dots.map((pos)=>{
            return [pos[0]+ differentX, pos[1]+ differentY ]
        })
    
        this.dots = newPosition;

    }
}

export default Element;
