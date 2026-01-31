import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario, LoginResponseData } from '../models/usuario.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly apiUrl = environment.apiUrl;

  // Estado Reactivo con Signals (Mantiene el estándar camelCase)
  private _currentUser = signal<Usuario | null>(null);
  public currentUser = this._currentUser.asReadonly();
  public isAuthenticated = computed(() => !!this._currentUser());

  constructor() {
    this.checkLocalStorage();
  }

  /**
   * Realiza el login. 
   * Nota: El interceptor ya transformó la respuesta de snake_case a camelCase.
   */
  login(email: string, password: string): Observable<boolean> {
    const url = `${this.apiUrl}/usuarios/login`;
    
    // El input para login usa llaves largas según el contrato técnico
    const body = { usuario_correo: email, usuario_password: password };

    return this.http.post<ApiResponse<LoginResponseData>>(url, body).pipe(
      map(response => {
        // El interceptor filtra los tipos 2 y 3, por lo que aquí solo llega el éxito
        if (response.data) {
          this.setSession(response.data.usuario, response.data.token);
          return true;
        }
        return false;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this._currentUser.set(null);
    this.router.navigate(['/auth']);
  }

  private setSession(user: Usuario, token: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this._currentUser.set(user);
  }

  private checkLocalStorage(): void {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (user && token) {
      try {
        this._currentUser.set(JSON.parse(user));
      } catch {
        this.logout();
      }
    }
  }

  // Helper para obtener el token rápidamente en otros servicios si fuera necesario
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}