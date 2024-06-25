import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, HostListener, Input, OnChanges, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.css'
})
export class CanvasComponent {
  @ViewChild('myCanvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D;
  flowField!: FlowFieldEffect;

  @Input() inputData!: Object;
  ngOnChanges(): void {
    if(!this.flowField) return;
    this.flowField.stopAnimation();
    this.flowField = new FlowFieldEffect(this.inputData, this.ctx, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.flowField.animate();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.canvas.nativeElement.width = window.innerWidth;
    this.canvas.nativeElement.height = window.innerHeight;  
    this.ctx = this.canvas.nativeElement.getContext('2d')!; 
    this.flowField.stopAnimation();
    this.flowField = new FlowFieldEffect(this.inputData, this.ctx, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.flowField.animate();
  }

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.canvas.nativeElement.width = window.innerWidth;
    this.canvas.nativeElement.height = window.innerHeight;
    this.flowField = new FlowFieldEffect(null, this.ctx, this.canvas.nativeElement.width, this.canvas.nativeElement.height)
    this.flowField.animate(0);
  }


  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    mouse.x = event.x;
    mouse.y = event.y;
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
  #gradient: any;
  #radius: number;
  #vr: number;

  constructor(recievedData: any, ctx: CanvasRenderingContext2D, width: number, height: number) {
    //defaults
    if (!recievedData) {
      recievedData = {
        gridSpacing : 20,
        lineWidth: 1
      }
    }
    
    this.#ctx = ctx;
    this.#ctx.strokeStyle = 'white';
    this.#ctx.lineWidth = recievedData.lineWidth;

    this.#width = width;
    this.#height= height;

    this.#lastTime = 0;
    this.#interval = 1000/60;
    this.#timer = 0;
    this.#cellSize = recievedData.gridSpacing;
    this.#createGradient();

    this.#ctx.strokeStyle = this.#gradient;
    this.#radius = 8;
    this.#vr = .03;
  }

  //color(s) for each line
  #createGradient() {
    this.#gradient = this.#ctx.createLinearGradient(0, 0, this.#width, this.#height);
    this.#gradient.addColorStop('0.1', '#ff5c33');
    this.#gradient.addColorStop('.2', '#ff66b3');
    this.#gradient.addColorStop('.4', '#ccccff');
    this.#gradient.addColorStop('.6', '#b3ffff');
    this.#gradient.addColorStop('.8', '#80ff80');
    this.#gradient.addColorStop('.9', '#ffff33');
  }
  
  #draw(angle: number, x: number, y: number) {

    let dx = mouse.x - x;
    let dy = mouse.y - y;

    let distance = dx * dx + dy * dy;

    if (distance > 700000) distance = 700000;
    else if (distance < 10000) distance = 10000;
    length = distance * .0001;
    //line len
    this.#ctx.beginPath();
    this.#ctx.moveTo(x, y);
    this.#ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
    this.#ctx.stroke();
  }
  
  stopAnimation() {
    cancelAnimationFrame(this.#flowFieldAnimation);
  }

  animate(timeStamp?: number) {
    timeStamp = (timeStamp) ? timeStamp : 0;
  
    //get change in time between frames for smooth animation on all machines
    let deltaTime = timeStamp - this.#lastTime;
    this.#lastTime = timeStamp;

    if (this.#timer > this.#interval) {
      this.#ctx.clearRect(0, 0, this.#width, this.#height)
      this.#radius += this.#vr;
      (this.#radius > 8 || this.#radius < -8 ) ? this.#vr *= -1 : '';

      for (let y = 0; y < this.#height; y+= this.#cellSize) {
        for (let x = 0; x < this.#width; x+= this.#cellSize) {
          const angle = (Math.cos(x * .01) + Math.sin(y * .01)) * this.#radius;
          this.#draw(angle, x, y);
        }
      }

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