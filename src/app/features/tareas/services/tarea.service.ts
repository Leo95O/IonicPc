import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs'; // <--- NO OLVIDES IMPORTAR MAP
import { environment } from '../../../../environments/environment';
import { Tarea } from '../../../core/models/tarea.model';
import { ApiResponse } from '../../../core/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class TareaService {
  private http = inject(HttpClient);
  // Aseguramos la barra final para evitar problemas con Slim PHP
  private readonly apiUrl = `${environment.apiUrl}/tareas/`; 

  private _tareas = new BehaviorSubject<Tarea[]>([]);
  public tareas$ = this._tareas.asObservable();

  listar(proyectoId?: number): Observable<ApiResponse<Tarea[]>> {
    let url = this.apiUrl;
    if (proyectoId) {
      url += `?proyecto_id=${proyectoId}`;
    }

    return this.http.get<ApiResponse<any>>(url).pipe(
      map(response => {
        // --- AQUÍ ESTÁ LA MAGIA (EL MAPPER) ---
        if (response.tipo === 1 && Array.isArray(response.data)) {
          const tareasMapeadas: Tarea[] = response.data.map((t: any) => ({
            id:              t.tarea_id,          // Traduce tarea_id -> id
            titulo:          t.tarea_titulo,      // Traduce tarea_titulo -> titulo
            descripcion:     t.tarea_descripcion, 
            proyectoId:      t.proyecto_id,
            prioridadId:     t.prioridad_id,
            usuarioAsignado: t.usuario_asignado,
            fechaLimite:     t.fecha_limite,
            estadoId:        t.estado_id
          }));
          return { ...response, data: tareasMapeadas };
        }
        return response as unknown as ApiResponse<Tarea[]>;
      }),
      tap(response => {
        if (response.tipo === 1) {
          this._tareas.next(response.data);
        }
      })
    );
  }

  // Mantenemos el método de actualizar estado
  actualizarEstado(tareaId: number, nuevoEstado: number): Observable<ApiResponse<any>> {
    // Quitamos la barra final para construir la url /tareas/5
    const urlBase = this.apiUrl.endsWith('/') ? this.apiUrl.slice(0, -1) : this.apiUrl;
    return this.http.put<ApiResponse<any>>(`${urlBase}/${tareaId}`, { estado_id: nuevoEstado });
  }
}