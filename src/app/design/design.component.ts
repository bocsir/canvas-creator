import { Component, ViewChild } from '@angular/core';
import { CanvasComponent } from "../canvas/canvas.component";
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { SliderModule } from 'primeng/slider';

@Component({
    selector: 'app-design',
    standalone: true,
    templateUrl: './design.component.html',
    styleUrl: './design.component.css',
    imports: [CanvasComponent, CommonModule, SliderModule, InputTextModule, FormsModule],
})
export class DesignComponent {
  isVisible: boolean = true;

  //input object with default values
  canvasInputData = {
    gridDensity: 50,
    lineWidth: 1
  };

  onValueChange(newVal: number, key: string) {
    if (newVal && this.valueInRange(newVal, key)) this.canvasInputData = { ...this.canvasInputData, [key]: newVal };
  }

//need 2 add error handling to tell user range is wrong if false
  private valueInRange(value: number, key: string) {
    switch(key) {
      case 'gridDensity':
        return (value >= 3 && value <= 150)
      case 'lineWidth':
        return(value >= 0 && value <= 100)

      //...
    }
    return false;
  }
}
