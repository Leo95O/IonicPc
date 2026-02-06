// src/app/features/disenador-plano/engine/utils/geometry-utils.ts
import * as fabric from 'fabric';

// Interfaz auxiliar compatible con fabric.Point y {x, y}
export interface IPoint {
  x: number;
  y: number;
}

export class GeometryUtils {
  
  static pixelsToMeters(px: number, ppm: number): number {
    if (ppm <= 0) return 0;
    return Number((px / ppm).toFixed(2));
  }

  static metersToPixels(meters: number, ppm: number): number {
    return meters * ppm;
  }

  static cmToPixels(cm: number, ppm: number): number {
    return (cm / 100) * ppm;
  }

  // Acepta IPoint en lugar de fabric.Point
  static getDistance(p1: IPoint, p2: IPoint): number {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }

  /**
   * Algoritmo Ray-Casting robusto.
   * Funciona con cualquier objeto que tenga x, y.
   */
  static isPointInPolygon(point: IPoint, vs: IPoint[]): boolean {
    const x = point.x, y = point.y;
    let inside = false;
    
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        const xi = vs[i].x, yi = vs[i].y;
        const xj = vs[j].x, yj = vs[j].y;
        
        const intersect = ((yi > y) !== (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
  }
}