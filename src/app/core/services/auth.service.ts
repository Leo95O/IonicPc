import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, map, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

// Interfaces (puedes moverlas a su propio archivo si prefieres)
export interface ApiResponse<T = any> {
  tipo: number;
  mensajes: string[];
  data: T;
}

export interface LoginResponseData {
  usuario: Usuario;
  token: string;
}

export interface Usuario {
  usuario_id: number;
  usuario_nombre: string;
  rol_id: number;
  usuario_correo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly apiUrl = environment.apiUrl;

  // Estado Reactivo con Signals
  private _currentUser = signal<Usuario | null>(null);
  public currentUser = this._currentUser.asReadonly();
  public isAuthenticated = computed(() => !!this._currentUser());

  constructor() {
    this.checkLocalStorage();
  }

  login(email: string, password: string): Observable<boolean> {
    const url = `${this.apiUrl}/usuarios/login`;
    const body = { usuario_correo: email, usuario_password: password };

    return this.http.post<ApiResponse<LoginResponseData>>(url, body).pipe(
      map(response => {
        if (response.tipo === 1 && response.data) {
          this.setSession(response.data.usuario, response.data.token);
          return true;
        } else {
          throw new Error(response.mensajes?.[0] || 'Error en el servidor');
        }
      }),
      catchError(err => throwError(() => err))
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this._currentUser.set(null);
    this.router.navigate(['/auth']);
  }

  private setSession(user: Usuario, token: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this._currentUser.set(user);
  }

  private checkLocalStorage() {
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
}