import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TareaService } from '../../services/tarea.service';
import { Observable, map, tap } from 'rxjs'; 
import { Tarea } from '../../../../core/models/tarea.model';

@Component({
  selector: 'app-tareas-list',
  templateUrl: './tareas-list.html',
  standalone: false
})
export class TareasListComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private tareaService = inject(TareaService);
  
  public tareas$: Observable<Tarea[]> = this.tareaService.tareas$; 
  public proyectoId?: number; // Puede ser undefined ahora

  ngOnInit() {
    this.route.paramMap.pipe(
      tap(params => {
        const idStr = params.get('proyectoId');
        
        if (idStr) {
          // Caso A: Venimos de un proyecto específico
          this.proyectoId = +idStr;
        } else {
          // Caso B: Venimos a ver "Mis Tareas" (General)
          this.proyectoId = undefined;
        }
        
        // Ejecutamos la carga (con o sin ID)
        this.cargarTareas();
      })
    ).subscribe();
  }

  cargarTareas() {
    // El servicio ya es inteligente para manejar el undefined
    this.tareaService.listar(this.proyectoId).subscribe();
  }

  cambiarEstado(tareaId: number, nuevoEstado: number) {
    this.tareaService.actualizarEstado(tareaId, nuevoEstado).subscribe(() => {
      this.cargarTareas();
    });
  }
}