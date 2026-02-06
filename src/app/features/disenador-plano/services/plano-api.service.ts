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
  private apiUrl = `${environment.apiUrl}/planos`; 

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de todos los planos guardados (Nombre + ID + Fecha)
   */
  listarPlanos(): Observable<PlanoLocal[]> {
    return this.http.get<PlanoLocal[]>(this.apiUrl);
  }

  /**
   * Obtiene el detalle completo de un plano para editarlo
   */
  obtenerPlano(id: number | string): Observable<PlanoLocal> {
    return this.http.get<PlanoLocal>(`${this.apiUrl}/${id}`);
  }

  /**
   * Guarda o actualiza un plano
   */
  guardarPlano(nombre: string, vertices: any[], items: ItemMapa[], id?: string): Observable<any> {
    const payload = {
      nombre,
      configuracion: {
        vertices,
        items
      }
    };
    
    // Si hay ID, podrías hacer PUT, aquí usaremos POST por simplicidad inicial
    return this.http.post(this.apiUrl, payload);
  }
}