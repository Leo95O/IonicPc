import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router'; 
import { IonicModule } from '@ionic/angular'; 
import { PageNotFound } from './page-not-found'; 

const routes: Routes = [
  

      {
       path: '', 
       component: PageNotFound
      },
      
  ]

;

@NgModule({
  declarations: [
    PageNotFound 
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes) 
  ],
  exports: [
    PageNotFound 
  ]
})
export class PageNotFoundModule { }