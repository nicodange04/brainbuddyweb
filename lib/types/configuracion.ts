// Tipos para el sistema de configuración

export interface PlanSuscripcion {
  id: string
  nombre: string
  descripcion: string
  precio_mensual: number
  precio_anual?: number
  caracteristicas: string[]
  activo: boolean
  limite_usuarios?: number
  limite_proyectos?: number
}

export interface ConfiguracionPlanes {
  planes: PlanSuscripcion[]
  descuento_anual: number // Porcentaje de descuento para pago anual
  periodo_prueba_dias: number
  moneda: string
}

export interface AdminUsuario {
  usuario_id: string
  nombre: string
  apellido: string
  correo: string
  rol: 'admin' | 'super_admin'
  activo: boolean
  ultimo_acceso?: string
  permisos: string[]
}

export interface ConfiguracionAdmins {
  admins: AdminUsuario[]
  max_admins: number
  requiere_confirmacion: boolean
}

export interface InfoSistema {
  version: string
  ultima_actualizacion: string
  usuarios_totales: number
  suscripciones_activas: number
  espacio_utilizado: number // En MB
  espacio_total: number // En MB
  uptime: string
  estado_servicios: {
    base_datos: 'activo' | 'inactivo' | 'error'
    autenticacion: 'activo' | 'inactivo' | 'error'
    pagos: 'activo' | 'inactivo' | 'error'
    emails: 'activo' | 'inactivo' | 'error'
  }
}

export interface ConfiguracionSistema {
  info: InfoSistema
  mantenimiento: {
    modo_mantenimiento: boolean
    mensaje_mantenimiento: string
    fecha_mantenimiento?: string
  }
  logs: {
    nivel: 'error' | 'warn' | 'info' | 'debug'
    retencion_dias: number
  }
}

export interface ConfiguracionCompleta {
  planes: ConfiguracionPlanes
  admins: ConfiguracionAdmins
  sistema: ConfiguracionSistema
}

export interface RespuestaConfiguracion {
  data: ConfiguracionCompleta
  actualizado_en: string
}
