import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { TareasListComponent } from './components/tareas-list/tareas-list';

import { TareasRoutingModule } from './tareas-routing-module';


// src/app/features/tareas/tareas-module.ts
@NgModule({
  declarations: [
    TareasListComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      { path: ':proyectoId', component: TareasListComponent }
    ])
  ]
})
export class TareasModule {}




