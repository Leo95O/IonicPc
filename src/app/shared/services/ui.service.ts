import { Injectable, inject } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

// 1. Exportamos la interfaz para usarla en los componentes
export interface UserProfile {
  name: string;
  role: string;
  description: string;
  avatarUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class UiService {
  // --- INYECCIONES (Tu código actual) ---
  private toastCtrl = inject(ToastController);
  private loadingCtrl = inject(LoadingController);

  // --- NUEVO: GESTIÓN DE ESTADO (State Management) ---

  // A. Estado del Menú Lateral
  private _menuOpen = new BehaviorSubject<boolean>(false);
  public menuOpen$ = this._menuOpen.asObservable();

  // B. Estado del Usuario Actual
  // Inicializamos con datos 'dummy' o null si prefieres esperar al login real
  private _currentUser = new BehaviorSubject<UserProfile | null>({
    name: 'Joel Olaya',
    role: 'Administrador',
    description: 'Gestión general y supervisión de sucursales.',
    avatarUrl: 'https://ionicframework.com/docs/img/demos/avatar.svg'
  });
  public currentUser$ = this._currentUser.asObservable();


  // --- MÉTODOS EXISTENTES (Feedback Visual) ---

  async showToast(message: string, color: 'success' | 'warning' | 'danger' = 'success') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color,
      position: 'bottom',
      buttons: [{ text: 'OK', role: 'cancel' }]
    });
    await toast.present();
  }

  async showLoading(message: string = 'Procesando...') {
    const loading = await this.loadingCtrl.create({ message });
    await loading.present();
    return loading;
  }


  // --- NUEVOS MÉTODOS (Lógica de Negocio UI) ---

  /**
   * Abre o cierra el sidebar manualmente.
   * El HeaderComponent llamará a esto.
   */
  toggleMenu() {
    this._menuOpen.next(!this._menuOpen.value);
  }

  /**
   * Fuerza un estado específico del menú (útil al navegar).
   */
  setMenuState(isOpen: boolean) {
    this._menuOpen.next(isOpen);
  }

  /**
   * Actualiza los datos del usuario en tiempo real.
   * Llama a esto después del Login exitoso.
   */
  updateUser(user: UserProfile) {
    this._currentUser.next(user);
  }

  /**
   * Limpia el usuario (Logout).
   */
  clearUser() {
    this._currentUser.next(null);
  }
}