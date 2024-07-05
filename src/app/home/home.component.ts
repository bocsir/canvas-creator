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

  tameWaves: CanvasInput = { angleFunc: "(x * .001) + Math.sin(y * .01)",
    animate: true,
    colorList: [ "rgba(217,35,220,1)", "rgba(255,255,51,1)", "rgba(39,19,173,1)" ], 
    gridSpacing: 14,
    lineLength: 19,
    lineToXFunc: "x + Math.cos(angle) * length * 5",
    lineToYFunc: "y + Math.sin(angle) * length",
    lineWidth: 1,
    mouseEffect: "none",
    mouseRadius: 100,
    speed: 25
  }
  
  allowHoverEvents() {
    this.isHovering = true;
  }

  ignorePointerEvents() {
    this.isHovering = false;
  }


}
