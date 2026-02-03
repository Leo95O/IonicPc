# 📘 Guía de Integración Backend - Tareas RST

Este documento sirve como referencia técnica para conectar el Frontend (Angular) con el Backend (Slim PHP Legacy Refactorizado).

# 📦 Stack Tecnológico (Versiones)
Angular: 20.3.0 (Core, Common, Router, Forms).

Standalone : false

Ionic Framework: 8.7.17 (@ionic/angular).

Tailwind CSS: 3.4.

FontAwesome:

Librería Angular: 3.0.0 (@fortawesome/angular-fontawesome).

Iconos/Core: 7.1.0 (Free Solid & Global).

RxJS: ~7.8.0.

TypeScript: ~5.9.2.

## 1. Configuración Global

* **Base URL (Virtual Host):** `http://tareas.local`
* **Autenticación:** Bearer Token.
* **Header Obligatorio:** `Authorization: Bearer <TOKEN_JWT>`

---

## 2. Estándar de Respuesta (Interceptor)

El backend siempre responde con esta estructura ("The Wrapper"). Se debe crear un Interceptor en Angular para manejar los mensajes automáticos.

```typescript
// core/interfaces/api-response.interface.ts
export interface ApiResponse<T> {
  tipo: number;       // 1: Éxito, 2: Alerta/Validación, 3: Error Crítico
  mensajes: string[]; // Lista de mensajes para mostrar en Toasts
  data: T;            // El payload real (objeto, array o null)
}

¡Claro que sí! Aquí tienes un archivo Markdown (.md) profesional y listo para guardar en tu carpeta de Frontend.

Este archivo condensa toda la información técnica, los contratos de datos y las "trampas" que descubrimos durante el debugging, para que no tengas que buscar en el chat mientras programas en Angular.

Guárdalo como README_FRONTEND_API.md en la raíz de tu proyecto Angular.

Markdown
# 📘 Guía de Integración Backend - Tareas RST

Este documento sirve como referencia técnica para conectar el Frontend (Angular) con el Backend (Slim PHP Legacy Refactorizado).

## 1. Configuración Global

* **Base URL (Virtual Host):** `http://tareas.local`
* **Autenticación:** Bearer Token.
* **Header Obligatorio:** `Authorization: Bearer <TOKEN_JWT>`

---

## 2. Estándar de Respuesta (Interceptor)

El backend siempre responde con esta estructura ("The Wrapper"). Se debe crear un Interceptor en Angular para manejar los mensajes automáticos.


typescript
// core/interfaces/api-response.interface.ts
export interface ApiResponse<T> {
  tipo: number;       // 1: Éxito, 2: Alerta/Validación, 3: Error Crítico
  mensajes: string[]; // Lista de mensajes para mostrar en Toasts
  data: T;            // El payload real (objeto, array o null)
}

Lógica de UI recomendada:

Tipo 1 (Verde): Retornar data al componente. (Opcional: mostrar Toast si es una acción de guardar/editar).

Tipo 2 (Amarillo): Mostrar mensajes en Warning Toast. Retornar null o lanzar error controlado.

Tipo 3 (Rojo): Mostrar mensajes en Error Toast.

3. Modelos de Datos (Interfaces TypeScript)
Mapeo de las respuestas de Base de Datos (snake_case) a TypeScript (camelCase).

👤 Usuario
export interface Usuario {
  usuarioId: number;      // DB: usuario_id / Token: sub
  nombre: string;         // DB: usuario_nombre
  correo: string;         // DB: usuario_correo
  rolId: number;          // DB: rol_id (1: Admin, 2: PM, 3: User)
  activo?: number;        // DB: usuario_active (1 o 0)
}

🚀 Proyecto

export interface Proyecto {
  id: number;             // DB: proyecto_id
  nombre: string;         // DB: proyecto_nombre
  descripcion: string;    // DB: proyecto_descripcion
  fechaInicio: string;    // DB: fecha_inicio (YYYY-MM-DD)
  fechaFin?: string;      // DB: fecha_fin
  estadoId: number;       // DB: estado_id
  sucursalId: number;     // DB: sucursal_id
}

