# 📘 Backend REST – Documentación Técnica & Guía de Integración Frontend

Backend legacy desarrollado en **PHP 7.1.3** usando **Slim Framework 2**, expuesto mediante una API REST.
Este documento cumple dos objetivos claros:

1. 📚 Documentar fielmente el comportamiento real del backend (fuente de verdad).
2. 🧩 Guiar su consumo desde el frontend desarrollado en Angular + Ionic.

---

## 📦 Stack Frontend Objetivo

- Angular 20.3.0 (Core, Common, Router, Forms)
- Arquitectura modular (Standalone: false)
- Ionic Framework 8.7.17 (@ionic/angular)
- RxJS ~7.8.0
- TypeScript ~5.9.2
- Tailwind CSS 3.4
- FontAwesome:
  - @fortawesome/angular-fontawesome 3.0.0
  - Free Solid & Global 7.1.0

---

## 1️⃣ Consideraciones Generales del Backend

- **Base URL**: `/backend/public`
- **Arquitectura**: Slim Framework 2 (Legacy)
- **Autenticación**: JWT
- **Header obligatorio**:
Authorization: Bearer <TOKEN_JWT>


### Wrapper global de respuesta

Todas las respuestas siguen esta estructura:

```json
{
"tipo": 1,
"mensajes": ["Mensaje descriptivo"],
"data": {}
}
Significado de tipo:

1 → Éxito

2 → Alerta / Validación

3 → Error crítico

Convenciones de datos
IDs: int

Fechas: YYYY-MM-DD o YYYY-MM-DD HH:mm:ss

Booleanos: 1 / 0 o por presencia de fecha (fecha_eliminacion)

Eliminaciones: Soft Delete

2️⃣ Contrato Técnico de Endpoints (Fuente de Verdad)
Todo lo descrito a continuación proviene directamente del backend.
No hay inferencias ni suposiciones.

🔐 Autenticación y Usuarios
🔹 POST /usuarios/login
Descripción
Inicia sesión validando credenciales, estado del usuario y reglas de seguridad anti-fuerza bruta (LoginGuard).

Body (JSON)

usuario_correo (string, requerido)

usuario_password (string, requerido)

Respuesta (data)

usuario:

usuario_id (int)

usuario_nombre (string, desencriptado)

usuario_correo (string)

rol_id (int)

rol: {id, nombre}

usuario_estado (int)

estado: {id, nombre, descripcion}

fecha_creacion (string)

token (JWT)

Errores

400: Credenciales incorrectas

400: Usuario bloqueado por LoginGuard

🔹 GET /usuarios/admin/listar
Roles: ADMIN
Query Params

rol_id (int, opcional)

Respuesta

Lista de usuarios (misma estructura que login, sin token)

🔹 POST /usuarios/admin/crear
Roles: ADMIN

Body

usuario_nombre (string, requerido)

usuario_correo (string, requerido)

usuario_password (string, requerido)

rol_id (int, requerido)

usuario_estado (int, opcional, default 1)

🔹 PUT /usuarios/admin/editar/:id
Roles: ADMIN

Path Param

id (int)

Body
Campos opcionales. Si se envía usuario_password, se re-encripta.

🔹 DELETE /usuarios/admin/:id
Descripción
Borrado lógico. No permite eliminar al usuario del token actual.

🏢 Sucursales
🔹 GET /sucursales/listar
Roles: Cualquier usuario autenticado

Respuesta

id, nombre, direccion, estado_id

estado (si está hidratado)

🔹 POST /sucursales/crear
Roles: ADMIN

Observación

El estado se asigna automáticamente como ACTIVO.

🔹 PUT /sucursales/editar/:id
Actualización parcial.

🔹 DELETE /sucursales/:id
Soft delete (estado INACTIVO).

🚀 Proyectos
🔹 GET /proyectos/
Query Params

sucursal_id (int, opcional)

🔹 GET /proyectos/:id
Detalle de proyecto.

🔹 POST /proyectos/
Roles: ADMIN, PROJECT_MANAGER

Observaciones

usuario_creador se obtiene del token

fecha_inicio ≤ fecha_fin

estado_id default = ACTIVO

🔹 PUT /proyectos/:id
Actualización parcial.

🔹 DELETE /proyectos/:id
Soft delete (fecha_eliminacion).

✅ Tareas
🔹 GET /tareas/
Query Params

proyecto_id (int)

usuario_asignado (int)

Regla crítica

Rol USER → el backend fuerza usuario_asignado al usuario del token.

🔹 POST /tareas/
Observaciones

Rol USER → auto-asignación obligatoria

estado_id default = POR_HACER

🔹 PUT /tareas/:id
Actualización parcial (ideal para Kanban).

🔹 POST /tareas/:id/asignar
Asigna usuario a tarea.

🔹 DELETE /tareas/:id
Soft delete (ADMIN / PM).

📊 Reportes y DataMaster
🔹 GET /datamaster/catalogos
Devuelve catálogos maestros:

roles

estados

prioridades

etc.

🔹 GET /reportes/dashboard
Comportamiento por rol

ADMIN / PM → métricas globales

USER → métricas solo propias

🔹 GET /reportes/admin-stats
Carga de trabajo por usuario.

3️⃣ Adaptación Frontend (Angular)
Interceptor recomendado
export interface ApiResponse<T> {
  tipo: number;
  mensajes: string[];
  data: T;
}
UI Flow

Tipo 1 → continuar

Tipo 2 → warning controlado

Tipo 3 → error bloqueante

4️⃣ Modelos TypeScript (camelCase)
export interface Usuario {
  usuarioId: number;
  nombre: string;
  correo: string;
  rolId: number;
  activo?: number;
}
export interface Proyecto {
  id: number;
  nombre: string;
  descripcion?: string;
  fechaInicio: string;
  fechaFin?: string;
  estadoId: number;
  sucursalId: number;
}
export interface Tarea {
  id: number;
  titulo: string;
  descripcion?: string;
  proyectoId: number;
  prioridadId: number;
  usuarioAsignado: number;
  fechaLimite: string;
  estadoId: number;
}
5️⃣ Reglas de Negocio y Gotchas
Fechas siempre como string YYYY-MM-DD

IDs siempre number

Rol 3 (USER):

No puede asignar tareas a otros

Filtros forzados por backend

Inputs usan llaves cortas, outputs llaves largas

Soft delete en casi todo