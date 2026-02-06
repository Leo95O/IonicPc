import { Component, signal, computed } from '@angular/core';
import { Punto, TipoRestaurante } from '../../../../core/models/diseno-plano.model';
import { ItemMapa } from '../../../../core/models/item-mapa.model';
import { GeometriaService } from '../../../../core/services/geometria.service';

@Component({
  selector: 'app-editor-plano',
  templateUrl: './editor.html',
  styleUrls: ['./editor.scss'],
  standalone: false
})
export class EditorPage {
  // Estado del plano y objetos
  vertices = signal<Punto[]>([{ x: 0, y: 0 }, { x: 12, y: 0 }, { x: 12, y: 8 }, { x: 0, y: 8 }]);
  items = signal<ItemMapa[]>([]);
  
  // Estado de interacción
  itemActual = signal<ItemMapa | null>(null);
  itemRotando = signal<ItemMapa | null>(null);
  modoUnion = signal<boolean>(false);
  
  // Configuración
  distSeguridad = signal<number>(61); // cm (según tabla)
  escala = signal<number>(50); // 50px = 1 metro

  // Computado para el dibujo del local
  puntosSVG = computed(() => 
    this.vertices().map(p => `${p.x * this.escala()},${p.y * this.escala()}`).join(' ')
  );

  viewBox = computed(() => `0 0 1000 800`);

  constructor(private geoService: GeometriaService) {}

  onPointerDown(ev: PointerEvent, item: ItemMapa, esRotacion: boolean = false) {
    (ev.target as HTMLElement).setPointerCapture(ev.pointerId);
    if (esRotacion) {
      this.itemRotando.set(item);
    } else {
      this.itemActual.set(item);
    }
    ev.stopPropagation();
  }

  onPointerMove(ev: PointerEvent) {
    // 1. Manejar Rotación
    if (this.itemRotando()) {
      this.procesarRotacion(ev);
      return;
    }

    // 2. Manejar Movimiento
    const item = this.itemActual();
    if (!item) return;

    const deltaX = ev.movementX / this.escala();
    const deltaY = ev.movementY / this.escala();

    const candidato: ItemMapa = {
      ...item,
      transform: { 
        ...item.transform, 
        x: item.transform.x + deltaX, 
        y: item.transform.y + deltaY 
      }
    };

    // Validación de Regla de Oro: Dentro del plano y sin superposición real
    const estaDentro = this.geoService.estaDentroDelPlano(candidato, this.vertices());
    const hayChoqueFisico = this.items().some(other => 
      other.id !== item.id && this.geoService.hayColision(candidato, other, 0)
    );

    if (estaDentro && !hayChoqueFisico) {
      this.actualizarPosicionItem(candidato);
    }
  }

  private procesarRotacion(ev: PointerEvent) {
    const item = this.itemRotando();
    if (!item) return;
    
    const svgElement = ev.currentTarget as SVGElement;
    const rect = svgElement.getBoundingClientRect();
    
    const centroX = item.transform.x * this.escala() + rect.left;
    const centroY = item.transform.y * this.escala() + rect.top;
    
    const angle = Math.atan2(ev.clientY - centroY, ev.clientX - centroX) * (180 / Math.PI);
    
    this.actualizarPosicionItem({
      ...item,
      transform: { ...item.transform, rotacion: angle }
    });
  }

  onPointerUp() {
    this.itemActual.set(null);
    this.itemRotando.set(null);
  }

  // Helpers de Renderizado
  getTransform(item: ItemMapa) {
    const x = item.transform.x * this.escala();
    const y = item.transform.y * this.escala();
    return `translate(${x}, ${y}) rotate(${item.transform.rotacion})`;
  }

  getMetrosEnPixels(cm: number) {
    return (cm / 100) * this.escala();
  }

  getOffsetSeguridad(dimensionCm: number) {
    return this.getMetrosEnPixels(-(dimensionCm + this.distSeguridad()) / 2);
  }

  private actualizarPosicionItem(itemEditado: ItemMapa) {
    this.items.update(list => list.map(i => i.id === itemEditado.id ? itemEditado : i));
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
}