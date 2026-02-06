import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; // Agrega FormsModule si usas ngModel
import { IonicModule } from '@ionic/angular'; // <--- IMPORTANTE PARA EL ERROR DE ION-HEADER
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { DisenadorPlanoRoutingModule } from './disenador-plano-routing-module';
import { EditorPage } from './pages/editor/editor';
import { ListaPlanosPage } from './pages/lista-planos/lista-planos'; // <--- Importamos la lista

@NgModule({
  declarations: [
    EditorPage,
    ListaPlanosPage // <--- Declaramos la lista
  ],
  imports: [
    CommonModule,
    IonicModule, // <--- ESTO SOLUCIONA EL ERROR DE 'ion-header'
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule,
    DisenadorPlanoRoutingModule
  ]
})
export class DisenadorPlanoModule { }