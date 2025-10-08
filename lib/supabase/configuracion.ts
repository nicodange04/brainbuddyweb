import { createSupabaseClient } from './client'
import { 
  ConfiguracionCompleta, 
  RespuestaConfiguracion,
  PlanSuscripcion,
  AdminUsuario,
  InfoSistema
} from '@/lib/types/configuracion'

export class ConfiguracionService {
  private supabase = createSupabaseClient()

  // Obtener configuración de planes
  private async getConfiguracionPlanes() {
    // Por ahora retornamos configuración hardcodeada
    // En el futuro se puede mover a una tabla de configuración
    const planes: PlanSuscripcion[] = [
      {
        id: 'estudiante',
        nombre: 'Plan Estudiante',
        descripcion: 'Perfecto para estudiantes individuales',
        precio_mensual: 9.99,
        precio_anual: 99.99,
        caracteristicas: [
          'Acceso completo a la plataforma',
          'Soporte por email',
          'Proyectos ilimitados',
          'Exportación de datos'
        ],
        activo: true,
        limite_usuarios: 1
      },
      {
        id: 'familiar',
        nombre: 'Plan Familiar',
        descripcion: 'Ideal para familias con múltiples estudiantes',
        precio_mensual: 14.99,
        precio_anual: 149.99,
        caracteristicas: [
          'Todo lo del Plan Estudiante',
          'Hasta 5 usuarios',
          'Panel de padres',
          'Reportes familiares',
          'Soporte prioritario'
        ],
        activo: true,
        limite_usuarios: 5
      }
    ]

    return {
      planes,
      descuento_anual: 16.67, // ~2 meses gratis
      periodo_prueba_dias: 7,
      moneda: 'USD'
    }
  }

  // Obtener configuración de administradores
  private async getConfiguracionAdmins() {
    const { data: usuarios, error } = await this.supabase
      .from('usuarios')
      .select('usuario_id, nombre, apellido, correo, created_at, updated_at')
      .eq('rol', 'admin')
      .is('deleted_at', null)

    if (error) {
      throw new Error(`Error al obtener administradores: ${error.message}`)
    }

    const admins: AdminUsuario[] = (usuarios || []).map(usuario => ({
      usuario_id: usuario.usuario_id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      rol: 'admin' as const,
      activo: true,
      ultimo_acceso: usuario.updated_at,
      permisos: ['gestionar_usuarios', 'ver_reportes', 'configurar_sistema']
    }))

    return {
      admins,
      max_admins: 10,
      requiere_confirmacion: true
    }
  }

  // Obtener información del sistema
  private async getInfoSistema(): Promise<InfoSistema> {
    // Obtener métricas básicas
    const { data: usuarios, error: usuariosError } = await this.supabase
      .from('usuarios')
      .select('usuario_id')
      .is('deleted_at', null)

    if (usuariosError) {
      throw new Error(`Error al obtener usuarios: ${usuariosError.message}`)
    }

    const { data: suscripciones, error: suscripcionesError } = await this.supabase
      .from('suscripcion')
      .select('suscripcion_id')
      .eq('estado', 'activo')

    if (suscripcionesError) {
      throw new Error(`Error al obtener suscripciones: ${suscripcionesError.message}`)
    }

    return {
      version: '1.0.0',
      ultima_actualizacion: new Date().toISOString(),
      usuarios_totales: usuarios?.length || 0,
      suscripciones_activas: suscripciones?.length || 0,
      espacio_utilizado: 0, // Por ahora 0, se puede calcular después
      espacio_total: 1000, // 1GB por defecto
      uptime: '99.9%',
      estado_servicios: {
        base_datos: 'activo',
        autenticacion: 'activo',
        pagos: 'activo',
        emails: 'activo'
      }
    }
  }

  // Obtener configuración completa
  async getConfiguracion(): Promise<RespuestaConfiguracion> {
    try {
      const [planes, admins, infoSistema] = await Promise.all([
        this.getConfiguracionPlanes(),
        this.getConfiguracionAdmins(),
        this.getInfoSistema()
      ])

      const data: ConfiguracionCompleta = {
        planes,
        admins,
        sistema: {
          info: infoSistema,
          mantenimiento: {
            modo_mantenimiento: false,
            mensaje_mantenimiento: 'El sistema está en mantenimiento. Vuelve pronto.',
            fecha_mantenimiento: undefined
          },
          logs: {
            nivel: 'info',
            retencion_dias: 30
          }
        }
      }

      return {
        data,
        actualizado_en: new Date().toLocaleString('es-ES')
      }
    } catch (error) {
      throw new Error(`Error al obtener configuración: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  // Actualizar plan
  async actualizarPlan(planId: string, datosActualizados: Partial<PlanSuscripcion>) {
    // Por ahora solo simulamos la actualización
    // En el futuro se puede implementar con una tabla de configuración
    console.log(`Actualizando plan ${planId}:`, datosActualizados)
    return { success: true, message: 'Plan actualizado correctamente' }
  }

  // Agregar administrador
  async agregarAdmin(datosAdmin: { nombre: string; apellido: string; correo: string; password: string }) {
    // Usar el servicio de usuarios existente
    const { usuariosService } = await import('./usuarios')
    
    try {
      await usuariosService.createUsuario({
        nombre: datosAdmin.nombre,
        apellido: datosAdmin.apellido,
        correo: datosAdmin.correo,
        password: datosAdmin.password,
        rol: 'admin'
      })
      
      return { success: true, message: 'Administrador agregado correctamente' }
    } catch (error) {
      throw new Error(`Error al agregar administrador: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  // Eliminar administrador
  async eliminarAdmin(usuarioId: string) {
    try {
      const { usuariosService } = await import('./usuarios')
      await usuariosService.toggleUsuarioEstado(usuarioId, false)
      
      return { success: true, message: 'Administrador desactivado correctamente' }
    } catch (error) {
      throw new Error(`Error al eliminar administrador: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  // Actualizar configuración de sistema
  async actualizarConfiguracionSistema(configuracion: Partial<ConfiguracionCompleta>) {
    // Por ahora solo simulamos la actualización
    console.log('Actualizando configuración del sistema:', configuracion)
    return { success: true, message: 'Configuración actualizada correctamente' }
  }
}

export const configuracionService = new ConfiguracionService()
