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
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.canvas.nativeElement.width = window.innerWidth;
    this.canvas.nativeElement.height = window.innerHeight;
    this.flowField = new FlowFieldEffect(this.ctx, window.innerWidth, window.innerHeight)
    this.flowField.animate();
  }

  private windowResizeListener(): void {
    window.addEventListener('resize', () => {
      this.canvas.nativeElement.width = window.innerWidth;
      this.canvas.nativeElement.height = window.innerHeight;   
      this.flowField = new FlowFieldEffect(this.ctx, window.innerWidth, window.innerHeight)

    });
  }

}

class FlowFieldEffect {
  #ctx: CanvasRenderingContext2D;
  #width: number;
  #height: number;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.#ctx = ctx;
    this.#ctx.strokeStyle = 'white';
    this.#width = width;
    this.#height= height;
  }
  
  #draw(x: number, y: number) {
    const length = 300;
    this.#ctx.beginPath();
    this.#ctx.moveTo(x, y);
    this.#ctx.lineTo(x + length, y + length);
    this.#ctx.stroke();
  }
  
  animate() {
    this.#ctx.clearRect(0, 0, this.#width, this.#height)
    this.#draw(100, 100);
    requestAnimationFrame(this.animate.bind(this));
    console.log('animating');
  }
}
