export interface Usuario {
  id: number;
  nombre: string;
  rolId: number;
  correo?: string;
}

export interface LoginResponseData {
  usuario: Usuario;
  token: string;
}