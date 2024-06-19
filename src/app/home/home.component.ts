import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CanvasComponent } from '../canvas/canvas.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CanvasComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  isHovering = false;

  allowHoverEvents() {
    this.isHovering = true;
  }

  ignorePointerEvents() {
    this.isHovering = false;
  }

}
