import { Component, ElementRef, OnInit, OnDestroy, ViewChild, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';

// Importamos el MOTOR (que ya corregimos) y los Componentes UI
import { FabricWrapperService } from '../../engine/core/fabric-wrapper.service';
import { PlanoApiService } from '../../services/plano-api.service';
import { ToolsSidebarComponent } from '../../components/tools-sidebar/tools-sidebar';
import { PropertiesPanelComponent } from '../../components/properties-panel/properties-panel';
import { EditorMode } from '../../models/editor-models';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [
    CommonModule, 
    IonicModule, 
    FormsModule, 
    ToolsSidebarComponent, 
    PropertiesPanelComponent
  ],
  templateUrl: './editor.html',
  styleUrls: ['./editor.scss']
})
export class EditorPage implements OnInit, OnDestroy {
  @ViewChild('canvasContainer') canvasContainer!: ElementRef<HTMLDivElement>;

  // Inyectamos el motor inteligente
  public engine = inject(FabricWrapperService);
  private apiService = inject(PlanoApiService);
  
  // Servicios de UI de Ionic
  private alertCtrl = inject(AlertController);
  private toastCtrl = inject(ToastController);

  // Exponemos los Signals del motor para que el HTML los lea
  // (Sin lógica compleja aquí, solo pasamanos)
  fase = this.engine.fase;
  modo = this.engine.modo;
  ppm = this.engine.pixelsPerMeter;
  holguraCm = this.engine.holguraCm;
  paredSeleccionada = this.engine.paredSeleccionada;

  ngOnInit() {
    // Esperamos un momento a que el DIV exista para iniciar Fabric
    setTimeout(() => {
      if (this.canvasContainer) {
        const el = document.getElementById('canvas-editor') as HTMLCanvasElement;
        const w = this.canvasContainer.nativeElement.clientWidth;
        const h = this.canvasContainer.nativeElement.clientHeight;
        
        // Iniciamos el motor
        this.engine.init(el, w, h);
      }
    }, 100);
  }

  ngOnDestroy() {
    this.engine.dispose();
  }

  // --- EVENTOS QUE VIENEN DEL SIDEBAR (UI) ---

  onSetModo(modo: EditorMode) {
    this.engine.setModo(modo);
  }

  onFinalizarFaseA() {
    this.engine.finalizarFaseA();
    this.mostrarToast('Estructura bloqueada. Fase de Amueblado iniciada.', 'success');
  }

  onGuardar() {
    // Simulamos guardado
    this.mostrarToast('Guardando proyecto...', 'primary');
    // Aquí llamarías a this.apiService.guardarPlano(...)
    setTimeout(() => {
        this.mostrarToast('Proyecto guardado exitosamente.', 'success');
    }, 1000);
  }

  // --- EVENTOS QUE VIENEN DEL PANEL DE PROPIEDADES ---

  onCalibrarPared(metros: number) {
    this.engine.calibrarEscala(metros);
    this.mostrarToast(`Escala calibrada: 1m = ${this.engine.pixelsPerMeter().toFixed(1)}px`);
  }

  onHolguraChange(cm: number) {
    this.engine.holguraCm.set(cm);
  }

  onCerrarPanel() {
    this.engine.paredSeleccionada.set(null);
  }

  // --- CREACIÓN DE MUEBLES (Diálogos UI) ---

  async onAddMueble(tipo: 'rect' | 'circle') {
    const alert = await this.alertCtrl.create({
      header: tipo === 'rect' ? 'Nueva Mesa Rectangular' : 'Nueva Mesa Circular',
      inputs: tipo === 'rect' 
        ? [
            { name: 'ancho', type: 'number', placeholder: 'Ancho (cm)', value: '80' },
            { name: 'largo', type: 'number', placeholder: 'Largo (cm)', value: '80' }
          ]
        : [
            { name: 'diametro', type: 'number', placeholder: 'Diámetro (cm)', value: '80' }
          ],
      buttons: [
        'Cancelar',
        {
          text: 'Crear',
          handler: (data) => {
            const w = parseFloat(tipo === 'rect' ? data.ancho : data.diametro);
            const h = parseFloat(tipo === 'rect' ? data.largo : data.diametro);
            
            if (w > 0 && h > 0) {
              // Delegamos la lógica difícil al Engine
              this.engine.agregarMueble({
                id: crypto.randomUUID(),
                tipo,
                nombre: 'Mesa',
                anchoCm: w,
                largoCm: h
              });
            }
          }
        }
      ]
    });
    await alert.present();
  }

  private async mostrarToast(msg: string, color: 'primary' | 'success' | 'danger' = 'primary') {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    toast.present();
  }
}