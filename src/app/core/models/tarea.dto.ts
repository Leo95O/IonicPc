export interface EstadoDto {
  id: number;
  nombre: string;
}

export interface PrioridadDto {
  id: number;
  nombre: string;
}

export interface TareaDto {
  id: number;
  titulo: string;
  descripcion: string;
  fecha_limite: string;
  estado: EstadoDto;
  prioridad: PrioridadDto;
  categoria: any;
  proyecto_id: number;
  asignado_id: number | null;
  creador_id: number;
}