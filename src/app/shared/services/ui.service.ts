import { Injectable, inject } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  private toastCtrl = inject(ToastController);
  private loadingCtrl = inject(LoadingController);

  async showToast(message: string, color: 'success' | 'warning' | 'danger' = 'success') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color,
      position: 'bottom',
      buttons: [{ text: 'OK', role: 'cancel' }]
    });
    await toast.present();
  }

  // Útil para bloquear la pantalla en peticiones largas
  async showLoading(message: string = 'Procesando...') {
    const loading = await this.loadingCtrl.create({ message });
    await loading.present();
    return loading;
  }
}