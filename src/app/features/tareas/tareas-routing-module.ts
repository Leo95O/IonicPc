import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TareasListComponent } from './components/tareas-list/tareas-list';

const routes: Routes = [
  {
    path: ':proyectoId', // Recibe el ID del proyecto desde la URL
    component: TareasListComponent // El componente que crearemos a continuación
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TareasRoutingModule { }
