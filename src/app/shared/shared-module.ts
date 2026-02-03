import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Vital para routerLink
import { IonicModule } from '@ionic/angular';   // Vital para <ion-content>, <ion-item>, etc.
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'; // Para tus iconos

// Componentes
import { SidebarComponent } from './sidebar/sidebar';
import { Headers } from './headers/headers';
import { Layout } from './layout/layout';

@NgModule({
  declarations: [
    SidebarComponent,
    Headers,
    Layout
  ],
  imports: [
    CommonModule,
    RouterModule,
    IonicModule,
    FontAwesomeModule
  ],
  exports: [
    SidebarComponent,
    Headers,
    Layout,
    IonicModule,      // Exportamos para que quien use SharedModule tenga Ionic
    FontAwesomeModule // Exportamos para que quien use SharedModule tenga iconos
  ]
})
export class SharedModule { }