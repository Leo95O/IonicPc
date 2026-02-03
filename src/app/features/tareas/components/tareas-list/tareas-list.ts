import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TareaService } from '../../services/tarea.service';
import { Observable, map, tap } from 'rxjs'; 
import { Tarea } from '../../../../core/models/tarea.model';

@Component({
  selector: 'app-tareas-list',
  templateUrl: './tareas-list.html',
  standalone: false
  // Se eliminó la línea de styleUrls para evitar error por archivo faltante
})
export class TareasListComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private tareaService = inject(TareaService);
  
  public tareas$: Observable<Tarea[]> = this.tareaService.tareas$; 
  public proyectoId?: number;

  ngOnInit() {
    // Usamos el pipe de la ruta para reaccionar a cambios en el ID del proyecto
    this.route.paramMap.pipe(
      map(params => params.get('proyectoId')),
      tap(id => {
        if (id) {
          this.proyectoId = +id;
          this.cargarTareas();
        }
      })
    ).subscribe();
  }

  cargarTareas() {
    if (this.proyectoId) {
      this.tareaService.listarPorProyecto(this.proyectoId).subscribe();
    }
  }

  cambiarEstado(tareaId: number, nuevoEstado: number) {
    this.tareaService.actualizarEstado(tareaId, nuevoEstado).subscribe(() => {
      this.cargarTareas();
    });
  }
}