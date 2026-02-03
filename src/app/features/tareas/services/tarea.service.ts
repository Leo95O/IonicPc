import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Tarea } from '../../../core/models/tarea.model';
import { ApiResponse } from '../../../core/models/api-response.model';


@Injectable({
  providedIn: 'root'
})
export class TareaService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/tareas`;

  private _tareas = new BehaviorSubject<Tarea[]>([]);
  public tareas$ = this._tareas.asObservable();

  /**
   * Lista tareas filtradas por proyecto (Requisito del API)
   */
  listarPorProyecto(proyectoId: number): Observable<ApiResponse<Tarea[]>> {
    return this.http.get<ApiResponse<Tarea[]>>(`${this.apiUrl}/?proyecto_id=${proyectoId}`).pipe(
      tap(response => {
        if (response.tipo === 1) {
          this._tareas.next(response.data);
        }
      })
    );
  }

  /**
   * Actualiza el estado para el tablero Kanban
   */
  actualizarEstado(id: number, estadoId: number): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/${id}`, { estado_id: estadoId }).pipe(
      tap(response => {
        if (response.tipo === 1) {
          // Opcional: recargar la lista o actualizar el estado local
        }
      })
    );
  }
}