import { Injectable, signal, computed } from '@angular/core';
import { Punto } from '../../../core/models/diseno-plano.model';
import { ItemMapa } from '../../../core/models/item-mapa.model';

@Injectable({
  providedIn: 'root'
})
export class PlanoStateService {
  // Estado reactivo con Signals
  private _vertices = signal<Punto[]>([]);
  private _items = signal<ItemMapa[]>([]);
  private _nombre = signal<string>('Nuevo Local');

  // Exponer como lectura
  readonly vertices = this._vertices.asReadonly();
  readonly items = this._items.asReadonly();
  readonly nombre = this._nombre.asReadonly();

  // Acciones
  actualizarPlano(vertices: Punto[], items: ItemMapa[]) {
    this._vertices.set(vertices);
    this._items.set(items);
  }

  setNombre(nombre: string) {
    this._nombre.set(nombre);
  }

  limpiarEstado() {
    this._vertices.set([]);
    this._items.set([]);
    this._nombre.set('Nuevo Local');
  }
}