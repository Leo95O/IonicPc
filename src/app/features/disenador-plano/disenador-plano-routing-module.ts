import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Páginas
import { ListaPlanosPage } from './pages/lista-planos/lista-planos';
import { EditorPage } from './pages/editor/editor'; // Importamos el componente Standalone

const routes: Routes = [
  {
    path: '',
    component: ListaPlanosPage // Ruta por defecto (lista de proyectos)
  },
  {
    path: 'editor', // Ruta: /disenador-plano/editor
    component: EditorPage // Carga directa del componente Standalone
  },
  {
    path: 'editor/:id', // Ruta para editar existente: /disenador-plano/editor/123
    component: EditorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DisenadorPlanoRoutingModule {}