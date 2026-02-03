export interface Tarea {
  id: number;
  titulo: string;
  descripcion: string;
  proyectoId: number;
  prioridadId: number;
  usuarioAsignado: number;
  fechaLimite: string;
  estadoId: number;
}
