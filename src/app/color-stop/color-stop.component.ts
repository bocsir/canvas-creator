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

colorEls: {id: number, color: string}[] = []
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
  const tempColorObj = {
    id : this.id++,
    color: 'white',
  }
  this.colorEls.push(tempColorObj);
  this.canAddColors = (this.colorEls.length > 4) ? false : true;

  this.onColorChange.emit(this.colorEls);
}


}