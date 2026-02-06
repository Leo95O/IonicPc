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
  distanciaMinima: number; // cm
  escalaPixelsPorMetro: number;
}

export interface PlanoLocal {
  id?: string;
  nombre: string;
  vertices: Punto[]; // Polígono del local
  configuracion: ConfiguracionPlano;
}