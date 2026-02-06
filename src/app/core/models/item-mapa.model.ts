export type TipoFigura = 'circular' | 'cuadrado' | 'rectangular';

export interface ItemMapa {
  id: string;
  tipo: TipoFigura;
  esFijo: boolean;
  dimensiones: {
    ancho: number;  // cm (o diámetro si es circular)
    largo?: number; // cm
  };
  transform: {
    x: number;   // Metros respecto al origen del plano
    y: number;   // Metros respecto al origen del plano
    rotacion: number; // Grados 0-359
  };
  color?: string;
}