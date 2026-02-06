// src/app/features/disenador-plano/models/editor-models.ts

// Estados del Editor
export type EditorFase = 'A' | 'B'; // A: Estructura, B: Mobiliario
export type EditorMode = 'IDLE' | 'PLUMA' | 'SELECCION';

// Configuración de un Mueble (Independiente de Fabric)
export interface MuebleConfig {
  id: string;
  tipo: 'rect' | 'circle';
  nombre: string;
  // Medidas reales en Centímetros
  anchoCm: number;
  largoCm: number; // Si es círculo, esto es el diámetro
  // Posición opcional (para cargas)
  x?: number;
  y?: number;
  rotation?: number;
}

// Datos adjuntos a una Pared (Metadata)
export interface ParedMetadata {
  index: number;     // Índice del segmento en el polígono
  longitudPx: number; // Longitud actual en pantalla
  metrosReales: number | null; // Valor calibrado por el usuario
}

// Payload para guardar en Base de Datos
export interface PlanoData {
  version: string;
  fase: EditorFase;
  pixelsPerMeter: number;
  canvasJson: any; // El objeto serializado de Fabric
  holguraCm: number;
  fechaModificacion: Date;
}