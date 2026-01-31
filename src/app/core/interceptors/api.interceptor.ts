// src/app/core/interceptors/api.interceptor.ts
import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    
    // 1. Inyección de Token Bearer
    let request = req;
    if (token) {
      request = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    // 2. Transformación de Respuesta (Mapping)
    return next.handle(request).pipe(
      map(event => {
        if (event instanceof HttpResponse && event.body) {
          const body = event.body as ApiResponse<any>;
          
          // Si es un login o trae datos de usuario, mapeamos las llaves
          if (body.data && body.data.usuario) {
            body.data.usuario = {
              id: body.data.usuario.usuario_id,
              nombre: body.data.usuario.usuario_nombre,
              correo: body.data.usuario.usuario_correo,
              rolId: body.data.usuario.rol_id
            };
          }
          // Aquí se pueden añadir más mapeos para Proyectos y Tareas
        }
        return event;
      })
    );
  }
}