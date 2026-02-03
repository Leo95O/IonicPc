import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { UiService } from '../../shared/services/ui.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  private uiService = inject(UiService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    let request = req;

    if (token) {
      request = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse && event.body) {
          const body = event.body as ApiResponse<any>;
          this.handleResponseMessages(body, req.method);
        }
      })
    );
  }

  private handleResponseMessages(body: ApiResponse<any>, method: string) {
    const { tipo, mensajes } = body;
    const firstMsg = mensajes && mensajes.length > 0 ? mensajes[0] : null;

    switch (tipo) {
      case 1: // Éxito
        // Solo mostramos toast en acciones de escritura
        if (['POST', 'PUT', 'DELETE'].includes(method) && firstMsg) {
          this.uiService.showToast(firstMsg, 'success');
        }
        break;

      case 2: // Alerta/Validación
        if (firstMsg) {
          this.uiService.showToast(firstMsg, 'warning');
        }
        break;

      case 3: // Error Crítico
        if (firstMsg) {
          this.uiService.showToast(firstMsg, 'danger');
        }
        break;
    }
  }
}