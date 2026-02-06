import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UiService, UserProfile } from '../services/ui.service'; // Ajusta la ruta a tu servicio

@Component({
  selector: 'app-headers',
  standalone: false,
  templateUrl: './headers.html',
  styleUrls: ['./headers.scss'],
})
export class Headers implements OnInit { // Recomendado implementar OnInit

  // 1. FUENTE DE VERDAD REACTIVA
  // El HTML usará "user$ | async" para leer esto automáticamente.
  user$: Observable<UserProfile | null>;

  // 2. CONFIGURACIÓN DE NAVEGACIÓN (Desktop)
  mainMenu = [
    { label: 'Mis Tareas', icon: 'list-outline', route: '/features/tareas' },
    { label: 'Proyectos', icon: 'folder-open-outline', route: '/features/proyectos' },
    { label: 'Sucursales', icon: 'business-outline', route: '/features/sucursales' },
    { label: 'Diseñador', icon: 'map-outline', route: '/features/disenador' },
  ];

  constructor(
    private uiService: UiService, // Inyectamos el cerebro
    private router: Router
  ) {
    // Conectamos el observable local al del servicio
    this.user$ = this.uiService.currentUser$;
  }

  ngOnInit() {}

  /**
   * ACCIÓN: Abrir/Cerrar Sidebar
   * Ya no usamos @Output. Llamamos al servicio y él avisa a toda la app.
   */
  onMenuClick() {
    this.uiService.toggleMenu();
  }

  /**
   * ACCIÓN: Cerrar Sesión
   */
  logout() {
    // 1. Limpiamos el usuario en el servicio
    this.uiService.clearUser(); 
    
    // 2. Redirigimos
    this.router.navigate(['/login']);
  }
}