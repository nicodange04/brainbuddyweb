import { createSupabaseClient } from './client'
import { 
  ReportesData, 
  FiltrosReportes, 
  RespuestaReportes,
  MetricasUsuarios,
  MetricasFinancieras,
  MetricasSuscripciones,
  CrecimientoUsuario
} from '@/lib/types/reportes'

export class ReportesService {
  private supabase = createSupabaseClient()

  // Obtener métricas de usuarios
  private async getMetricasUsuarios(): Promise<MetricasUsuarios> {
    const { data: usuarios, error } = await this.supabase
      .from('usuarios')
      .select('rol, deleted_at, created_at')

    if (error) {
      throw new Error(`Error al obtener métricas de usuarios: ${error.message}`)
    }

    const totalUsuarios = usuarios.length
    const usuariosActivos = usuarios.filter(u => !u.deleted_at).length
    const usuariosInactivos = totalUsuarios - usuariosActivos

    // Usuarios nuevos este mes
    const inicioMes = new Date()
    inicioMes.setDate(1)
    inicioMes.setHours(0, 0, 0, 0)
    
    const usuariosNuevosMes = usuarios.filter(u => 
      new Date(u.created_at) >= inicioMes
    ).length

    // Distribución por roles
    const distribucionRoles = usuarios.reduce((acc, usuario) => {
      acc[usuario.rol as keyof typeof acc]++
      return acc
    }, { admin: 0, alumno: 0, padre: 0 })

    return {
      total_usuarios: totalUsuarios,
      usuarios_activos: usuariosActivos,
      usuarios_inactivos: usuariosInactivos,
      usuarios_nuevos_mes: usuariosNuevosMes,
      distribucion_roles: distribucionRoles
    }
  }

  // Obtener métricas financieras
  private async getMetricasFinancieras(): Promise<MetricasFinancieras> {
    const { data: suscripciones, error } = await this.supabase
      .from('suscripcion')
      .select('plan, estado')

    if (error) {
      throw new Error(`Error al obtener métricas financieras: ${error.message}`)
    }

    // Obtener precios actuales de la tabla planes
    interface PlanPrecio {
      plan_id: string
      nombre: string
      precio_mensual: number
    }

    const { data: planes, error: planesError } = await this.supabase
      .from('planes' as never)
      .select('plan_id, nombre, precio_mensual')
      .eq('activo', true)

    // Precios por defecto si no se pueden obtener de la BD
    let precioEstudiante = 25000
    let precioFamiliar = 37500

    if (!planesError && planes) {
      const planesTyped = planes as PlanPrecio[]
      const planEstudiante = planesTyped.find((p) => p.plan_id === 'estudiante' || p.nombre === 'Plan Estudiante')
      const planFamiliar = planesTyped.find((p) => p.plan_id === 'familiar' || p.nombre === 'Plan Familiar')
      
      if (planEstudiante) {
        precioEstudiante = Number(planEstudiante.precio_mensual) || 25000
      }
      if (planFamiliar) {
        precioFamiliar = Number(planFamiliar.precio_mensual) || 37500
      }
    }

    const suscripcionesActivas = suscripciones.filter(s => s.estado === 'activo')
    
    // Contar por plan
    const estudianteActivas = suscripcionesActivas.filter(s => s.plan === 'Plan Estudiante').length
    const familiarActivas = suscripcionesActivas.filter(s => s.plan === 'Plan Familiar').length
    
    const ingresosEstudiante = estudianteActivas * precioEstudiante
    const ingresosFamiliar = familiarActivas * precioFamiliar
    const mrrActual = ingresosEstudiante + ingresosFamiliar

    // Obtener total de usuarios para calcular tasa de conversión
    const { data: usuarios, error: usuariosError } = await this.supabase
      .from('usuarios')
      .select('usuario_id')
      .is('deleted_at', null)

    if (usuariosError) {
      throw new Error(`Error al obtener usuarios para conversión: ${usuariosError.message}`)
    }

    const totalUsuariosActivos = usuarios.length
    const tasaConversion = totalUsuariosActivos > 0 ? (suscripcionesActivas.length / totalUsuariosActivos) * 100 : 0

    return {
      mrr_actual: mrrActual,
      ingresos_estudiante: ingresosEstudiante,
      ingresos_familiar: ingresosFamiliar,
      total_ingresos: mrrActual,
      tasa_conversion: Math.round(tasaConversion * 100) / 100
    }
  }

