import { Component, OnInit, signal, computed, effect } from '@angular/core'; // <--- IMPORTANTE
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

// Modelos
import { Punto, TipoRestaurante } from '../../../../core/models/diseno-plano.model';
import { ItemMapa } from '../../../../core/models/item-mapa.model';

// Servicios
import { GeometriaService } from '../../../../core/services/geometria.service';
import { PlanoApiService } from '../../services/plano-api.service';
import { PlanoStateService } from '../../services/plano-state.service';

// --- DECORADOR OBLIGATORIO ---
@Component({
  selector: 'app-editor-plano',
  templateUrl: './editor.html',
  styleUrls: ['./editor.scss'],
  standalone: false // Necesario porque usas NgModules
})
export class EditorPage implements OnInit {
  
  // 1. ESTADO GLOBAL
  pasoActual = signal<number>(1);
  nombreLocal = signal<string>('');
  tipoRestaurante = signal<TipoRestaurante>(TipoRestaurante.FAMILIAR);
  escala = signal<number>(40);
  distSeguridad = signal<number>(61);

  // 2. DATOS DEL PLANO
  vertices = signal<Punto[]>([]);
  items = signal<ItemMapa[]>([]);

  // 3. ESTADOS TRANSITORIOS
  puntosTemp = signal<Punto[]>([]); 
  cursorPos = signal<Punto | null>(null);
  itemActual = signal<ItemMapa | null>(null);
  itemRotando = signal<ItemMapa | null>(null);
  modoUnion = signal<boolean>(false);

  // 4. COMPUTADOS
  puntosSVG = computed(() => {
    const source = this.pasoActual() === 1 ? this.puntosTemp() : this.vertices();
    return source.map(p => `${p.x * this.escala()},${p.y * this.escala()}`).join(' ');
  });

  viewBox = computed(() => `0 0 1200 800`);

  lineaGuia = computed(() => {
    const pts = this.puntosTemp();
    const cursor = this.cursorPos();
    if (pts.length === 0 || !cursor) return null;
    const ultimo = pts[pts.length - 1];
    return {
      x1: ultimo.x * this.escala(), y1: ultimo.y * this.escala(),
      x2: cursor.x * this.escala(), y2: cursor.y * this.escala()
    };
  });

