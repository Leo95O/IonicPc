// src/app/features/disenador-plano/engine/systems/collision-system.ts
import * as fabric from 'fabric';

export class CollisionSystem {
  
  /**
   * Valida colisiones entre una lista de muebles (Grupos de Fabric).
   * Aplica efectos visuales directos: Naranja (Halo) o Rojo (Físico).
   * * @param muebles Lista de grupos (Mesa + Halo)
   * @param holguraPx Tamaño del halo en píxeles (solo referencia, el halo ya debería tener este tamaño visual)
   */
  static validarPosiciones(muebles: fabric.Group[]): { hayError: boolean } {
    let hayColisionFisica = false;

    // 1. Limpieza inicial: Resetear colores a estado "OK"
    muebles.forEach(grupo => {
      const objects = grupo.getObjects();
      const halo = objects[0] as fabric.Object; // Asumimos orden: [0]=Halo, [1]=Mesa
      const mesa = objects[1] as fabric.Object;

      if (halo) halo.set('fill', 'rgba(255, 165, 0, 0.05)'); // Naranja casi invisible
      if (mesa) {
        mesa.set('stroke', null);
        mesa.set('strokeWidth', 0);
      }
    });

    // 2. Validación O(N^2) - Comparar todos contra todos
    for (let i = 0; i < muebles.length; i++) {
      for (let j = i + 1; j < muebles.length; j++) {
        const m1 = muebles[i];
        const m2 = muebles[j];

        // Verificar si los Halos (Bounding Rects) se tocan
        if (m1.intersectsWithObject(m2)) {
          // A. COLISIÓN DE HALOS (Advertencia - Naranja)
          const halo1 = m1.getObjects()[0];
          const halo2 = m2.getObjects()[0];
          
          if (halo1) halo1.set('fill', 'rgba(255, 165, 0, 0.4)'); // Naranja fuerte
          if (halo2) halo2.set('fill', 'rgba(255, 165, 0, 0.4)');

          // B. COLISIÓN FÍSICA (Error - Rojo)
          // Calculamos la distancia entre centros reales
          const center1 = m1.getCenterPoint();
          const center2 = m2.getCenterPoint();
          const dist = center1.distanceFrom(center2);

          // Estimación del radio físico (Ancho real del mueble / 2)
          // Nota: scaledWidth incluye el scaling del grupo
          const radioMesa1 = (m1.getScaledWidth() * 0.4); // Aproximación conservadora (40% del ancho total del grupo que incluye halo)
          const radioMesa2 = (m2.getScaledWidth() * 0.4);

          if (dist < (radioMesa1 + radioMesa2)) {
            hayColisionFisica = true;
            const body1 = m1.getObjects()[1];
            const body2 = m2.getObjects()[1];

            if (body1) body1.set({ stroke: '#ef4444', strokeWidth: 3 }); // Rojo Tailwind
            if (body2) body2.set({ stroke: '#ef4444', strokeWidth: 3 });
          }
        }
      }
    }

    return { hayError: hayColisionFisica };
  }
}