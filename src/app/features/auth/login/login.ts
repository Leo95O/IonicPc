import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrls: ['./login.scss'], // Nota: Corregí styleUrl a styleUrls (array) que es estándar
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private loadingCtrl = inject(LoadingController);
  private toastCtrl = inject(ToastController);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(3)]]
  });

  async onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    // UI: Mostrar Loading nativo de Ionic
    const loading = await this.loadingCtrl.create({
      message: 'Autenticando...',
      spinner: 'crescent'
    });
    await loading.present();

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: async () => {
        await loading.dismiss();
        // Redirigir al layout principal (ajusta la ruta según tu app-routing)
        // Como no vi una ruta 'dashboard' o 'home' explícita, asumo raíz o layout
        this.router.navigate(['/']); 
      },
      error: async (err) => {
        await loading.dismiss();
        const msg = err.message || err.error?.mensajes?.[0] || 'Credenciales inválidas';
        this.presentToast(msg, 'danger');
      }
    });
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      color: color,
      position: 'bottom'
    });
    await toast.present();
  }
}