✅ Tarea

export interface Tarea {
  id: number;             // DB: tarea_id
  titulo: string;         // DB: tarea_titulo
  descripcion: string;    // DB: tarea_descripcion
  proyectoId: number;     // DB: proyecto_id
  prioridadId: number;    // DB: prioridad_id
  usuarioAsignado: number;// DB: usuario_asignado
  fechaLimite: string;    // DB: fecha_limite (YYYY-MM-DD)
  estadoId: number;       // DB: estado_id
}

4. Catálogo de Servicios y Endpoints
🔐 AuthService

Método,Endpoint,Body (JSON),Nota
POST,/usuarios/login,"{ ""usuario_correo"": ""..."", ""usuario_password"": ""..."" }",Único endpoint que usa llaves largas en el input.

👥 UsuarioService (Solo Admin)

Método,Endpoint,Body Input,Nota
GET,/usuarios/admin/listar,-,Trae todos.
POST,/usuarios/admin/crear,"{ ""usuario_nombre"": ""..."", ""usuario_correo"": ""..."", ""usuario_password"": ""..."", ""rol_id"": # }",
PUT,/usuarios/admin/editar/:id,"{ ""usuario_nombre"": ""..."", ""rol_id"": # }",Actualización parcial.
DELETE,/usuarios/admin/:id,-,Soft delete.

🏢 SucursalService

Método,Endpoint,Body Input,Nota
GET,/sucursales/listar,-,Público para cualquier logueado.
POST,/sucursales/crear,"{ ""sucursal_nombre"": ""..."", ""sucursal_direccion"": ""..."" }",Solo Admin.

🚀 ProyectoService
⚠️ IMPORTANTE: El Input (Body) usa llaves cortas, pero la Output (Respuesta) trae llaves largas.

Método,Endpoint,Body Input (Llaves Cortas),Obligatorios
GET,/proyectos/,(Query Params),
POST,/proyectos/,"{ ""nombre"": ""..."", ""descripcion"": ""..."", ""fecha_inicio"": ""YYYY-MM-DD"", ""estado_id"": 1, ""sucursal_id"": 1 }",sucursal_id
PUT,/proyectos/:id,"{ ""estado_id"": 2 }",Puede ser parcial.
DELETE,/proyectos/:id,-,Solo Admin/PM.

📝 TareaService
⚠️ IMPORTANTE: proyecto_id es vital para crear.

Método,Endpoint,Body Input (Llaves Cortas),Obligatorios
GET,/tareas/,?proyecto_id=X,Filtrar siempre por proyecto.
POST,/tareas/,"{ ""titulo"": ""..."", ""descripcion"": ""..."", ""prioridad_id"": #, ""fecha_limite"": ""..."", ""usuario_asignado"": #, ""proyecto_id"": # }",proyecto_id
PUT,/tareas/:id,"{ ""estado_id"": 3 }",Para mover Kanban.
POST,/tareas/:id/asignar,"{ ""usuario_id"": 5 }",Reasignación específica.

📊 DashboardService
Método,Endpoint,Nota
GET,/reportes/dashboard,"El backend detecta el Rol automáticamente. Admin ve globales, User ve sus métricas."

5. Reglas de Negocio y Gotchas
Fechas: Siempre enviar strings formateados como "YYYY-MM-DD".

IDs: Enviar siempre como Number (enteros), no strings.

Roles:

1: Admin (Dios).

2: Project Manager (Gestión de Proyectos/Tareas).

3: Usuario (Solo ve y edita sus tareas asignadas).

Auto-Asignación (Rol 3): Si un Usuario normal crea una tarea, el backend ignora el campo usuario_asignado y se la asigna a él mismo. El Frontend puede ocultar ese select para Rol 3.