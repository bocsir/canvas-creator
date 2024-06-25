import { Component, ViewChild } from '@angular/core';
import { CanvasComponent } from "../canvas/canvas.component";
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { SliderModule } from 'primeng/slider';
import { ColorPickerModule } from 'ngx-color-picker';

@Component({
    selector: 'app-design',
    standalone: true,
    templateUrl: './design.component.html',
    styleUrl: './design.component.scss',
    imports: [CanvasComponent, CommonModule, SliderModule, InputTextModule, FormsModule, ColorPickerModule],
})
export class DesignComponent {
  isVisible: boolean = true;
  color: any;
  

  minimizeSidebar() {
    this.isVisible = !this.isVisible;
  }

  //input object with default values
  canvasInputData = {
    gridSpacing: 50,
    lineWidth: 1
  };

  onValueChange(newVal: number, key: string) {
    if (newVal && this.valueInRange(newVal, key)) this.canvasInputData = { ...this.canvasInputData, [key]: newVal };
  }

//need 2 add error handling to tell user range is wrong if false
  private valueInRange(value: number, key: string) {
    switch(key) {
      case 'gridSpacing':
        return (value >= 3 && value <= 150)
      case 'lineWidth':
        return(value >= 0 && value <= 100)

      //...
    }
    return false;
  }
}
