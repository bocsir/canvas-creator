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

  canvasInputData = {
    gridDensity: 50
  };

  onValueChange(newVal: number, key: string) {
    this.canvasInputData = { ...this.canvasInputData, [key]: newVal };
  }

}
