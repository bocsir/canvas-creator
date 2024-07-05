import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, HostListener, Input, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import { CanvasInput } from '../canvas-input';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.css'
})
export class CanvasComponent implements OnInit {
  //get canvas element
  @ViewChild('myCanvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D;
  flowField!: FlowFieldEffect;

  defaultInputData!: CanvasInput;
  @Input() inputData!: CanvasInput;
  @Input() isCard!: boolean;


  cardWidth!: number | null;
  cardHeight!: number | null;
  //initialize with defaults
  ngOnInit(): void { 
    if (this.isCard) {
      this.cardWidth = 480;
      this.cardHeight = 300;
    } else {
      this.cardWidth = null;
      this.cardHeight = null;
    }


    //dont run the rest if
    //eg. only use defaults for home pages canvas
    if (this.inputData){ return; }
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.canvas.nativeElement.width = window.innerWidth;
    this.canvas.nativeElement.height = window.innerHeight;

    //home page canvas object
    this.defaultInputData = {
      gridSpacing : 20,
      lineWidth: 2,
      lineLength: 20,
      mouseEffect: 'dim',
      mouseRadius: 100,
      colorList: [], 
      animate: true,
      speed: 10,
      angleFunc: 'cos(x * .01) + sin(y * .01)',
      lineToXFunc: 'x + cos(angle) * length',
      lineToYFunc: 'y + sin(angle) * length'  
    };
  
    this.flowField = new FlowFieldEffect(this.defaultInputData, this.ctx, this.cardWidth! | this.canvas.nativeElement.width, this.cardHeight! | this.canvas.nativeElement.height)
    this.flowField.animate();
  }

  //listen for changes on component @Input
  ngOnChanges(): void {
    if (this.isCard) {
      this.canvas.nativeElement.height = 300;
      this.canvas.nativeElement.width = 480;
    } else {
    this.canvas.nativeElement.width = window.innerWidth;
    this.canvas.nativeElement.height = window.innerHeight;
    }
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    if(this.flowField) {
      this.flowField.stopAnimation();
    }
    this.flowField = new FlowFieldEffect(this.inputData, this.ctx, this.cardWidth! | this.canvas.nativeElement.width, this.cardHeight! | this.canvas.nativeElement.height);
    this.flowField.animate();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (this.isCard) {
      return;
    }
    this.canvas.nativeElement.width = window.innerWidth;
    this.canvas.nativeElement.height = window.innerHeight;  
    this.ctx = this.canvas.nativeElement.getContext('2d')!; 
    this.flowField.stopAnimation();

    const data = (this.inputData) ? this.inputData : this.defaultInputData;
    this.flowField = new FlowFieldEffect(data, this.ctx, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.flowField.animate();
  }

  //get mouse coordinates each mousemove
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
  #domain: number;
  #vr: number;
  #recievedData: CanvasInput;

  constructor(recievedData: CanvasInput, ctx: CanvasRenderingContext2D, width: number, height: number) { 
    this.#recievedData = recievedData;
    
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
    this.#domain = 8;
    this.#vr = .03;

    this.#formatTrig(this.#recievedData.angleFunc);
    this.#formatTrig(this.#recievedData.lineToXFunc);
    this.#formatTrig(this.#recievedData.lineToYFunc);

    console.log('recieved and formatted data: ', this.#recievedData);
  }

  //add 'math.' to all trig functions
  //this function is ugly :/
  #formatTrig(str: string) {
    let formattedStr = str;

    //if there is a trig function not preceded by '.' => append Math.
    if (formattedStr.includes('cos') && ((formattedStr[formattedStr.indexOf('cos')-1]) !== '.')){
      formattedStr = formattedStr.replaceAll('cos', 'Math.cos');
    } 
    if(formattedStr.includes('sin') && ((formattedStr[formattedStr.indexOf('sin')-1]) !== '.')){
      formattedStr = formattedStr.replaceAll('sin', 'Math.sin');
    }
    if(formattedStr.includes('tan') && ((formattedStr[formattedStr.indexOf('tan')-1]) !== '.')) {
      formattedStr = formattedStr.replaceAll('tan', 'Math.tan');
    }

    //replace function string with new formatted string
    if(str === this.#recievedData.angleFunc) {
      this.#recievedData.angleFunc = formattedStr;
    } else if(str === this.#recievedData.lineToXFunc) {
      this.#recievedData.lineToXFunc = formattedStr;
    } else if (str === this.#recievedData.lineToYFunc) {
      this.#recievedData.lineToYFunc = formattedStr;
    }
  }

  //color(s) for each line
  #createGradient() {
    this.#gradient = this.#ctx.createLinearGradient(0, 0, this.#width, this.#height);
    const colorList = this.#recievedData.colorList;

    if(colorList.length > 0) {
      let colorStopPosition = (colorList.length === 1) ? 1 : ((.9) / (colorList.length -1));
      let step = colorStopPosition;

      for (let i = 0; i < colorList.length; i++) {
        colorStopPosition = .1 + i * step;
        this.#gradient.addColorStop(colorStopPosition, colorList[i]);        
      }
    } else {
      //default gradient
      this.#gradient.addColorStop('0.1', '#ff5c33');
      this.#gradient.addColorStop('.2', '#ff66b3');
      this.#gradient.addColorStop('.4', '#ccccff');
      this.#gradient.addColorStop('.6', '#b3ffff');
      this.#gradient.addColorStop('.8', '#80ff80');
      this.#gradient.addColorStop('1', '#ffff33');
    }
  }
  
  #draw(angle: number, x: number, y: number) {
    let dx = mouse.x - x;
    let dy = mouse.y - y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    
    let maxDist: number | null;
    let length!: number;
    const radius = this.#recievedData.mouseRadius;

    //mouse effect
    switch(this.#recievedData.mouseEffect) {
      case('none'):
        length = this.#recievedData.lineLength;
        break;
      case('lit'):
        maxDist = (distance > radius) ? 40 : null;
        length = (maxDist ?? distance) * (this.#recievedData.lineLength / 100);
        break;
      case('dim'):
        length = (distance > radius) 
        ? this.#recievedData.lineLength 
        : ((distance / radius) * .5 *  this.#recievedData.lineLength);
        break;
    }

    this.#ctx.beginPath();
    this.#ctx.moveTo(x, y);

    //evaluate string inputs for lineTo
    const lineToX = eval(this.#recievedData.lineToXFunc);
    const lineToY = eval(this.#recievedData.lineToYFunc);

    this.#ctx.lineTo(lineToX, lineToY);
    this.#ctx.stroke();
  }
  
  stopAnimation() {
      cancelAnimationFrame(this.#flowFieldAnimation);
  }

  animate(timeStamp?: number) {
    timeStamp = (timeStamp) ? timeStamp : 0;
  
    //get change in time between frames for smooth animation on all machines
    const deltaTime = timeStamp - this.#lastTime;
    this.#lastTime = timeStamp;

    if (this.#timer > this.#interval - (this.#recievedData.speed-50)) {
      this.#ctx.clearRect(0, 0, this.#width, this.#height)
      this.#domain += this.#vr;
      (this.#domain > 8 || this.#domain < -8 ) ? this.#vr *= -1 : '';  

      //shoul have a slider for this and call it effectMultiplier or the like
      if(!this.#recievedData.animate) {
        this.#domain = 2;
      }
      //draw 
      for (let y = 0; y < this.#height; y+= this.#cellSize) {
        for (let x = 0; x < this.#width; x+= this.#cellSize) {
          const angle = eval(this.#recievedData.angleFunc) * this.#domain;
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