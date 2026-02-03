// En src/app/features/tareas/components/tareas-list/tareas-list.ts

import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TareaService } from '../../services/tarea.service';
import { Observable } from 'rxjs'; // Añadir esta importación
import { Tarea } from '../../../../core/models/tarea.model'; // Importar la interfaz

@Component({
  selector: 'app-tareas-list',
  templateUrl: './tareas-list.html',
  // styleUrls: ['./tareas-list.scss'], // ELIMINAR O COMENTAR esta línea si el archivo no existe
  standalone: false
})
export class TareasListComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private tareaService = inject(TareaService);
  
  // Tipar explícitamente el observable para que el HTML reconozca las propiedades
  public tareas$: Observable<Tarea[]> = this.tareaService.tareas$; 
  public proyectoId?: number;

  // ... resto del código igual

  ngOnInit() {
    // Obtenemos el ID del proyecto de los parámetros de la ruta
    const idParam = this.route.snapshot.paramMap.get('proyectoId');
    if (idParam) {
      this.proyectoId = +idParam;
      this.cargarTareas();
    }
  }

  cargarTareas() {
    if (this.proyectoId) {
      this.tareaService.listarPorProyecto(this.proyectoId).subscribe();
    }
  }

  cambiarEstado(tareaId: number, nuevoEstado: number) {
    this.tareaService.actualizarEstado(tareaId, nuevoEstado).subscribe(() => {
      this.cargarTareas(); // Recargamos para ver el cambio
    });
  }
}