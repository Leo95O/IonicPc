import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular'; // Importante para reconocer ion-header, ion-card, etc.
import { RouterModule } from '@angular/router';

import { ProyectosListComponent } from './components/proyectos-list/proyectos-list';
import { ProyectosList } from './components/proyectos-list/proyectos-list';

@NgModule({
  declarations: [ProyectosListComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: ProyectosListComponent }])
  ]
})
export class ProyectosModule {}
