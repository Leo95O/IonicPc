import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from './shared/layout/layout';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/inicio',
    pathMatch: 'full'
  },
  {
    path: '',
    component: Layout,
    loadChildren: () => import('./features/features-module').then(m => m.FeaturesModule)
  },

  /*{
    path: "**",
    pathMatch: "full",
    component: PageNotFoundComponent,
  }*/
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }