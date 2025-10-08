import { Tables, Inserts, Updates } from './database'

export type Usuario = Tables<'usuarios'>
export type NewUsuario = Inserts<'usuarios'>
export type UpdateUsuario = Updates<'usuarios'>

export interface UsuarioCompleto extends Usuario {
  estado_usuario: 'Activo' | 'Inactivo'
  plan?: string
  estado_suscripcion?: string
  suscripcion_vigente?: 'Vigente' | 'Expirada'
}

export interface FiltrosUsuarios {
  rol?: 'admin' | 'alumno' | 'padre' | ''
  estado?: 'activo' | 'inactivo' | ''
  fecha_desde?: string
  fecha_hasta?: string
  busqueda?: string
}

export interface PaginacionUsuarios {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface RespuestaUsuarios {
  usuarios: UsuarioCompleto[]
  paginacion: PaginacionUsuarios
}

export interface FormularioUsuario {
  nombre: string
  apellido: string
  correo: string
  password?: string
  rol: 'admin' | 'alumno' | 'padre'
}

export interface HistorialSuscripcion {
  suscripcion_id: string
  plan: string
  estado: string
  fecha_inicio: string
  fecha_fin?: string
  created_at: string
}
