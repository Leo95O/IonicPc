import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TareasRoutingModule } from './tareas-routing-module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TareasListComponent } from './components/tareas-list/tareas-list';



@NgModule({
  declarations: [
    TareasListComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    TareasRoutingModule,
    FontAwesomeModule 
  ]
})
export class TareasModule { }