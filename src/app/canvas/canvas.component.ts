import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, HostListener, Input, OnInit} from '@angular/core';
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

  loadedPercent: any;
  updateLoadedPercent(percent: number) {
    this.loadedPercent = percent;
  }

  //initialize with defaults
  ngOnInit(): void { 
    if (this.isCard) {
      this.cardWidth = 480;
      this.cardHeight = 300;
    } else {
      this.cardWidth = null;
      this.cardHeight = null;
    }

    if (this.inputData) return; 
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
      lineToYFunc: 'y + sin(angle) * length',
      renderAnimation: false,
    };
  
    this.flowField = new FlowFieldEffect(
      this.defaultInputData,
      this.ctx,
      this.cardWidth! | this.canvas.nativeElement.width,
      this.cardHeight! | this.canvas.nativeElement.height,
      (progress) => this.updateLoadedPercent(progress)
    );
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

    //reset animations running in previouse instance
    if (this.flowField) {
      this.flowField.stopAnimation(); 
      console.log('stoppp'); 
      this.flowField.resetAnimation = true;
    }

    //make new instance
    this.flowField = new FlowFieldEffect(
      this.inputData,
      this.ctx,
      this.cardWidth! | this.canvas.nativeElement.width,
      this.cardHeight! | this.canvas.nativeElement.height,
      (progress) => this.updateLoadedPercent(progress)
    );

    //set renderAnimation back to false if true to prevent animation rendering every change
    if (this.inputData.renderAnimation) {
      this.inputData.renderAnimation = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (this.isCard) return;
    this.canvas.nativeElement.width = window.innerWidth;
    this.canvas.nativeElement.height = window.innerHeight;  
    this.ctx = this.canvas.nativeElement.getContext('2d')!; 
    this.flowField.stopAnimation();

    const data = (this.inputData) ? this.inputData : this.defaultInputData;
    this.flowField = new FlowFieldEffect(
      data,
      this.ctx,
      this.canvas.nativeElement.width,
      this.canvas.nativeElement.height,
      (progress) => this.updateLoadedPercent(progress)
    );
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
  #cellSize: number; 
  #gradient: any;
  #domain: number;
  #vr: number;
  #recievedData: CanvasInput;
  #frames: any[] = [];
  //need to set this to true when user clicks save button
  #renderAnimation: boolean = false;
  #totalFrames: number;
  #maxDomain: number;
  #onLoadUpdate: (load: number) => void;
  resetAnimation: boolean = false;

  constructor(recievedData: CanvasInput, ctx: CanvasRenderingContext2D, width: number, height: number, onLoadUpdate: (load: number) => void) { 
    this.stopAnimation();
    this.resetAnimation = true;
    this.#frames = [];

    this.#onLoadUpdate = onLoadUpdate;
    this.#recievedData = recievedData;
    
    this.#ctx = ctx;
    this.#ctx.strokeStyle = 'white';
    this.#ctx.lineWidth = recievedData.lineWidth;

    this.#width = width;
    this.#height= height;

    this.#cellSize = recievedData.gridSpacing;
    this.#createGradient();

    this.#ctx.strokeStyle = this.#gradient;
    this.#domain = 0;
    this.#maxDomain = 5
    this.#vr = .02;

    this.#renderAnimation = this.#recievedData.renderAnimation;
    this.#totalFrames = Math.round(this.#maxDomain / this.#vr);
  
    this.#formatTrig(this.#recievedData.angleFunc);
    this.#formatTrig(this.#recievedData.lineToXFunc);
    this.#formatTrig(this.#recievedData.lineToYFunc);

    console.log('recieved and formatted data: ', this.#recievedData);
    this.animate();
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
    
    let length: number = this.#recievedData.lineLength;
    let maxDist: number | null;
    const radius = this.#recievedData.mouseRadius;

    //add and is rendering condition
    if (this.#recievedData.mouseEffect !== 'none' && !this.#renderAnimation) {
      //mouse effect
      switch(this.#recievedData.mouseEffect) {
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
    }

    this.#ctx.beginPath();
    this.#ctx.moveTo(x, y);

    //evaluate string inputs for lineTo
    const lineToX = eval(this.#recievedData.lineToXFunc);
    const lineToY = eval(this.#recievedData.lineToYFunc);

    this.#ctx.lineTo(lineToX, lineToY);
    this.#ctx.stroke();
  }

  frame = 0;
  //call draw() using different multipliers to create an animation
  animate() {
    //make slider for this and for a starting domain
    //change direction of domain
    if (this.#domain >= this.#maxDomain || this.#domain < 0) {
        this.#vr *= -1;
    }

    //reset canvas data
    this.#ctx.clearRect(0,0,this.#width, this.#height);
    

    //draw frame using new domain
    //condition allows mouse effect for animate = false
    if(this.#recievedData.animate){
      this.#domain += this.#vr;
    }

    for (let x = 0; x < this.#width; x += this.#cellSize) {
      for (let y = 0; y < this.#height; y += this.#cellSize) {
        const angle = eval(this.#recievedData.angleFunc) * this.#domain;
        this.#draw(angle, x, y);
      }
    }

    //only draw one frame if !animate
    if(this.#renderAnimation) {
      const loadedPercent = Math.floor(this.frame / this.#totalFrames * 100);
      this.#onLoadUpdate(loadedPercent);
      console.log(`frame ${this.frame} / ${this.#totalFrames } rendered`);

      //if rendering is done
      if (loadedPercent === 100) {
        console.log('animation rendered');
        //reset domain for mouse
        this.#domain = this.#vr;
        
        this.#renderAnimation = false;

        //animate using prerendered object, not this function
        this.stopAnimation();
        this.resetAnimation = false;
        this.useLoadedAnimation();
        return;

      }
      //get image data of px values from current canvas and push to frames array 
      const imageData = this.#ctx.getImageData(0,0,this.#width, this.#height);
      this.#frames.push(imageData);
      this.frame++;
    }
  
    //call for new frame
    this.#flowFieldAnimation = requestAnimationFrame(this.animate.bind(this));
  }

  currentFrame: number = 0;
  async useLoadedAnimation() {
    if (this.resetAnimation){
      console.log('return');
      return;
    };


    console.log(this.currentFrame,` ` ,this.#frames);
    let currentFrame = this.currentFrame;

    //specify animation direction based on currentFrame
    const forward = (currentFrame === 0);

    //draw the frame at specified index
    const drawFrame = (frameIndex: number) => {
      //get current frame
      const frame = this.#frames[frameIndex];

      //clear canvas context
      this.#ctx.clearRect(0, 0, this.#ctx.canvas.width, this.#ctx.canvas.height);

      //make new temporary canvas to allow for responsive aspect ratio
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = frame.width;
      tempCanvas.height = frame.height;

      //get context and fill with imageData from pre-rendered frame
      const tempCtx = tempCanvas.getContext('2d');
      tempCtx?.putImageData(frame, 0, 0);

      //render canvas to browser using temporary canvas
      this.#ctx.drawImage(tempCanvas, 0, 0, frame.width, frame.height, 0, 0, window.innerWidth, window.innerHeight);
    }

    //while going forward and less than animation array length or backward and over 0
    while ((forward && currentFrame < this.#frames.length) || (!forward && currentFrame >= 0)) {
      if (this.resetAnimation){
        console.log('reset');
        break;
      };

      //adjust for framerate
      await this.delay(20);
      drawFrame(currentFrame);

      for (let y = 0; y < this.#height; y += this.#cellSize) {
        for (let x = 0; x < this.#width; x += this.#cellSize) {
          const angle = eval(this.#recievedData.angleFunc) * this.#domain;
          this.drawMouseEffect(x, y, angle);
        }
      }

      // alternative way to draw without adjusting for different aspect ratios
      // this.#ctx.putImageData(this.#frames[currentFrame], 0, 0);

      //next frame
      this.currentFrame = forward ? currentFrame++ : currentFrame--;
      this.#domain = forward ? this.#domain + this.#vr : this.#domain - this.#vr;
    }
    
    this.useLoadedAnimation();
  }

  delay(ms: number) {
    return new Promise(res => setTimeout(res, ms));
  } 

  drawMouseEffect(x: number, y: number, angle: number) {
      const dx = mouse.x - x;
      const dy = mouse.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      let length: number;
      let maxDist: number | null;
      const radius = this.#recievedData.mouseRadius;

      //mouse effect
      if (this.#recievedData.mouseEffect !== 'none') {
        //mouse effect
        switch(this.#recievedData.mouseEffect) {
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
      }

      this.#ctx.strokeStyle = this.#gradient;
        this.#ctx.beginPath();
        this.#ctx.moveTo(x, y);
  
        //evaluate string inputs for lineTo
        const lineToX = eval(this.#recievedData.lineToXFunc);
        const lineToY = eval(this.#recievedData.lineToYFunc);
    
        this.#ctx.lineTo(lineToX, lineToY);
        this.#ctx.stroke();  
  }
}

const mouse = {
  x: 0,
  y: 0,
}

