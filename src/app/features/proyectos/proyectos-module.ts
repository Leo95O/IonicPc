// src/app/features/proyectos/proyectos-module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular'; 
import { ProyectosRoutingModule } from './proyectos-routing-module'; // Importar el routing externo
import { ProyectosListComponent } from './components/proyectos-list/proyectos-list';

@NgModule({
  declarations: [
    ProyectosListComponent // ÚNICA DECLARACIÓN AQUÍ
  ],
  imports: [
    CommonModule,
    IonicModule,
    ProyectosRoutingModule // Delegar las rutas aquí
  ]
})
export class ProyectosModule {}