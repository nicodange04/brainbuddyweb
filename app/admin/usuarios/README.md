# Gestión de Usuarios - Brain Buddy Admin

## Descripción
Sistema completo de gestión de usuarios para el panel de administración de Brain Buddy. Permite a los administradores gestionar todos los usuarios del sistema (alumnos, padres y administradores) con operaciones CRUD completas.

## Funcionalidades Implementadas

### 📋 Lista de Usuarios
- **Tabla responsive** con información completa de usuarios
- **Paginación** automática (10 usuarios por página)
- **Vista móvil** con cards adaptativos
- **Información mostrada**: nombre, apellido, correo, rol, estado, suscripción, fecha de registro

### 🔍 Filtros y Búsqueda
- **Búsqueda por texto**: nombre, apellido o correo
- **Filtro por rol**: admin, alumno, padre
- **Filtro por estado**: activo, inactivo
- **Filtro por fechas**: rango de fechas de registro
- **Filtros activos**: visualización y eliminación individual
- **Aplicación en tiempo real** de filtros

### ➕ Crear Usuario
- **Formulario completo** con validaciones
- **Campos requeridos**: nombre, apellido, correo, contraseña, rol
- **Validación de email** con regex
- **Contraseña mínima** de 6 caracteres
- **Creación automática** en Supabase Auth y tablas especializadas
- **Manejo de errores** con mensajes descriptivos

### ✏️ Editar Usuario
- **Edición de información personal**: nombre, apellido, correo
- **Cambio de rol** con actualización automática de tablas especializadas
- **Actualización de contraseña** opcional
- **Validaciones** en tiempo real
- **Preservación de datos** existentes

### 👁️ Vista de Detalle
- **Información completa** del usuario
- **Historial de suscripciones** asociadas
- **Información de registro** y actualizaciones
- **Estado de suscripción actual**
- **Acceso rápido** a edición desde el detalle

### ⏸️ Activar/Desactivar Usuarios
- **Soft delete** usando campo `deleted_at`
- **No eliminación física** de datos
- **Reactivación** de usuarios desactivados
- **Confirmación visual** del estado actual

## Arquitectura Técnica

### 🗂️ Estructura de Archivos
```
app/admin/usuarios/
├── page.tsx                    # Página principal
├── components/
│   ├── UsuariosTable.tsx      # Tabla de usuarios
│   ├── FiltrosUsuarios.tsx    # Componente de filtros
│   ├── UsuarioForm.tsx        # Formulario crear/editar
│   ├── UsuarioDetail.tsx      # Vista de detalle
│   └── index.ts               # Exportaciones
└── README.md                  # Documentación

lib/
├── types/usuarios.ts          # Tipos TypeScript
└── supabase/usuarios.ts       # Servicio de API
```

### 🔧 Componentes Principales

#### UsuariosTable
- Tabla responsive con paginación
- Acciones por fila (ver, editar, activar/desactivar)
- Vista móvil adaptativa
- Badges para roles y estados

#### FiltrosUsuarios
- Filtros múltiples con estado local
- Aplicación y limpieza de filtros
- Visualización de filtros activos
- Validación de fechas

#### UsuarioForm
- Modal reutilizable para crear/editar
- Validaciones en tiempo real
- Manejo de contraseñas opcionales
- Estados de carga y error

#### UsuarioDetail
- Modal de información completa
- Historial de suscripciones
- Información de registro
- Acceso a edición

### 🗄️ Integración con Base de Datos

#### Tablas Utilizadas
- `usuarios`: Tabla principal de usuarios
- `admin`: Tabla especializada para administradores
- `alumno`: Tabla especializada para alumnos
- `padre`: Tabla especializada para padres
- `suscripcion`: Historial de suscripciones
- `v_usuarios_completos`: Vista con información completa
- `v_metricas_dashboard`: Métricas para dashboard

#### Operaciones CRUD
- **Create**: Creación en Auth + tablas especializadas
- **Read**: Consultas con filtros y paginación
- **Update**: Actualización con sincronización de roles
- **Delete**: Soft delete con campo `deleted_at`

### 🔐 Seguridad
- **Autenticación requerida** para acceso
- **Verificación de rol admin** en todas las operaciones
- **Validaciones de entrada** en formularios
- **Manejo seguro de contraseñas**
- **Políticas RLS** de Supabase aplicadas

## Uso

### Acceso
1. Iniciar sesión como administrador
2. Ir al dashboard (`/admin/dashboard`)
3. Hacer clic en "👥 Gestionar Usuarios"

### Operaciones Comunes

#### Crear Usuario
1. Hacer clic en "Nuevo Usuario"
2. Completar formulario con datos requeridos
3. Seleccionar rol apropiado
4. Guardar usuario

#### Editar Usuario
1. Hacer clic en el ícono de editar (✏️) en la tabla
2. Modificar campos necesarios
3. Guardar cambios

#### Ver Detalle
1. Hacer clic en el ícono de ver (👁️) en la tabla
2. Revisar información completa
3. Acceder a historial de suscripciones

#### Activar/Desactivar
1. Hacer clic en el ícono de pausa/play (⏸️/▶️)
2. Confirmar acción
3. Estado se actualiza automáticamente

## Tecnologías Utilizadas
- **Next.js 14** con App Router
- **TypeScript** para tipado estático
- **Supabase** para base de datos y autenticación
- **Tailwind CSS** para estilos
- **React Hooks** para manejo de estado
- **Componentes modulares** y reutilizables

## Próximas Mejoras
- [ ] Exportación de datos a CSV/Excel
- [ ] Notificaciones por email al crear usuarios
- [ ] Historial de cambios en usuarios
- [ ] Búsqueda avanzada con múltiples criterios
- [ ] Bulk actions (activar/desactivar múltiples usuarios)
- [ ] Integración con sistema de notificaciones
