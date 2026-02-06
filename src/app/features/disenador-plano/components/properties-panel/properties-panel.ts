import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EditorFase } from '../../models/editor-models';

@Component({
  selector: 'app-properties-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './properties-panel.html',
  styleUrl: './properties-panel.scss'
})
export class PropertiesPanelComponent implements OnChanges {
  @Input() fase: EditorFase = 'A';
  
  // Datos de calibración (Fase A)
  @Input() paredSeleccionada: { index: number, longitudPx: number } | null = null;
  
  // Datos de configuración (Fase B)
  @Input() holguraCm: number = 106;

  @Output() calibrar = new EventEmitter<number>();
  @Output() holguraChange = new EventEmitter<number>();
  @Output() cerrar = new EventEmitter<void>();

  // Variables locales para el formulario
  inputMetros: number | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    // Si cambia la pared seleccionada, reseteamos el input
    if (changes['paredSeleccionada'] && this.paredSeleccionada) {
      this.inputMetros = null; 
    }
  }

  onCalibrar() {
    if (this.inputMetros && this.inputMetros > 0) {
      this.calibrar.emit(this.inputMetros);
      this.inputMetros = null;
    }
  }

  onHolguraChangeEvt(event: any) {
    const valor = parseFloat(event.detail.value);
    if (!isNaN(valor)) {
      this.holguraChange.emit(valor);
    }
  }
}