import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Tarea } from '../../../core/models/tarea.model';
import { TareaDto } from '../../../core/models/tarea.dto';
import { TareaMapper } from '../../../core/mappers/tarea.mapper';
import { ApiResponse } from '../../../core/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class TareaService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/tareas`; 

  private _tareas = new BehaviorSubject<Tarea[]>([]);
  public tareas$ = this._tareas.asObservable();

  listar(proyectoId?: number): Observable<ApiResponse<Tarea[]>> {
    let url = `${this.apiUrl}/`;
    if (proyectoId) {
      url += `?proyecto_id=${proyectoId}`;
    }

    // Pedimos TareaDto al backend
    return this.http.get<ApiResponse<TareaDto[]>>(url).pipe(
      map(response => {
        if (response.tipo === 1 && Array.isArray(response.data)) {
          // Mapeamos a Tarea limpia
          const tareasDominio = response.data.map(dto => TareaMapper.fromDto(dto));
          return { ...response, data: tareasDominio } as ApiResponse<Tarea[]>;
        }
        return { ...response, data: [] } as ApiResponse<Tarea[]>;
      }),
      tap(response => {
        if (response.tipo === 1) {
          this._tareas.next(response.data);
        }
      })
    );
  }

  actualizarEstado(tareaId: number, nuevoEstado: number): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/${tareaId}`, { estado_id: nuevoEstado });
  }

  crear(tarea: Partial<Tarea>): Observable<ApiResponse<any>> {
    const payload = TareaMapper.toPayload(tarea);
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/`, payload).pipe(
        tap(() => {
            if(tarea.proyectoId) this.listar(tarea.proyectoId).subscribe();
        })
    );
  }
  
  eliminar(tareaId: number): Observable<ApiResponse<any>> {
     return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${tareaId}`).pipe(
        tap(() => {
            const actuales = this._tareas.value.filter(t => t.id !== tareaId);
            this._tareas.next(actuales);
        })
     );
  }
}