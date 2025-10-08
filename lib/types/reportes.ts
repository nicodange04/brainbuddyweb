// Tipos para el sistema de reportes

export interface MetricasUsuarios {
  total_usuarios: number
  usuarios_activos: number
  usuarios_inactivos: number
  usuarios_nuevos_mes: number
  distribucion_roles: {
    admin: number
    alumno: number
    padre: number
  }
}

export interface MetricasFinancieras {
  mrr_actual: number
  ingresos_estudiante: number
  ingresos_familiar: number
  total_ingresos: number
  tasa_conversion: number
}

export interface MetricasSuscripciones {
  suscripciones_activas: number
  suscripciones_canceladas: number
  suscripciones_nuevas_mes: number
  plan_popular: 'estudiante' | 'familiar'
  distribucion_planes: {
    estudiante: number
    familiar: number
  }
}

export interface CrecimientoUsuario {
  mes: string
  usuarios_nuevos: number
  usuarios_totales: number
}

export interface ReportesData {
  usuarios: MetricasUsuarios
  financiero: MetricasFinancieras
  suscripciones: MetricasSuscripciones
  crecimiento: CrecimientoUsuario[]
}

export interface FiltrosReportes {
  periodo: 'mes' | 'trimestre' | 'año' | 'personalizado'
  fecha_desde?: string
  fecha_hasta?: string
}

export interface RespuestaReportes {
  data: ReportesData
  periodo: string
  generado_en: string
}
