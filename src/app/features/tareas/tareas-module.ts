import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // Vital para pipes como | async
import { IonicModule } from '@ionic/angular';   // Vital para <ion-content>, <ion-item>
import { TareasRoutingModule } from './tareas-routing-module';
import { TareasListComponent } from './components/tareas-list/tareas-list';

@NgModule({
  declarations: [
    TareasListComponent // Declaramos el componente aquí
  ],
  imports: [
    CommonModule,
    IonicModule, // <--- ¡ESTO ES LO QUE FALTABA PARA QUE SE VEA!
    TareasRoutingModule
  ]
})
export class TareasModule { }