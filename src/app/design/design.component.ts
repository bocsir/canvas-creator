import { Component } from '@angular/core';
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
  menuVisible: boolean = true;  

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
  

  //input object with default values
  canvasInputData: CanvasInput = {
    gridSpacing: 20,
    lineWidth: 2,
    lineLength: 20,
    mouseEffect: 'none',
    mouseRadius: 100, 
    colorList: [], 
    animate: false
  };

  //function for adding slider number values
  updateValue(newVal: number, key: string) {
    if (newVal && this.valueInRange(newVal, key)) this.canvasInputData = { ...this.canvasInputData, [key]: newVal };
  }

  updateMouseEffect(event: Event) {
    
    const selectedEl = event.target as HTMLInputElement;
 
    this.mEffect = (selectedEl.innerHTML === 'none') ? false : true;

    this.canvasInputData = { ...this.canvasInputData, mouseEffect: selectedEl.innerHTML }
  }
  //dont allow inputs in number input to be outide of slider range
  private valueInRange(value: number, key: string) {
    switch(key) {
      case 'gridSpacing':
        return (value >= this.gridSpaceMin && value <= this.gridSpaceMax)
      case 'lineWidth':
        return(value >= this.lineWidthMin && value <= this.lineWidthMax)
      case 'lineLength':
        return(value >= this.lineLengthMin && value <= this.lineLengthMax)
      case 'mouseRadius':
        return(value >= this.mouseRadMin && value <= this.mouseRadMax);
      
    }
    return false;
  }

  updateColorList(event: string[]) {
    this.canvasInputData = { ...this.canvasInputData, colorList: event }
  }

  toggleCanvasAnimation() {
    this.canvasInputData = { ...this.canvasInputData, animate: !this.canvasInputData.animate }
  }
}
