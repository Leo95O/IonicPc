import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PlanoLocal } from '../../../core/models/diseno-plano.model';
import { ItemMapa } from '../../../core/models/item-mapa.model';

@Injectable({
  providedIn: 'root'
})
export class PlanoApiService {
  private apiUrl = `${environment.apiUrl}/planos`; // Asegúrate de tener esta ruta en tu backend PHP

  constructor(private http: HttpClient) {}

  /**
   * Guarda el estado actual del diseño
   */
  guardarPlano(nombre: string, vertices: any[], items: ItemMapa[]): Observable<any> {
    const payload = {
      nombre,
      configuracion: {
        vertices,
        items
      }
    };
    return this.http.post(this.apiUrl, payload);
  }

  /**
   * Recupera un plano existente
   */
  obtenerPlano(id: string): Observable<PlanoLocal> {
    return this.http.get<PlanoLocal>(`${this.apiUrl}/${id}`);
  }
}