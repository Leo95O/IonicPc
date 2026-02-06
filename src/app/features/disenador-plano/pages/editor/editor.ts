import { Component, OnInit, AfterViewInit, OnDestroy, signal, ViewChild, ElementRef, effect } from '@angular/core';
import * as fabric from 'fabric'; // <--- IMPORTACIÓN CORRECTA PARA V6
import { PlanoApiService } from '../../services/plano-api.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-editor-plano',
  templateUrl: './editor.html',
  styleUrls: ['./editor.scss'],
  standalone: false
})
export class EditorPage implements OnInit, AfterViewInit, OnDestroy {
  
  @ViewChild('canvasContainer') canvasContainer!: ElementRef;
  
  private canvas!: fabric.Canvas;
  modo = signal<'select' | 'pared'>('select');
  nombreLocal = signal('');
  
  // Variables temporales para paredes
  private puntosPared: {x: number, y: number}[] = [];
  private lineasTemp: any[] = [];
  private lineaActiva: any | null = null;
  private circulosGuia: any[] = [];

  constructor(
    private apiService: PlanoApiService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private route: ActivatedRoute,
    private router: Router
  ) {
    effect(() => {
      if (this.canvas) {
        const esSelect = this.modo() === 'select';
        this.canvas.selection = esSelect;
        this.canvas.defaultCursor = esSelect ? 'default' : 'crosshair';
        this.canvas.forEachObject(o => {
          o.selectable = esSelect;
          o.evented = esSelect;
        });
        this.canvas.requestRenderAll();
      }
    });
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.iniciarCanvas();
    this.configurarEventos();
    new ResizeObserver(() => this.ajustarCanvas()).observe(this.canvasContainer.nativeElement);
  }

  ngOnDestroy() {
    if (this.canvas) this.canvas.dispose();
  }

  private iniciarCanvas() {
    const el = this.canvasContainer.nativeElement;
    this.canvas = new fabric.Canvas('fabric-canvas', {
      width: el.clientWidth,
      height: el.clientHeight,
      backgroundColor: 'transparent', // <--- Asignación directa (Fix v6)
      preserveObjectStacking: true,
      selection: true
    });
  }

  private ajustarCanvas() {
    if (!this.canvas) return;
    const el = this.canvasContainer.nativeElement;
    this.canvas.setDimensions({ width: el.clientWidth, height: el.clientHeight });
  }

  setModo(nuevoModo: 'select' | 'pared') {
    this.modo.set(nuevoModo);
    if (nuevoModo === 'select') {
      this.limpiarTemporalesPared();
    }
  }

  // --- EVENTOS (ADAPTADOS A V6) ---
  private configurarEventos() {
    // Usamos 'any' en el evento para evitar conflictos de tipos estrictos temporales
    this.canvas.on('mouse:down', (opt: any) => {
      if (this.modo() === 'pared') this.onClickPared(opt);
    });

    this.canvas.on('mouse:move', (opt: any) => {
      if (this.modo() === 'pared') this.onMovePared(opt);
    });
  }

  private onClickPared(opt: any) {
    // CAMBIO V6: getPointer() ya no existe. Usamos scenePoint del evento.
    const pointer = opt.scenePoint; 
    if (!pointer) return;
    
    const x = pointer.x;
    const y = pointer.y;

    if (this.puntosPared.length === 0) {
      this.puntosPared.push({ x, y });
      
      const circle = new fabric.Circle({
        left: x, top: y, radius: 5, fill: '#22c55e', 
        originX: 'center', originY: 'center', 
        selectable: false, evented: false,
        stroke: 'white', strokeWidth: 2
      });
      this.canvas.add(circle);
      this.circulosGuia.push(circle);
    } else {
      this.puntosPared.push({ x, y });
      
      const inicio = this.puntosPared[0];
      const dist = Math.sqrt(Math.pow(x - inicio.x, 2) + Math.pow(y - inicio.y, 2));
      
      if (this.puntosPared.length > 2 && dist < 20) {
        this.finalizarPared(true);
        return;
      }
    }

    const newLine = new fabric.Line([x, y, x, y], {
      strokeWidth: 4, stroke: '#64748b', strokeDashArray: [5, 5],
      selectable: false, evented: false, originX: 'center', originY: 'center'
    });
    this.lineaActiva = newLine;
    this.canvas.add(newLine);
    this.lineasTemp.push(newLine);
  }

  private onMovePared(opt: any) {
    if (this.lineaActiva) {
      const pointer = opt.scenePoint;
      if (!pointer) return;
      
      this.lineaActiva.set({ x2: pointer.x, y2: pointer.y });
      this.canvas.requestRenderAll();
    }
  }

  private finalizarPared(cerrada: boolean) {
    this.limpiarTemporalesPared();

    if (this.puntosPared.length < 3) return;

    if (cerrada) {
      const pared = new fabric.Polygon(this.puntosPared, {
        fill: '#f1f5f9', stroke: '#334155', strokeWidth: 6,
        selectable: true, objectCaching: false,
        cornerColor: 'blue', cornerStyle: 'circle'
      });

      (pared as any).id = crypto.randomUUID();
      (pared as any).tipo = 'estructura';

      this.canvas.add(pared);
      // CAMBIO V6: sendToBack() eliminado. Usamos moveObjectTo(obj, index)
      this.canvas.moveObjectTo(pared, 0); 
    }
    
    this.puntosPared = [];
    this.setModo('select');
  }

  private limpiarTemporalesPared() {
    this.lineasTemp.forEach(obj => this.canvas.remove(obj));
    this.circulosGuia.forEach(obj => this.canvas.remove(obj));
    this.lineasTemp = [];
    this.circulosGuia = [];
    this.lineaActiva = null;
  }

  // --- MOBILIARIO ---
  agregarMueble(tipo: 'rect' | 'circle') {
    let mueble;
    const id = crypto.randomUUID();
    
    // Opciones base
    const opts: any = { 
      left: 100 + (Math.random() * 50),
      top: 100 + (Math.random() * 50),
      fill: 'white',
      stroke: '#334155',
      strokeWidth: 1,
      cornerSize: 8,
      transparentCorners: false
    };

    // CAMBIO V6: Shadow ahora es una clase, no un objeto plano
    opts.shadow = new fabric.Shadow({ color: 'rgba(0,0,0,0.15)', blur: 10, offsetX: 5, offsetY: 5 });

    if (tipo === 'rect') {
      mueble = new fabric.Rect({ ...opts, width: 80, height: 80, rx: 4, ry: 4 });
    } else {
      mueble = new fabric.Circle({ ...opts, radius: 40 });
    }

    (mueble as any).id = id;
    (mueble as any).tipo = 'mueble';
    (mueble as any).tipoForma = tipo;

    this.canvas.add(mueble);
    this.canvas.setActiveObject(mueble);
    this.setModo('select');
  }

  limpiarLienzo() {
    this.canvas.clear();
    // CAMBIO V6: Asignación directa
    this.canvas.backgroundColor = 'transparent'; 
    this.canvas.requestRenderAll();
    this.puntosPared = [];
    this.limpiarTemporalesPared();
  }

  async guardar() {
    const loading = await this.loadingCtrl.create({ message: 'Guardando...' });
    await loading.present();

    try {
      if (!this.nombreLocal()) {
         this.nombreLocal.set('Nuevo Plano ' + new Date().toLocaleDateString());
      }

      // CAMBIO V6: toJSON() no acepta argumentos. Usamos toObject() para incluir propiedades custom.
      const jsonObj = this.canvas.toObject(['id', 'tipo', 'tipoForma']);
      
      const idExistente = this.route.snapshot.paramMap.get('id');
      const idEnvio = (idExistente && idExistente !== 'nuevo') ? idExistente : undefined;

      this.apiService.guardarPlano(this.nombreLocal(), jsonObj, idEnvio).subscribe({
        next: async () => {
          await loading.dismiss();
          const alert = await this.alertCtrl.create({ header: 'Éxito', message: 'Plano guardado', buttons: ['OK'] });
          await alert.present();
        },
        error: async (err) => {
          await loading.dismiss();
          console.error(err);
        }
      });

    } catch (e) {
      await loading.dismiss();
    }
  }
}