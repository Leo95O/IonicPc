// src/app/features/disenador-plano/components/tools-sidebar/tools-sidebar.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { EditorFase, EditorMode } from '../../models/editor-models';

@Component({
  selector: 'app-tools-sidebar',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './tools-sidebar.html',
  styleUrl: './tools-sidebar.scss'
})
export class ToolsSidebarComponent {
  @Input() fase: EditorFase = 'A';
  @Input() modo: EditorMode = 'IDLE';
  @Input() ppm: number = 50;

  @Output() setModo = new EventEmitter<EditorMode>();
  @Output() finalizarFaseA = new EventEmitter<void>();
  @Output() addMueble = new EventEmitter<'rect' | 'circle'>();
  @Output() guardar = new EventEmitter<void>();

  // Helpers para la vista
  get isFaseA() { return this.fase === 'A'; }
  get isFaseB() { return this.fase === 'B'; }

  onPlumaClick() {
    this.setModo.emit('PLUMA');
  }

  onMuebleClick(tipo: 'rect' | 'circle') {
    this.addMueble.emit(tipo);
  }
}