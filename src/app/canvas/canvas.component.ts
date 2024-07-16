import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, HostListener, Input, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import { CanvasInput } from '../canvas-input';
import * as math from 'mathjs';
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
    console.log('input data in ');
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

  // @HostListener('window:resize', ['$event'])
  // onResize() {
  //   if (this.isCard) {
  //     return;
  //   }
  //   this.canvas.nativeElement.width = window.innerWidth;
  //   this.canvas.nativeElement.height = window.innerHeight;  
  //   this.ctx = this.canvas.nativeElement.getContext('2d')!; 
  //   this.flowField.stopAnimation();

  //   const data = (this.inputData) ? this.inputData : this.defaultInputData;
  //   this.flowField = new FlowFieldEffect(data, this.ctx, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  //   this.flowField.animate();
  // }

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
  #frames: any[] = [];
  #isDone: boolean = false;

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
    this.#domain = 0;
    this.#vr = .01;
    

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
  
  stopAnimation() {
    cancelAnimationFrame(this.#flowFieldAnimation);
  }

  #draw(angle: number, x: number, y: number) {
    const dx = mouse.x - x;
    const dy = mouse.y - y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    let maxDist: number | null;
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

/*
  angleFunc: 'cos(x * .01) + sin(y * .01)',
  lineToXFunc: 'x + cos(angle) * length',
  lineToYFunc: 'y + sin(angle) * length'  
*/

  animate() {
    //make slider for this
    const maxDomain = 5;

    if (this.#domain >= maxDomain) {
      console.log('animation loaded');
      this.stopAnimation();
      this.useLoadedAnimation();
      return;
    }
  
    this.#ctx.clearRect(0,0,this.#width, this.#height);

    this.#domain += this.#vr;

    //shoul have a slider for this and call it effectMultiplier or the like
    // if(!this.#recievedData.animate) {
    //   this.#domain = 2;
    // }

    //draw 
    for (let y = 0; y < this.#height; y += this.#cellSize) {
      for (let x = 0; x < this.#width; x += this.#cellSize) {
        const angle = eval(this.#recievedData.angleFunc) * this.#domain;
        this.#draw(angle, x, y);
      }
    }
    console.log('done');

    const imageData = this.#ctx.getImageData(0,0,this.#width, this.#height);
    this.#frames.push(imageData);
    this.#flowFieldAnimation = requestAnimationFrame(this.animate.bind(this));
  }

  currentFrame: number = 0;

  async useLoadedAnimation() {
    let currentFrame = this.currentFrame;
    const forward = currentFrame === 0;

    const drawFrame = (frameIndex: number) => {
      const frame = this.#frames[frameIndex];

      this.#ctx.canvas.width = window.innerWidth;
      this.#ctx.canvas.height = window.innerHeight;

      const offCanvas = document.createElement('canvas');
      offCanvas.width = frame.width;
      offCanvas.height = frame.height;
      const offCtx = offCanvas.getContext('2d');

      offCtx?.putImageData(frame, 0, 0);

      this.#ctx.drawImage(offCanvas, 0, 0, frame.width, frame.height, 0, 0, window.innerWidth, window.innerHeight);
    }

    while ((forward && currentFrame < this.#frames.length - 1) || (!forward && currentFrame > 0)) {
      await this.delay(50);
      drawFrame(currentFrame);

      // this.#ctx.putImageData(this.#frames[currentFrame], 0, 0);
      
      currentFrame = forward ? currentFrame + 1 : currentFrame - 1;
    }
    
    this.currentFrame = forward ? currentFrame : 0;
    
    console.log('animation done');
    this.#flowFieldAnimation = requestAnimationFrame(this.animate.bind(this));
  }

  delay(ms: number) {
    return new Promise(res => setTimeout(res, ms));
  } 
}

const mouse = {
  x: 0,
  y: 0,
}