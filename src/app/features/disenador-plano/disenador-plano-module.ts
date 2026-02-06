import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DisenadorPlanoRoutingModule } from './disenador-plano-routing-module';
import { EditorPage } from './pages/editor/editor';

@NgModule({
  declarations: [
    EditorPage
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    DisenadorPlanoRoutingModule
  ]
})
export class DisenadorPlanoModule { }