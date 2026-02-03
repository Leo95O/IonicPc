import { Component, inject } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  standalone: false
})
export class SidebarComponent {
  
  // Inyección de dependencias moderna
  private authService = inject(AuthService);
  private menuCtrl = inject(MenuController);

  /**
   * Cierra sesión y el menú lateral para una transición limpia
   */
  logout() {
    // 1. Cerramos el menú visualmente (usando el ID del HTML)
    this.menuCtrl.close('mobile-menu');
    
    // 2. Ejecutamos la lógica de salida
    this.authService.logout();
  }
}