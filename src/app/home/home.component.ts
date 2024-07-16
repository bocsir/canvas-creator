import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CanvasComponent } from '../canvas/canvas.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CanvasInput } from '../canvas-input';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CanvasComponent, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
scrollDown(): void {
  window.scrollTo({top: window.innerHeight, behavior: 'smooth'});
}
  isHovering = false;

  brightenCanvas = false;

  tameWaves: CanvasInput = { 
    angleFunc: "(x * .003) + sin(y * .01)",
    animate: true,
    colorList: [ 'yellow' ], 
    gridSpacing: 20,
    lineLength: 5,
    lineToXFunc: "x + cos(angle) * length * 5",
    lineToYFunc: "y + sin(angle) * length",
    lineWidth: 1,
    mouseEffect: "none",
    mouseRadius: 100,
    speed: 0
  }
  
  allowHoverEvents() {
    this.isHovering = true;
  }

  ignorePointerEvents() {
    this.isHovering = false;
  }


}
