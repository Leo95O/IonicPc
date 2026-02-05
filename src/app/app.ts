import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { UiService } from './shared/services/ui.service'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {

  // Suscripción para detectar cambios en el menú y evitar fugas de memoria
  private menuSub: Subscription | undefined;

  // LISTA DE NAVEGACIÓN DEL SIDEBAR
  // Centralizamos aquí las rutas principales de la App
  public pages = [
    { title: 'Dashboard', url: '/features/dashboard', icon: 'pie-chart-outline' },
    { title: 'Mis Tareas', url: '/features/tareas', icon: 'list-outline' },
    { title: 'Proyectos', url: '/features/proyectos', icon: 'folder-open-outline' },
    { title: 'Sucursales', url: '/features/sucursales', icon: 'business-outline' },
    { title: 'Personal', url: '/features/personal', icon: 'people-outline' },
    { title: 'Reportes', url: '/features/reportes', icon: 'bar-chart-outline' },
    { title: 'Configuración', url: '/features/settings', icon: 'settings-outline' },
  ];

  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    private uiService: UiService // Inyectamos el "Cerebro UI"
  ) {}

  ngOnInit() {
    // ESCUCHAMOS AL SERVICIO (UiService)
    // Cuando el Header diga "toggleMenu", el servicio emite aquí y nosotros abrimos/cerramos el Sidebar.
    this.menuSub = this.uiService.menuOpen$.subscribe(isOpen => {
      if (isOpen) {
        this.menuCtrl.open('main-menu'); // 'main-menu' es el ID que pusimos en el HTML
      } else {
        this.menuCtrl.close('main-menu');
      }
    });
  }

  // Limpieza de memoria profesional
  ngOnDestroy() {
    if (this.menuSub) {
      this.menuSub.unsubscribe();
    }
  }

  /**
   * Acción para cerrar sesión desde el footer del sidebar
   */
  logout() {
    this.uiService.clearUser(); // Limpiamos estado del usuario
    this.menuCtrl.close('main-menu'); // Cerramos el menú
    this.router.navigate(['/login']); // Redirigimos
  }
}