// src/app/features/disenador-plano/engine/core/fabric-wrapper.service.ts
import { Injectable, signal, computed, effect } from '@angular/core';
import * as fabric from 'fabric';
import { GeometryUtils, IPoint } from '../utils/geometry-utils'; // Importar IPoint
import { CollisionSystem } from '../systems/collision-system';
import { EditorFase, EditorMode, MuebleConfig } from '../../models/editor-models';

@Injectable({
  providedIn: 'root'
})
export class FabricWrapperService {
  
  // --- STATE SIGNALS ---
  public canvasReady = signal(false);
  public fase = signal<EditorFase>('A');
  public modo = signal<EditorMode>('IDLE');
  public pixelsPerMeter = signal<number>(50);
  public holguraCm = signal<number>(106);
  
  public paredSeleccionada = signal<{ index: number, longitudPx: number, etiqueta: fabric.IText } | null>(null);
  
  private canvas!: fabric.Canvas;
  private suelo: fabric.Polygon | null = null;
  private etiquetasMedidas: fabric.IText[] = [];
  private muebles: fabric.Group[] = [];
  
  private puntosPared: fabric.Point[] = []; // Aquí sí usamos Point para dibujar
  private lineasGuia: fabric.Line[] = [];

  constructor() {
    effect(() => {
      if (this.fase() === 'B' && this.canvasReady()) {
        this.revalidarColisiones();
      }
    });
  }

  // --- INICIALIZACIÓN ---
  
  public init(canvasEl: HTMLCanvasElement, width: number, height: number) {
    this.canvas = new fabric.Canvas(canvasEl, {
      width,
      height,
      backgroundColor: '#1a1a1a',
      selection: false,
      fireRightClick: true,
      stopContextMenu: true
    });

    this.setupEvents();
    this.canvasReady.set(true);
    console.log('Fabric Engine Iniciado (v6 Compatible)');
  }

  public dispose() {
    if (this.canvas) this.canvas.dispose();
  }

  // --- FASE A: DIBUJO Y CALIBRACIÓN ---

  public setModo(nuevoModo: EditorMode) {
    this.modo.set(nuevoModo);
    if (!this.canvas) return;

    if (nuevoModo === 'PLUMA') {
      this.canvas.defaultCursor = 'crosshair';
      this.canvas.selection = false;
      this.puntosPared = [];
    } else {
      this.canvas.defaultCursor = 'default';
      this.canvas.selection = this.fase() === 'B';
    }
  }

  public addPuntoPared(pointer: fabric.Point) {
    if (this.puntosPared.length > 2) {
      const inicio = this.puntosPared[0];
      // GeometryUtils ahora acepta Point perfectamente
      const dist = GeometryUtils.getDistance(pointer, inicio);
      if (dist < 20) {
        this.cerrarSuelo();
        return;
      }
    }

    this.puntosPared.push(pointer);
    if (this.puntosPared.length > 1) {
      const p1 = this.puntosPared[this.puntosPared.length - 2];
      const line = new fabric.Line([p1.x, p1.y, pointer.x, pointer.y], {
        stroke: '#3b82f6', strokeWidth: 2, selectable: false, evented: false
      });
      this.canvas.add(line);
      this.lineasGuia.push(line);
    }
  }

  private cerrarSuelo() {
    this.lineasGuia.forEach(l => this.canvas.remove(l));
    this.lineasGuia = [];
    
    this.suelo = new fabric.Polygon(this.puntosPared, {
      fill: 'rgba(59, 130, 246, 0.1)',
      stroke: '#3b82f6',
      strokeWidth: 2,
      selectable: true,
      objectCaching: false
    });

    this.canvas.add(this.suelo);
    this.generarEtiquetasMedidas();
    this.setModo('IDLE');
  }

