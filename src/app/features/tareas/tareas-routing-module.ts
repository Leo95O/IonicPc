import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TareasListComponent } from './components/tareas-list/tareas-list';

const routes: Routes = [
  // Ruta 1: Vista general (Todas las tareas)
  {
    path: '',
    component: TareasListComponent
  },
  // Ruta 2: Vista filtrada (Tareas de un proyecto)
  {
    path: ':proyectoId',
    component: TareasListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TareasRoutingModule { }