  constructor(
    private geoService: GeometriaService,
    private apiService: PlanoApiService,
    private stateService: PlanoStateService,
    private route: ActivatedRoute,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'nuevo') {
      this.cargarPlanoExistente(id);
    } else {
      this.iniciarDibujo();
    }
  }

  // --- LOGICA DE CARGA ---
  async cargarPlanoExistente(id: string) {
    const loading = await this.loadingCtrl.create({ message: 'Cargando plano...' });
    await loading.present();

    this.apiService.obtenerPlano(id).subscribe({
      next: (data) => {
        this.nombreLocal.set(data.nombre);
        this.vertices.set(data.configuracion.vertices || []);
        this.items.set(data.configuracion.items || []);
        if (data.configuracion.tipo) this.tipoRestaurante.set(data.configuracion.tipo);
        
        if (this.vertices().length > 2) {
            this.pasoActual.set(2);
        } else {
            this.iniciarDibujo();
        }
        loading.dismiss();
      },
      error: async (err) => {
        loading.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Error', message: 'No se pudo cargar el plano.', buttons: ['Volver']
        });
        await alert.present();
        this.router.navigate(['/features/disenador']);
      }
    });
  }

  // --- LOGICA DE DIBUJO ---
  iniciarDibujo() {
    this.pasoActual.set(1);
    this.vertices.set([]);
    this.items.set([]);
    this.puntosTemp.set([]);
  }

  onCanvasClick(ev: PointerEvent) {
    if (this.pasoActual() !== 1) return;
    const coords = this.obtenerCoordsMetros(ev);
    if (this.puntosTemp().length > 2 && this.esCierrePoligono(coords)) {
      this.finalizarDibujo();
      return;
    }
    this.puntosTemp.update(pts => [...pts, coords]);
  }

  private esCierrePoligono(p: Punto): boolean {
    const inicio = this.puntosTemp()[0];
    if (!inicio) return false;
    const dist = Math.sqrt(Math.pow(p.x - inicio.x, 2) + Math.pow(p.y - inicio.y, 2));
    return (dist * this.escala()) < 20; 
  }

  finalizarDibujo() {
    this.vertices.set([...this.puntosTemp()]);
    this.pasoActual.set(2);
    this.puntosTemp.set([]);
    this.cursorPos.set(null);
  }

  // --- LOGICA DE EDICION (MESA) ---
  onPointerDown(ev: PointerEvent, item: ItemMapa, esRotacion: boolean = false) {
    if (this.pasoActual() !== 2) return;
    (ev.target as HTMLElement).setPointerCapture(ev.pointerId);
    if (esRotacion) this.itemRotando.set(item);
    else this.itemActual.set(item);
    ev.stopPropagation();
  }

  onPointerMove(ev: PointerEvent) {
    if (this.pasoActual() === 1) {
      this.cursorPos.set(this.obtenerCoordsMetros(ev));
      return;
    }
    if (this.itemRotando()) {
      this.procesarRotacion(ev);
      return;
    }
    const item = this.itemActual();
    if (!item) return;

    const deltaX = ev.movementX / this.escala();
    const deltaY = ev.movementY / this.escala();
    let nuevaX = item.transform.x + deltaX;
    let nuevaY = item.transform.y + deltaY;

    const candidato: ItemMapa = { ...item, transform: { ...item.transform, x: nuevaX, y: nuevaY } };
    const estaDentro = this.geoService.estaDentroDelPlano(candidato, this.vertices());
    const hayChoque = this.hayColisionFisica(candidato);

    if (estaDentro && !hayChoque) {
      this.actualizarPosicionItem(candidato);
    }
  }

  onPointerUp() {
    this.itemActual.set(null);
    this.itemRotando.set(null);
  }

  private procesarRotacion(ev: PointerEvent) {
    const item = this.itemRotando();
    if (!item) return;
    const svgElement = ev.currentTarget as SVGElement; 
    const svgRect = svgElement.getBoundingClientRect();
    const centroX = (item.transform.x * this.escala()) + svgRect.left;
    const centroY = (item.transform.y * this.escala()) + svgRect.top;
    const angle = Math.atan2(ev.clientY - centroY, ev.clientX - centroX) * (180 / Math.PI);
    this.actualizarPosicionItem({ ...item, transform: { ...item.transform, rotacion: angle } });
  }

  private hayColisionFisica(candidato: ItemMapa): boolean {
    return this.items().some(other => other.id !== candidato.id && this.geoService.hayColision(candidato, other, 0));
  }

  agregarMesa(tipo: 'circular' | 'rectangular') {
    const nuevaMesa: ItemMapa = {
      id: crypto.randomUUID(),
      tipo,
      esFijo: false,
      dimensiones: { ancho: 80, largo: tipo === 'rectangular' ? 120 : undefined },
      transform: { x: 2, y: 2, rotacion: 0 }
    };
    this.items.update(prev => [...prev, nuevaMesa]);
  }

  private actualizarPosicionItem(itemEditado: ItemMapa) {
    this.items.update(list => list.map(i => i.id === itemEditado.id ? itemEditado : i));
  }

  // --- PERSISTENCIA ---
  async guardarProyecto() {
    if (this.vertices().length < 3) {
      this.mostrarAlerta('Error', 'Debes dibujar el plano primero.');
      return;
    }
    if (!this.nombreLocal()) {
      const alert = await this.alertCtrl.create({
        header: 'Guardar Plano',
        inputs: [{ name: 'nombre', type: 'text', placeholder: 'Nombre del local' }],
        buttons: [
          { text: 'Cancelar', role: 'cancel' },
          { text: 'Guardar', handler: (data) => { if (data.nombre) { this.nombreLocal.set(data.nombre); this.ejecutarGuardado(); } } }
        ]
      });
      await alert.present();
    } else {
      this.ejecutarGuardado();
    }
  }

  private async ejecutarGuardado() {
    const loading = await this.loadingCtrl.create({ message: 'Guardando...' });
    await loading.present();
    const idExistente = this.route.snapshot.paramMap.get('id');
    const idParaEnviar = (idExistente && idExistente !== 'nuevo') ? idExistente : undefined;

    this.apiService.guardarPlano(this.nombreLocal(), this.vertices(), this.items(), idParaEnviar).subscribe({
      next: async (res) => {
        await loading.dismiss();
        this.mostrarAlerta('Éxito', 'Plano guardado.', () => this.router.navigate(['/features/disenador']));
      },
      error: async (err) => { await loading.dismiss(); this.mostrarAlerta('Error', 'No se pudo conectar.'); }
    });
  }

  // --- HELPERS ---
  private obtenerCoordsMetros(ev: PointerEvent): Punto {
    const svg = (ev.currentTarget as Element).closest('svg'); 
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = ev.clientX; pt.y = ev.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()!.inverse());
    return { x: svgP.x / this.escala(), y: svgP.y / this.escala() };
  }

  private async mostrarAlerta(header: string, message: string, onDismiss?: () => void) {
    const alert = await this.alertCtrl.create({ header, message, buttons: [{ text: 'OK', handler: onDismiss }] });
    await alert.present();
  }

  getTransform(item: ItemMapa) {
    const x = item.transform.x * this.escala();
    const y = item.transform.y * this.escala();
    return `translate(${x}, ${y}) rotate(${item.transform.rotacion})`;
  }

  getMetrosEnPixels(cm: number) { return (cm / 100) * this.escala(); }
  getOffsetSeguridad(dimensionCm: number) { return this.getMetrosEnPixels(-(dimensionCm + this.distSeguridad()) / 2); }
}