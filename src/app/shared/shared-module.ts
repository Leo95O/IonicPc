import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { Layout } from './layout/layout';
import { Headers } from './headers/headers';
import { Sidebar } from './sidebar/sidebar';



@NgModule({
  declarations: [
    Layout,
    Headers,
    Sidebar,

  ],
  imports: [
    CommonModule,
    RouterModule,
    IonicModule,
  ],
  exports: [
    Layout,
    Headers,
    Sidebar,

  ],
})
export class SharedModule { }