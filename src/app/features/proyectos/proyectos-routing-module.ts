// src/app/features/proyectos/proyectos-routing-module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProyectosListComponent } from './components/proyectos-list/proyectos-list';

const routes: Routes = [
  {
    path: '', // Path vacío porque se carga como hijo
    component: ProyectosListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProyectosRoutingModule { }