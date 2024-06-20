import { Component, ViewChild } from '@angular/core';
import { CanvasComponent } from "../canvas/canvas.component";
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-design',
    standalone: true,
    templateUrl: './design.component.html',
    styleUrl: './design.component.css',
    imports: [CanvasComponent, CommonModule],
})
export class DesignComponent {
  isVisible: boolean = true;
}
