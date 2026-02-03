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
        redirectTo: 'inicio',
        pathMatch: 'full'
      },
      {
        path: 'inicio',
        loadChildren: () => import('./inicio/inicio-module').then(m => m.InicioModule)
      },
      {
        path: 'proyectos',
        loadChildren: () => import('./proyectos/proyectos-module').then(m => m.ProyectosModule)
      }
      // En el futuro: { path: 'tareas', loadChildren: ... }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeaturesRoutingModule { }