import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular'; 
import { RouterModule } from '@angular/router';

// Importación única y correcta del componente
import { ProyectosListComponent } from './components/proyectos-list/proyectos-list';

@NgModule({
  declarations: [
    ProyectosListComponent
  ],
  imports: [
    CommonModule,
    IonicModule, // Necesario para ion-header, ion-card, etc.
    RouterModule.forChild([
      { 
        path: '', 
        component: ProyectosListComponent 
      }
    ])
  ],
  exports: [
    ProyectosListComponent
  ]
})
export class ProyectosModule {}