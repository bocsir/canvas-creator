import { Component, ViewChild, ElementRef, AfterViewInit} from '@angular/core';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.css'
})
export class CanvasComponent implements AfterViewInit {

  @ViewChild('myCanvas', { static: true }) 
  canvas!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D;

  flowField!: FlowFieldEffect;

  ngAfterViewInit(): void {
    this.windowResizeListener();
    this.windowMouseListener();
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.canvas.nativeElement.width = window.innerWidth;
    this.canvas.nativeElement.height = window.innerHeight;
    this.flowField = new FlowFieldEffect(this.ctx, window.innerWidth, window.innerHeight)
    this.flowField.animate(0);
  }

  private windowResizeListener(): void {
    window.addEventListener('resize', () => {
      this.canvas.nativeElement.width = window.innerWidth;
      this.canvas.nativeElement.height = window.innerHeight;   
      this.flowField = new FlowFieldEffect(this.ctx, window.innerWidth, window.innerHeight);
      this.flowField.animate(0);
    });
  }

  private windowMouseListener(): void {
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    })
  }
}
class FlowFieldEffect {
  #ctx: CanvasRenderingContext2D;
  #width: number;
  #height: number;
  #flowFieldAnimation: any;
  #lastTime: number;
  #interval: number;
  #timer: number;
  #cellSize: number; 

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.#ctx = ctx;
    this.#ctx.strokeStyle = 'white';
    this.#ctx.lineWidth = 5;
    this.#width = width;
    this.#height= height;
    this.#lastTime = 0;
    this.#interval = 1000/60;
    this.#timer = 0;
    this.#cellSize= 15;
  }
  
  #draw(x: number, y: number) {
    const length = 300;
    this.#ctx.beginPath();
    this.#ctx.moveTo(x, y);
    this.#ctx.lineTo(x+25, y+25);
    this.#ctx.stroke();
  }
  
  animate(timeStamp: number) {
    //get change in time between frames for smooth animation on all machines
    let deltaTime = timeStamp - this.#lastTime;
    this.#lastTime = timeStamp;

    if (this.#timer > this.#interval) {
      this.#ctx.clearRect(0, 0, this.#width, this.#height)

      for (let y = 0; y < this.#height; y+= this.#cellSize) {
        for (let x = 0; x < this.#width; x+= this.#cellSize)
          this.#draw(x,y);
      }

      this.#draw(this.#width/2, this.#height/2);
      this.#timer = 0;
    } else {
      this.#timer += deltaTime;
    }
    this.#flowFieldAnimation = requestAnimationFrame(this.animate.bind(this));
    
  }

}

const mouse = {
  x: 0,
  y: 0,
}