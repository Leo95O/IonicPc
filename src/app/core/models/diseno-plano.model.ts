import { ItemMapa } from './item-mapa.model'; // <--- Importamos esto

export interface Punto {
  x: number; // Metros
  y: number; // Metros
}

export enum TipoRestaurante {
  COMIDA_RAPIDA = 'comida_rapida',
  FAMILIAR = 'familiar',
  ALTO_NIVEL = 'alto_nivel',
  PASILLO = 'pasillo'
}

export interface ConfiguracionPlano {
  tipo: TipoRestaurante;
  distanciaMinima?: number; // cm (Opcional)
  escalaPixelsPorMetro?: number; // (Opcional)
  
  // Agregamos estas propiedades para que coincidan con el JSON de la BD
  vertices?: Punto[]; 
  items?: ItemMapa[]; 
}

export interface PlanoLocal {
  id?: string;
  nombre: string;
  // vertices: Punto[]; <--- Lo quitamos de aquí, ahora vive dentro de configuracion
  configuracion: ConfiguracionPlano;
}