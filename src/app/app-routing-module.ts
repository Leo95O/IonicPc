import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';



const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth-module').then(m => m.AuthModule)
  },
  {
    path: 'page-not-found',
    loadChildren: () => import('./features/page-not-found/page-not-found.module').then(m => m.PageNotFoundModule)
  },

  {
  path: '**',
  redirectTo: '/page-not-found'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }