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


  newColorStop() {

  }

  isVisible: boolean = true;  

  //input object with default values
  canvasInputData: CanvasInput = {
    gridSpacing: 20,
    lineWidth: 2,
    lineLength: 20,
    mouseEffect: 'none',
    mouseRadius: 100
  };

  updateMouseEffect(event: Event) {
    const selectedEl = event.target as HTMLInputElement;
    this.canvasInputData = { ...this.canvasInputData, mouseEffect: selectedEl.innerHTML }
  }


  //function for adding slider number values
  updateValue(newVal: number, key: string) {
    if (newVal && this.valueInRange(newVal, key)) this.canvasInputData = { ...this.canvasInputData, [key]: newVal };
  }

  //dont allow inputs in number input to be outide of slider range
  private valueInRange(value: number, key: string) {
    switch(key) {
      case 'gridSpacing':
        return (value >= 4 && value <= 300)
      case 'lineWidth':
        return(value >= 1 && value <= 200)
      case 'lineLenth':
        return(value >= 1 && value <= 200)
      case 'mouseRadius':
        return(value >= 20 && value <= 500);
      //...
    }
    return false;
  }
}
