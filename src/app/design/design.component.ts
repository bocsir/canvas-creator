import { Component, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { CanvasComponent } from "../canvas/canvas.component";
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { SliderModule } from 'primeng/slider';
import { ColorStopComponent } from "../color-stop/color-stop.component";
import { CanvasInput } from '../canvas-input';

@Component({
    selector: 'app-design',
    standalone: true,
    templateUrl: './design.component.html',
    styleUrl: './design.component.scss',
    imports: [CanvasComponent, CommonModule, SliderModule, InputTextModule, FormsModule, ColorStopComponent]
})
export class DesignComponent {
  hideExplanation: boolean = true;
  menuVisible: boolean = true;  
  animating: boolean = false;
  mEffect: boolean = false;

  //min/max range values for sliders
  mouseRadMin: number = 20;
  mouseRadMax: number = 500;

  lineLengthMin: number = 1;
  lineLengthMax: number = 200;

  lineWidthMin: number = 1;
  lineWidthMax: number = 200;

  gridSpaceMin: number = 4;
  gridSpaceMax: number = 300;

  speedMin: number = 0;
  speedMax: number = 150;
  
  angleFunc: string = 'cos(x * .01) + sin(y * .01)';
  lineToX: string = 'x + cos(angle) * length';
  lineToY: string = 'y + sin(angle) * length';

  //input object with default values
  canvasInputData: CanvasInput = {
    gridSpacing: 20,
    lineWidth: 2,
    lineLength: 2,
    mouseEffect: 'none',
    mouseRadius: 100, 
    colorList: ['rgb(80,80,80)'], 
    animate: false, 
    speed: 10,
    angleFunc: this.angleFunc,
    lineToXFunc: this.lineToX,
    lineToYFunc: this.lineToY
  };

  //function for adding slider number values
  updateValue(newVal: number | string , key: string) {

    if (this.valueIsValid(newVal, key)) {
      this.canvasInputData = { ...this.canvasInputData, [key]: newVal }
    }
  }

  //get mouse effect and update canvas object with it
  updateMouseEffect(event: Event) {  
    const selectedEl = event.target as HTMLInputElement;
    this.mEffect = (selectedEl.innerHTML === 'none') ? false : true;
    this.canvasInputData = { ...this.canvasInputData, mouseEffect: selectedEl.innerHTML }
  }

  //dont allow inputs in number input to be outide of slider range
  private valueIsValid(value: any, key: string) {
    switch(key) {
      case 'gridSpacing':
        return (value >= this.gridSpaceMin && value <= this.gridSpaceMax)
      case 'lineWidth':
        return(value >= this.lineWidthMin && value <= this.lineWidthMax)
      case 'lineLength':
        return(value >= this.lineLengthMin && value <= this.lineLengthMax)
      case 'mouseRadius':
        return(value >= this.mouseRadMin && value <= this.mouseRadMax);
      case 'angleFunc': 
        return true;
      case 'lineToXFunc': 
        return true;
      case 'lineToYFunc':
        return true;  
      case 'speed':
        return (value >=this.speedMin && value <= this.speedMax);    
    }

    return false;
  }

  updateColorList(event: string[]) {
    this.canvasInputData = { ...this.canvasInputData, colorList: event }
  }

  toggleCanvasAnimation() {
    this.animating = !this.animating;
    this.canvasInputData = { ...this.canvasInputData, animate: !this.canvasInputData.animate }
  }
  
}

//walking spider: 
/*{ gridSpacing: 47, lineWidth: 1, lineLength: 1, mouseEffect: "dim", mouseRadius: 163, colorList: (4) […], animate: true, angleFunc: "Math.cos(x * .01) + Math.sin(y * .01)", lineToXFunc: "x + Math.cos(angle) * length * 1000", lineToYFunc: "1*y*length" } */
