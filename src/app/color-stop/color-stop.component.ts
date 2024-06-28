import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ColorPickerModule } from 'ngx-color-picker';

@Component({
  selector: 'app-color-stop',
  standalone: true,
  imports: [ColorPickerModule, CommonModule],
  templateUrl: './color-stop.component.html',
  styleUrl: './color-stop.component.css'
})
export class ColorStopComponent {
color: any;

colorEls: string[] = []
colorValues: string[] = [];
id: number = 0;

//add to color array
newColorStop() {
  this.colorEls.push(''+this.id);
  this.id++;
}

}