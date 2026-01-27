import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from './shared/layout/layout';
import { CoreModule } from './core/core-module';
import { AuthModule } from './features/auth/auth-module';


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
  path: '**',
  loadChildren: () => import('./features/page-not-found/page-not-found').then(m => m.PageNotFound)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }