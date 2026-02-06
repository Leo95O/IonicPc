import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PlanoData } from '../models/editor-models';

@Injectable({
  providedIn: 'root'
})
export class PlanoApiService {
  // Ajusta esto a tu URL real o déjalo como fallback
  private apiUrl = (environment as any).apiUrl || 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  guardarPlano(data: PlanoData): Observable<any> {
    if (data.id) {
        return this.http.put(`${this.apiUrl}/planos/${data.id}`, data);
    }
    return this.http.post(`${this.apiUrl}/planos`, data);
  }

  obtenerPlano(id: string): Observable<PlanoData> {
    return this.http.get<PlanoData>(`${this.apiUrl}/planos/${id}`);
  }

  // ESTE ES EL MÉTODO QUE FALTABA Y CAUSABA EL ERROR TS2339
  listarPlanos(): Observable<PlanoData[]> {
    // Si no tienes backend aún, descomenta el bloque 'of' para probar
    // return this.http.get<PlanoData[]>(`${this.apiUrl}/planos`);
    
    // MOCK DE DATOS PARA QUE NO TE DE ERROR SI NO HAY BACKEND
    return of([
      {
        id: '1',
        nombre: 'Proyecto Demo 1',
        version: '1.0',
        fase: 'B', // Fíjate que usamos el tipo 'A' o 'B'
        pixelsPerMeter: 50,
        holguraCm: 106,
        canvasJson: {},
        fechaModificacion: new Date()
      }
    ] as PlanoData[]);
  }
}