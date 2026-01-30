import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // <--- AGREGADO
import { IonicModule } from '@ionic/angular'; // <--- AGREGADO PARA COMPONENTES IONIC
import { AuthRoutingModule } from './auth-routing-module';
import { Login } from './login/login';

@NgModule({
  declarations: [
    Login
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule, // Vital para formGroup
    IonicModule,         // Vital para ion-content, ion-input
    AuthRoutingModule
  ]
})
export class AuthModule { }