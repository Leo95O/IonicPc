import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  
  // Controla si el Sidebar está "Anclado/Fijo" en pantallas grandes
  public isSidebarDocked: boolean = true;

  constructor(private menuCtrl: MenuController) {}

  // Esta función se ejecuta cuando clickean el botón del Header
  toggleSidebar() {
    // Detectamos si es pantalla grande (Desktop/Laptop)
    const isDesktop = window.innerWidth >= 768; // 768px es el breakpoint 'md'

    if (isDesktop) {
      // EN DESKTOP: Alternamos entre mostrar u ocultar el panel fijo
      this.isSidebarDocked = !this.isSidebarDocked;
    } else {
      // EN MÓVIL: Usamos el ID específico 'mobile-menu' definido en el HTML
      this.menuCtrl.toggle('mobile-menu');
    }
  }
}