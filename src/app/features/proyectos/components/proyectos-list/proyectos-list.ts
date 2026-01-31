import { Component, OnInit, inject } from '@angular/core';
import { ProyectoService } from '../../services/proyecto.service';

@Component({
  selector: 'app-proyectos-list',
  templateUrl: './proyectos-list.html',
  styleUrls: ['./proyectos-list.scss'],
  standalone: false,
})
export class ProyectosListComponent implements OnInit {
  private proyectoService = inject(ProyectoService);
  
  // SSOT: Consumimos el estado reactivo del servicio
  public proyectos$ = this.proyectoService.proyectos$;

  ngOnInit() {
    this.cargarProyectos();
  }

  cargarProyectos() {
    this.proyectoService.listarProyectos().subscribe();
  }
}