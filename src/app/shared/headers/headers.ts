import { Component } from '@angular/core';
import { EventEmitter} from '@angular/core';
import { Output } from '@angular/core';

@Component({
  selector: 'app-headers',
  standalone: false,
  templateUrl: './headers.html',
  styleUrl: './headers.scss',
})
export class Headers {
  @Output() toggleSidebar = new EventEmitter<void>();

  constructor() {}

  // Función que se llama al dar click al botón de menú
  onMenuClick() {
    this.toggleSidebar.emit();
  }

}