  private generarEtiquetasMedidas() {
    if (!this.suelo) return;
    
    this.etiquetasMedidas.forEach(t => this.canvas.remove(t));
    this.etiquetasMedidas = [];

    // CORRECCIÓN 1: Convertir puntos del polígono (XY) a interfaz compatible
    const points = (this.suelo.points || []) as IPoint[];
    
    for (let i = 0; i < points.length; i++) {
      const p1 = points[i];
      const p2 = points[(i + 1) % points.length];
      
      const distPx = GeometryUtils.getDistance(p1, p2);
      const metros = GeometryUtils.pixelsToMeters(distPx, this.pixelsPerMeter());
      
      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;

      // CORRECCIÓN 2: Tipar 'data' como 'any' para evitar error TS, 
      // ya que la propiedad personalizada no existe en ITextOptions
      const texto = new fabric.IText(`${metros}m`, {
        left: midX, top: midY,
        fontSize: 14, fill: 'white', backgroundColor: 'black',
        originX: 'center', originY: 'center',
        selectable: true
      });

      // Asignar metadata manualmente
      (texto as any).customData = { index: i, longitudPx: distPx };

      texto.on('mousedown', () => {
        if (this.fase() === 'A') {
          // Recuperar metadata
          const meta = (texto as any).customData;
          this.paredSeleccionada.set({ 
             index: meta.index, 
             longitudPx: meta.longitudPx, 
             etiqueta: texto 
          });
        }
      });

      this.etiquetasMedidas.push(texto);
      this.canvas.add(texto);
    }
    this.canvas.requestRenderAll();
  }

  public calibrarEscala(metrosReales: number) {
    const seleccion = this.paredSeleccionada();
    if (!seleccion) return;

    const nuevoPpm = seleccion.longitudPx / metrosReales;
    this.pixelsPerMeter.set(nuevoPpm);
    this.paredSeleccionada.set(null);
    this.generarEtiquetasMedidas();
  }

  public finalizarFaseA() {
    if (!this.suelo) return;
    this.fase.set('B');
    
    this.suelo.set({ selectable: false, evented: false, fill: '#222', stroke: '#444' });
    this.etiquetasMedidas.forEach(t => t.set({ visible: false }));
    this.canvas.discardActiveObject();
    this.canvas.requestRenderAll();
  }

  // --- FASE B: MOBILIARIO ---

  public agregarMueble(config: MuebleConfig) {
    const ppm = this.pixelsPerMeter();
    
    const wPx = GeometryUtils.cmToPixels(config.anchoCm, ppm);
    const hPx = GeometryUtils.cmToPixels(config.largoCm, ppm);
    const holguraPx = GeometryUtils.cmToPixels(this.holguraCm(), ppm);

    let forma: fabric.Object;
    let halo: fabric.Object;

    if (config.tipo === 'rect') {
      forma = new fabric.Rect({ 
        width: wPx, height: hPx, fill: '#4a90e2', originX: 'center', originY: 'center' 
      });
      halo = new fabric.Rect({
        width: wPx + (holguraPx * 2), height: hPx + (holguraPx * 2),
        fill: 'rgba(255,165,0,0.1)', strokeDashArray: [5,5], stroke: 'orange',
        originX: 'center', originY: 'center', visible: true
      });
    } else {
      forma = new fabric.Circle({ 
        radius: wPx / 2, fill: '#4a90e2', originX: 'center', originY: 'center' 
      });
      halo = new fabric.Circle({
        radius: (wPx / 2) + holguraPx,
        fill: 'rgba(255,165,0,0.1)', strokeDashArray: [5,5], stroke: 'orange',
        originX: 'center', originY: 'center', visible: true
      });
    }

    // CORRECCIÓN 3: No pasar 'data' en el constructor. Asignarlo después.
    const grupo = new fabric.Group([halo, forma], {
      left: 100, top: 100,
      subTargetCheck: true,
    });

    // Inyección de propiedad personalizada
    (grupo as any).data = config;

    this.muebles.push(grupo);
    this.canvas.add(grupo);
    this.canvas.setActiveObject(grupo);
    this.revalidarColisiones();
  }

  private revalidarColisiones() {
    const resultado = CollisionSystem.validarPosiciones(this.muebles);
    this.canvas.requestRenderAll();
  }

  // --- EVENTOS INTERNOS ---
  
  private setupEvents() {
    this.canvas.on('mouse:down', (opt) => {
      if (this.fase() === 'A' && this.modo() === 'PLUMA') {
        const pointer = this.canvas.getScenePoint(opt.e);
        this.addPuntoPared(pointer);
      }
    });

    this.canvas.on('object:moving', (opt) => {
      if (this.fase() === 'B') {
        const obj = opt.target;
        if (obj && this.suelo && this.suelo.points) {
            const center = obj.getCenterPoint();
            // Cast points a IPoint[] para GeometryUtils
            const polygonPoints = this.suelo.points as IPoint[];
            
            if (!GeometryUtils.isPointInPolygon(center, polygonPoints)) {
                obj.set('opacity', 0.5); 
            } else {
                obj.set('opacity', 1);
            }
        }
        this.revalidarColisiones();
      }
    });
  }
}