import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Proyecto } from 'src/app/core/models/proyecto.model';
import { ApiResponse } from 'src/app/core/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/proyectos`;

  // Estado privado (SSOT)
  private _proyectos = new BehaviorSubject<Proyecto[]>([]);
  
  // Exposición pública como Observable
  public proyectos$ = this._proyectos.asObservable();

  /**
   * Carga la lista de proyectos y actualiza el estado
   */
  listarProyectos(): Observable<ApiResponse<Proyecto[]>> {
    return this.http.get<ApiResponse<Proyecto[]>>(this.apiUrl).pipe(
      tap(response => {
        if (response.tipo === 1) {
          this._proyectos.next(response.data);
        }
      })
    );
  }

  /**
   * Crear proyecto: El backend espera llaves cortas (contrato técnico)
   */
  crearProyecto(proyecto: Partial<Proyecto>): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.apiUrl, proyecto).pipe(
      tap(response => {
        if (response.tipo === 1) this.listarProyectos().subscribe();
      })
    );
  }
}