  // Obtener métricas de suscripciones
  private async getMetricasSuscripciones(): Promise<MetricasSuscripciones> {
    const { data: suscripciones, error } = await this.supabase
      .from('suscripcion')
      .select('plan, estado, created_at')

    if (error) {
      throw new Error(`Error al obtener métricas de suscripciones: ${error.message}`)
    }

    const suscripcionesActivas = suscripciones.filter(s => s.estado === 'activo').length
    const suscripcionesCanceladas = suscripciones.filter(s => s.estado === 'cancelada').length

    // Suscripciones nuevas este mes
    const inicioMes = new Date()
    inicioMes.setDate(1)
    inicioMes.setHours(0, 0, 0, 0)
    
    const suscripcionesNuevasMes = suscripciones.filter(s => 
      new Date(s.created_at) >= inicioMes
    ).length

    // Distribución por planes
    const distribucionPlanes = suscripciones.reduce((acc, suscripcion) => {
      if (suscripcion.plan === 'Plan Estudiante') {
        acc.estudiante++
      } else if (suscripcion.plan === 'Plan Familiar') {
        acc.familiar++
      }
      return acc
    }, { estudiante: 0, familiar: 0 })

    const planPopular = distribucionPlanes.estudiante > distribucionPlanes.familiar ? 'estudiante' : 'familiar'

    return {
      suscripciones_activas: suscripcionesActivas,
      suscripciones_canceladas: suscripcionesCanceladas,
      suscripciones_nuevas_mes: suscripcionesNuevasMes,
      plan_popular: planPopular,
      distribucion_planes: distribucionPlanes
    }
  }

  // Obtener datos de crecimiento (últimos 6 meses)
  private async getDatosCrecimiento(): Promise<CrecimientoUsuario[]> {
    const { data: usuarios, error } = await this.supabase
      .from('usuarios')
      .select('created_at')

    if (error) {
      throw new Error(`Error al obtener datos de crecimiento: ${error.message}`)
    }

    // Generar datos de los últimos 6 meses
    const meses = []
    const ahora = new Date()
    
    for (let i = 5; i >= 0; i--) {
      const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1)
      const mesSiguiente = new Date(ahora.getFullYear(), ahora.getMonth() - i + 1, 1)
      
      const usuariosMes = usuarios.filter(u => {
        const fechaUsuario = new Date(u.created_at)
        return fechaUsuario >= fecha && fechaUsuario < mesSiguiente
      }).length

      const usuariosTotalesHastaMes = usuarios.filter(u => {
        const fechaUsuario = new Date(u.created_at)
        return fechaUsuario < mesSiguiente
      }).length

      meses.push({
        mes: fecha.toLocaleDateString('es-ES', { year: 'numeric', month: 'short' }),
        usuarios_nuevos: usuariosMes,
        usuarios_totales: usuariosTotalesHastaMes
      })
    }

    return meses
  }

  // Método principal para obtener todos los reportes
  async getReportes(filtros: FiltrosReportes = { periodo: 'mes' }): Promise<RespuestaReportes> {
    try {
      const [usuarios, financiero, suscripciones, crecimiento] = await Promise.all([
        this.getMetricasUsuarios(),
        this.getMetricasFinancieras(),
        this.getMetricasSuscripciones(),
        this.getDatosCrecimiento()
      ])

      const data: ReportesData = {
        usuarios,
        financiero,
        suscripciones,
        crecimiento
      }

      return {
        data,
        periodo: this.getPeriodoDescripcion(filtros.periodo),
        generado_en: new Date().toLocaleString('es-ES')
      }
    } catch (error) {
      throw new Error(`Error al generar reportes: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  // Obtener descripción del período
  private getPeriodoDescripcion(periodo: string): string {
    const descripciones = {
      mes: 'Último mes',
      trimestre: 'Último trimestre',
      año: 'Último año',
      personalizado: 'Período personalizado'
    }
    return descripciones[periodo as keyof typeof descripciones] || 'Período no definido'
  }
}

export const reportesService = new ReportesService()
