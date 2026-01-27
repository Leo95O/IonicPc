import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from './shared/layout/layout';
import { CoreModule } from './core/core-module';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: Layout,
    loadChildren: () => import('./features/features-module').then(m => m.FeaturesModule)
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