import { Component, OnInit, signal } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { PlanoApiService } from '../../services/plano-api.service';
import { PlanoLocal } from '../../../../core/models/diseno-plano.model';

@Component({
  selector: 'app-lista-planos',
  templateUrl: './lista-planos.html',
  standalone: false
})
export class ListaPlanosPage implements OnInit {
  planos = signal<PlanoLocal[]>([]);
  cargando = signal<boolean>(true);

  constructor(
    private apiService: PlanoApiService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.cargarPlanos();
  }

  async cargarPlanos() {
    this.cargando.set(true);
    this.apiService.listarPlanos().subscribe({
      next: (data) => {
        this.planos.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error(err);
        this.cargando.set(false);
      }
    });
  }
}