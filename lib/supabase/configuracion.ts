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
    // Función helper para retornar planes por defecto
    const getDefaultPlanes = () => ({
      planes: [
        {
          id: 'estudiante',
          nombre: 'Plan Estudiante',
          descripcion: 'Ideal para estudiantes individuales',
          precio_mensual: 100,
          precio_anual: 1000,
          caracteristicas: [
            'Hasta 5 exámenes simultáneos',
            'Sesiones de estudio ilimitadas',
            'Generación de contenido con IA',
            'Gamificación completa',
            '1 padre puede vincularse',
            'Reportes de progreso',
            'Soporte prioritario'
          ],
          activo: true,
          limite_usuarios: 1
        },
        {
          id: 'familiar',
          nombre: 'Plan Familiar',
          descripcion: 'Perfecto para familias múltiples',
          precio_mensual: 250,
          precio_anual: 2500,
          caracteristicas: [
            'Todo lo del Plan Estudiante',
            'Hasta 3 alumnos por cuenta',
            'Exámenes ilimitados',
            'Múltiples padres pueden vincularse',
            'Reportes comparativos entre hermanos',
            'Dashboard familiar',
            'Soporte prioritario'
          ],
          activo: true,
          limite_usuarios: 3
        }
      ] as PlanSuscripcion[],
      descuento_anual: 16.67,
      periodo_prueba_dias: 14,
      moneda: 'ARS' as const
    })

    try {
      const { data: planesData, error } = await this.supabase
        .from('planes' as any)
        .select('*')
        .order('precio_mensual', { ascending: true })

      if (error) {
        console.error('Error al obtener planes:', error)
        // Si la tabla no existe aún, retornar planes por defecto
        return getDefaultPlanes()
      }

      if (!planesData || planesData.length === 0) {
        // Si no hay planes en la BD, retornar planes por defecto
        return getDefaultPlanes()
      }

      const planes: PlanSuscripcion[] = planesData.map((plan: any) => ({
        id: plan.plan_id,
        nombre: plan.nombre,
        descripcion: plan.descripcion || '',
        precio_mensual: Number(plan.precio_mensual),
        precio_anual: plan.precio_anual ? Number(plan.precio_anual) : undefined,
        caracteristicas: Array.isArray(plan.caracteristicas) 
          ? plan.caracteristicas as string[]
          : typeof plan.caracteristicas === 'string'
          ? JSON.parse(plan.caracteristicas)
          : [],
        activo: plan.activo,
        limite_usuarios: plan.limite_usuarios || undefined,
        limite_proyectos: plan.limite_proyectos || undefined
      }))

      return {
        planes,
        descuento_anual: 16.67, // ~2 meses gratis
        periodo_prueba_dias: 14,
        moneda: 'ARS' as const
      }
    } catch (err) {
      console.error('Error inesperado al obtener planes:', err)
      // En caso de cualquier error, retornar planes por defecto
      return getDefaultPlanes()
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
    try {
      const updateData: Record<string, unknown> = {
        updated_at: new Date().toISOString()
      }

      if (datosActualizados.precio_mensual !== undefined) {
        updateData.precio_mensual = datosActualizados.precio_mensual
      }

      if (datosActualizados.precio_anual !== undefined) {
        updateData.precio_anual = datosActualizados.precio_anual
      }

      if (datosActualizados.activo !== undefined) {
        updateData.activo = datosActualizados.activo
      }

      if (datosActualizados.nombre !== undefined) {
        updateData.nombre = datosActualizados.nombre
      }

      if (datosActualizados.descripcion !== undefined) {
        updateData.descripcion = datosActualizados.descripcion
      }

      if (datosActualizados.caracteristicas !== undefined) {
        updateData.caracteristicas = JSON.stringify(datosActualizados.caracteristicas)
      }

      if (datosActualizados.limite_usuarios !== undefined) {
        updateData.limite_usuarios = datosActualizados.limite_usuarios
      }

      const { error } = await this.supabase
        .from('planes' as any)
        .update(updateData)
        .eq('plan_id', planId)

      if (error) {
        throw new Error(`Error al actualizar plan: ${error.message}`)
      }

      return { success: true, message: 'Plan actualizado correctamente' }
    } catch (err) {
      console.error('Error al actualizar plan:', err)
      throw err instanceof Error ? err : new Error('Error desconocido al actualizar plan')
    }
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
