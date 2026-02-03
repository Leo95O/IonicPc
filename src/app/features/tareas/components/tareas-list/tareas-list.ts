import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TareaService } from '../../services/tarea.service';

@Component({
  selector: 'app-tareas-list',
  templateUrl: './tareas-list.html',
  styleUrls: ['./tareas-list.scss'],
  standalone: false
})
export class TareasListComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private tareaService = inject(TareaService);
  
  public tareas$ = this.tareaService.tareas$;
  public proyectoId?: number;

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