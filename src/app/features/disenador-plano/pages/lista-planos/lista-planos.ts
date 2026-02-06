<ion-header class="ion-no-border">
  <ion-toolbar class="bg-slate-900 text-white" color="dark">
    <ion-title>Mis Proyectos</ion-title>
    <ion-buttons slot="end">
      <ion-button (click)="crearNuevo()" color="primary" fill="solid">
        <ion-icon slot="start" name="add"></ion-icon>
        Nuevo
      </ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content class="bg-slate-900">
  <div class="max-w-5xl mx-auto p-4">
    
    <div *ngIf="cargando" class="flex justify-center mt-20">
      <ion-spinner name="crescent" color="primary"></ion-spinner>
    </div>

    <div *ngIf="!cargando && planos.length === 0" class="text-center mt-20 text-slate-500">
      <ion-icon name="map-outline" class="text-6xl mb-4 opacity-50"></ion-icon>
      <p class="text-lg">No tienes planos guardados.</p>
      <ion-button (click)="crearNuevo()" fill="outline" class="mt-4">
        Crear el primero
      </ion-button>
    </div>

    <div *ngIf="!cargando && planos.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      
      <div *ngFor="let plano of planos" 
           (click)="abrirPlano(plano)"
           class="bg-slate-800 rounded-xl p-5 cursor-pointer hover:bg-slate-750 transition-all border border-slate-700 hover:border-blue-500 hover:shadow-lg group relative overflow-hidden">
        
        <div class="absolute top-4 right-4">
          <span [class]="'text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wide ' + 
            (plano.fase === 'A' ? 'bg-blue-500/20 text-blue-300' : 'bg-green-500/20 text-green-300')">
            {{ plano.fase === 'A' ? 'Arquitectura' : 'Mobiliario' }}
          </span>
        </div>

        <div class="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center text-2xl text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors mb-4">
          <ion-icon name="business-outline"></ion-icon>
        </div>

        <h3 class="text-white font-bold text-lg truncate mb-1">{{ plano.nombre || 'Sin Nombre' }}</h3>
        
        <div class="space-y-1">
            <p class="text-xs text-slate-400">
            <ion-icon name="calendar-outline" class="mr-1 relative top-0.5"></ion-icon>
            {{ plano.fechaModificacion | date:'mediumDate' }}
            </p>
            <p class="text-[10px] text-slate-500 font-mono">
                v{{ plano.version }} • 1m={{ plano.pixelsPerMeter }}px
            </p>
        </div>
      </div>

    </div>
  </div>
</ion-content>