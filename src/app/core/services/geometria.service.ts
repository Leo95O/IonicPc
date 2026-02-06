import { Injectable } from '@angular/core';
// Importaciones corregidas separando los modelos
import { Punto, TipoRestaurante } from '../models/diseno-plano.model';
import { ItemMapa } from '../models/item-mapa.model';

@Injectable({
  providedIn: 'root'
})
export class GeometriaService {

  // Tabla de distancias (en cm)
  private readonly REGLAS_DISTANCIA: Record<string, number> = {
    comida_rapida: 45,
    familiar: 61,
    alto_nivel: 76,
    pasillo: 90
  };

  /**
   * Obtiene la distancia de seguridad según el tipo de restaurante
   */
  obtenerDistanciaSeguridad(tipo: TipoRestaurante): number {
    return this.REGLAS_DISTANCIA[tipo] || 60;
  }

  /**
   * Convierte coordenadas de metros (lógica) a píxeles (pantalla)
   */
  metrosAPixels(valorMetros: number, escala: number): number {
    return valorMetros * escala;
  }

  /**
   * Valida si un ítem está completamente dentro de los límites del plano
   */
  estaDentroDelPlano(item: ItemMapa, verticesPlano: Punto[]): boolean {
    // Verificamos el centro del ítem
    return this.puntoEnPoligono(item.transform, verticesPlano);
  }

  /**
   * Algoritmo Ray-casting para detección de puntos en polígonos
   */
  private puntoEnPoligono(punto: { x: number, y: number }, poligono: Punto[]): boolean {
    let inside = false;
    for (let i = 0, j = poligono.length - 1; i < poligono.length; j = i++) {
      const xi = poligono[i].x, yi = poligono[i].y;
      const xj = poligono[j].x, yj = poligono[j].y;
      const intersect = ((yi > punto.y) !== (yj > punto.y))
          && (punto.x < (xj - xi) * (punto.y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  /**
   * Detección de colisión entre dos ítems
   */
  hayColision(itemA: ItemMapa, itemB: ItemMapa, distanciaMinimaCm: number): boolean {
    const distMetros = distanciaMinimaCm / 100;
    
    // Cálculo de distancia entre centros
    const dx = itemA.transform.x - itemB.transform.x;
    const dy = itemA.transform.y - itemB.transform.y;
    const distanciaCentros = Math.sqrt(dx * dx + dy * dy);

    // Cálculo radial básico para la validación inicial
    const radioA = (itemA.dimensiones.ancho / 200) + (distMetros / 2);
    const radioB = (itemB.dimensiones.ancho / 200) + (distMetros / 2);

    return distanciaCentros < (radioA + radioB);
  }
}