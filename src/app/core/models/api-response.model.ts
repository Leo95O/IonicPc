// src/app/core/models/api-response.model.ts
export interface ApiResponse<T> {
  tipo: number;       // 1: Éxito, 2: Alerta, 3: Error
  mensajes: string[];
  data: T;
}
