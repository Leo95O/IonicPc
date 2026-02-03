import { TareaDto } from '../models/tarea.dto';
import { Tarea } from '../models/tarea.model';

export class TareaMapper {
  static fromDto(dto: TareaDto): Tarea {
    return {
      id: dto.id,
      titulo: dto.titulo,
      descripcion: dto.descripcion,
      proyectoId: dto.proyecto_id,
      prioridadId: dto.prioridad?.id ?? 0,
      prioridadLabel: dto.prioridad?.nombre ?? 'Normal',
      estadoId: dto.estado?.id ?? 1,
      estadoLabel: dto.estado?.nombre ?? 'Pendiente',
      usuarioAsignado: dto.asignado_id,
      fechaLimite: dto.fecha_limite ? new Date(dto.fecha_limite) : new Date()
    };
  }

  static toPayload(model: Partial<Tarea>): any {
    return {
      tarea_titulo: model.titulo,
      tarea_descripcion: model.descripcion,
      proyecto_id: model.proyectoId,
      prioridad_id: model.prioridadId,
      fecha_limite: model.fechaLimite?.toISOString().slice(0, 19).replace('T', ' '),
      usuario_asignado: model.usuarioAsignado
    };
  }
}