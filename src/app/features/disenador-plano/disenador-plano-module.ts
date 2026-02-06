import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { DisenadorPlanoRoutingModule } from './disenador-plano-routing-module';

// NO importamos páginas aquí porque ahora son Standalone y se cargan en el Routing.

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DisenadorPlanoRoutingModule
  ],
  declarations: [
    // DEJAR VACÍO (Si ListaPlanosPage y EditorPage son standalone)
  ]
})
export class DisenadorPlanoModule {}