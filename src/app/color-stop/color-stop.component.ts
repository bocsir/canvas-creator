import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { ColorPickerModule } from 'ngx-color-picker';

@Component({
  selector: 'app-color-stop',
  standalone: true,
  imports: [ColorPickerModule, CommonModule],
  templateUrl: './color-stop.component.html',
  styleUrl: './color-stop.component.css'
})
export class ColorStopComponent {
@Output() onColorChange = new EventEmitter<any>();

canAddColors: boolean = true;

colorEls: string[] = []
colorValues: string[] = [];
id: number = 0;

removeColorStop(inputEl: HTMLInputElement, index: number) {
  this.colorEls.splice(index, 1);
  console.log(this.colorEls);
  this.canAddColors = true;

  this.onColorChange.emit(this.colorEls);
}

//add to color array
newColorStop() {
  //hide color add button if 5 colors 
  this.canAddColors = (this.colorEls.length > 2) ? false : true;

  this.colorEls.push('white');
  this.onColorChange.emit(this.colorEls);
}


}