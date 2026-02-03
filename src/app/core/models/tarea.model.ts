export interface Tarea {
  id: number;
  titulo: string;
  descripcion: string;
  proyectoId: number;
  prioridadId: number;
  prioridadLabel?: string;
  usuarioAsignado: number | null;
  fechaLimite: Date;      
  estadoId: number;
  estadoLabel?: string;
}