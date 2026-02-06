import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditorPage } from './pages/editor/editor';
import { ListaPlanosPage } from './pages/lista-planos/lista-planos';

const routes: Routes = [
  {
    path: '', 
    component: ListaPlanosPage // Página de inicio del módulo
  },
  {
    path: 'editor/nuevo',
    component: EditorPage
  },
  {
    path: 'editor/:id', // Ruta para cargar existente
    component: EditorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DisenadorPlanoRoutingModule { }