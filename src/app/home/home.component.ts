import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CanvasComponent } from '../canvas/canvas.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

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

  allowHoverEvents() {
    this.isHovering = true;
  }

  ignorePointerEvents() {
    this.isHovering = false;
  }

}
