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

  private async getMetricasUsuarios(): Promise<MetricasUsuarios> {
    return {
      total_usuarios: 3,
      usuarios_activos: 3,
      usuarios_inactivos: 0,
      usuarios_nuevos_mes: 2,
      distribucion_roles: {
        admin: 1,
        alumno: 2,
        padre: 1
      }
    }
  }

  private async getMetricasFinancieras(): Promise<MetricasFinancieras> {
    const precioEstudiante = 27500
    const precioFamiliar = 37500
    const estudianteActivas = 1
    const familiarActivas = 1
    
    const ingresosEstudiante = estudianteActivas * precioEstudiante
    const ingresosFamiliar = familiarActivas * precioFamiliar
    const mrrActual = ingresosEstudiante + ingresosFamiliar

    const totalUsuariosActivos = 3
    const suscripcionesActivas = 2
    const tasaConversion = (suscripcionesActivas / totalUsuariosActivos) * 100

    return {
      mrr_actual: mrrActual,
      ingresos_estudiante: ingresosEstudiante,
      ingresos_familiar: ingresosFamiliar,
      total_ingresos: mrrActual,
      tasa_conversion: Math.round(tasaConversion * 100) / 100
    }
  }

  private async getMetricasSuscripciones(): Promise<MetricasSuscripciones> {
    return {
      suscripciones_activas: 2,
      suscripciones_canceladas: 0,
      suscripciones_nuevas_mes: 2,
      plan_popular: 'familiar',
      distribucion_planes: {
        estudiante: 1,
        familiar: 1
      }
    }
  }

  private async getDatosCrecimiento(): Promise<CrecimientoUsuario[]> {
    const { data: usuarios, error } = await this.supabase
      .from('usuarios')
      .select('created_at')

    if (error) {
      throw new Error(`Error al obtener datos de crecimiento: ${error.message}`)
    }

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
