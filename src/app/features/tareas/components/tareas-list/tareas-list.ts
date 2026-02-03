import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { TareaService } from '../../services/tarea.service';
import { Tarea } from '../../../../core/models/tarea.model';

// 👇 ICONOS PRO DUOTONE Y SOLID (Ahora sí funcionarán)
import {
  faCheckCircle, faClock, faStopwatch, faFlag, faCalendarDay,
  faUserCircle, faFilterList, faPlus, faCoffeeTogo, faTasks
} from '@fortawesome/pro-duotone-svg-icons';

import { faTrashCan, faCheck } from '@fortawesome/pro-solid-svg-icons';

@Component({
  selector: 'app-tareas-list',
  templateUrl: './tareas-list.html',
  standalone: false
})
export class TareasListComponent implements OnInit {
  // Diccionario de iconos para el HTML
  icons = {
    filter: faFilterList,
    add: faPlus,
    calendar: faCalendarDay,
    user: faUserCircle,
    empty: faCoffeeTogo,
    tasks: faTasks,
    check: faCheck,
    trash: faTrashCan
  };

  private route = inject(ActivatedRoute);
  private tareaService = inject(TareaService);

  public tareas$: Observable<Tarea[]> = this.tareaService.tareas$;
  public proyectoId?: number;

  ngOnInit() {
    this.route.paramMap.pipe(
      tap(params => {
        const idStr = params.get('proyectoId');
        this.proyectoId = idStr ? +idStr : undefined;
        this.cargarTareas();
      })
    ).subscribe();
  }

  cargarTareas() {
    this.tareaService.listar(this.proyectoId).subscribe();
  }

  cambiarEstado(tareaId: number, nuevoEstado: number) {
    this.tareaService.actualizarEstado(tareaId, nuevoEstado).subscribe(() => {
      this.cargarTareas();
    });
  }
    
  eliminar(tareaId: number) {
    this.tareaService.eliminar(tareaId).subscribe();
  }

  // --- UI HELPERS ---

  getPrioridadUi(id: number) {
    switch (id) {
      case 4: return { label: 'Crítica', icon: faFlag, badgeClass: 'bg-red-50 text-red-600', iconClass: 'text-red-500' };
      case 3: return { label: 'Alta', icon: faFlag, badgeClass: 'bg-orange-50 text-orange-600', iconClass: 'text-orange-500' };
      case 2: return { label: 'Media', icon: faFlag, badgeClass: 'bg-blue-50 text-blue-600', iconClass: 'text-blue-500' };
      default: return { label: 'Baja', icon: faFlag, badgeClass: 'bg-green-50 text-green-600', iconClass: 'text-green-500' };
    }
  }

  getEstadoUi(id: number) {
    switch (id) {
      case 3: return { label: 'Hecho', icon: faCheckCircle, textClass: 'text-green-600', bgIcon: 'bg-green-100' };
      case 2: return { label: 'En curso', icon: faStopwatch, textClass: 'text-blue-600', bgIcon: 'bg-blue-100' };
      default: return { label: 'Pendiente', icon: faClock, textClass: 'text-slate-500', bgIcon: 'bg-slate-100' };
    }
  }
}