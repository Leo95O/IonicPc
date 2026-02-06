import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth.guard';
import { Layout } from '../shared/layout/layout';

const routes: Routes = [
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'tareas', // <--- CAMBIO CLAVE: Ahora inicia en Tareas
        pathMatch: 'full'
      },
      {
        path: 'inicio',
        redirectTo: 'tareas', // Redirección de seguridad para evitar "limbo"
        pathMatch: 'full'
      },
      {
        path: 'proyectos',
        loadChildren: () => import('./proyectos/proyectos-module').then(m => m.ProyectosModule)
      },
      {
        path: 'tareas',
        loadChildren: () => import('./tareas/tareas-module').then(m => m.TareasModule)
      },
      {
        path: 'disenador',
        loadChildren: () => import('./disenador-plano/disenador-plano-module').then(m => m.DisenadorPlanoModule)
      },  
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeaturesRoutingModule { }