import { createSupabaseClient } from './client'
import { 
  UsuarioCompleto, 
  FiltrosUsuarios, 
  RespuestaUsuarios, 
  FormularioUsuario,
  HistorialSuscripcion,
  UpdateUsuario
} from '@/lib/types/usuarios'
import { CONTRASEÑA_TEMPORAL_LONGITUD } from '@/lib/config/constants'

export class UsuariosService {
  private supabase = createSupabaseClient()

  // Generar contraseña temporal única
  private generateTempPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < CONTRASEÑA_TEMPORAL_LONGITUD; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  // Cambio de info para hacer un final commit
  async getUsuarios(
    filtros: FiltrosUsuarios = {},
    page: number = 1,
    limit: number = 10
  ): Promise<RespuestaUsuarios> {
    let query = this.supabase
      .from('usuarios')
      .select('*', { count: 'exact' })

    // Aplicar filtros
    if (filtros.rol && filtros.rol !== '') {
      query = query.eq('rol', filtros.rol)
    }

    if (filtros.estado && filtros.estado !== '') {
      if (filtros.estado === 'activo') {
        query = query.is('deleted_at', null)
      } else {
        query = query.not('deleted_at', 'is', null)
      }
    }

    if (filtros.fecha_desde) {
      query = query.gte('created_at', filtros.fecha_desde)
    }

    if (filtros.fecha_hasta) {
      query = query.lte('created_at', filtros.fecha_hasta)
    }

    if (filtros.busqueda && filtros.busqueda.trim() !== '') {
      query = query.or(`nombre.ilike.%${filtros.busqueda}%,apellido.ilike.%${filtros.busqueda}%,correo.ilike.%${filtros.busqueda}%`)
    }

    // Aplicar paginación
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    // Ordenar por fecha de creación descendente
    query = query.order('created_at', { ascending: false })

    const { data, error, count } = await query

    if (error) {
      throw new Error(`Error al obtener usuarios: ${error.message}`)
    }

    const total = count || 0
    const totalPages = Math.ceil(total / limit)

    // Construir objetos UsuarioCompleto
    const usuariosCompletos: UsuarioCompleto[] = (data || []).map(usuario => ({
      ...usuario,
      estado_usuario: usuario.deleted_at ? 'Inactivo' : 'Activo',
      plan: null, // Por ahora null, después podemos agregar lógica de suscripciones
      estado_suscripcion: null,
      suscripcion_vigente: null
    }))

    return {
      usuarios: usuariosCompletos,
      paginacion: {
        page,
        limit,
        total,
        totalPages
      }
    }
  }

  // Obtener usuario por ID
  async getUsuarioById(usuarioId: string): Promise<UsuarioCompleto> {
    const { data, error } = await this.supabase
      .from('usuarios')
      .select('*')
      .eq('usuario_id', usuarioId)
      .limit(1)

    if (error) {
      throw new Error(`Error al obtener usuario: ${error.message}`)
    }

    if (!data || data.length === 0) {
      throw new Error(`Usuario no encontrado con ID: ${usuarioId}`)
    }

    const usuario = data[0]
    
    // Construir el objeto UsuarioCompleto
    const usuarioCompleto: UsuarioCompleto = {
      ...usuario,
      estado_usuario: usuario.deleted_at ? 'Inactivo' : 'Activo',
      plan: null, // Por ahora null, después podemos agregar lógica de suscripciones
      estado_suscripcion: null,
      suscripcion_vigente: null
    }

    return usuarioCompleto
  }

  // Crear nuevo usuario
  async createUsuario(usuarioData: FormularioUsuario): Promise<UsuarioCompleto> {
    // Primero crear el usuario en Supabase Auth usando signUp
    const { data: authData, error: authError } = await this.supabase.auth.signUp({
      email: usuarioData.correo,
      password: usuarioData.password || this.generateTempPassword(), // Contraseña temporal única
      options: {
        data: {
          nombre: usuarioData.nombre,
          apellido: usuarioData.apellido,
          rol: usuarioData.rol
        }
      }
    })

    if (authError) {
      throw new Error(`Error al crear usuario en auth: ${authError.message}`)
    }

    if (!authData.user) {
      throw new Error('No se pudo crear el usuario')
    }

    // Crear registro en tabla usuarios usando RPC (función de servidor)
    // Esto evita problemas con RLS ya que se ejecuta con permisos de servidor
    const { data: rpcResult, error: usuarioError } = await this.supabase
      .rpc('create_user_record', {
        p_usuario_id: authData.user.id,
        p_nombre: usuarioData.nombre,
        p_apellido: usuarioData.apellido,
        p_correo: usuarioData.correo,
        p_rol: usuarioData.rol
      })

    if (usuarioError) {
      throw new Error(`Error al crear usuario en BD: ${usuarioError.message}`)
    }

    // Verificar que la función RPC fue exitosa
    if (!rpcResult || !rpcResult.success) {
      throw new Error(`Error en función RPC: ${rpcResult?.error || 'Error desconocido'}`)
    }

    // Retornar el usuario completo
    return this.getUsuarioById(authData.user.id)
  }

  // Actualizar usuario
  async updateUsuario(usuarioId: string, updateData: Partial<FormularioUsuario>): Promise<UsuarioCompleto> {
    const updateFields: UpdateUsuario = {}

    if (updateData.nombre) updateFields.nombre = updateData.nombre
    if (updateData.apellido) updateFields.apellido = updateData.apellido
    if (updateData.correo) updateFields.correo = updateData.correo
    if (updateData.rol) updateFields.rol = updateData.rol

    const { error } = await this.supabase
      .from('usuarios')
      .update(updateFields)
      .eq('usuario_id', usuarioId)

    if (error) {
      throw new Error(`Error al actualizar usuario: ${error.message}`)
    }

    // Si cambió el rol, actualizar las tablas especializadas
    if (updateData.rol) {
      // Eliminar de todas las tablas especializadas
      await this.supabase.from('admin').delete().eq('admin_id', usuarioId)
      await this.supabase.from('alumno').delete().eq('alumno_id', usuarioId)
      await this.supabase.from('padre').delete().eq('padre_id', usuarioId)

      // Agregar a la tabla correspondiente
      if (updateData.rol === 'admin') {
        await this.supabase.from('admin').insert({ admin_id: usuarioId })
      } else if (updateData.rol === 'alumno') {
        await this.supabase.from('alumno').insert({ alumno_id: usuarioId })
      } else if (updateData.rol === 'padre') {
        await this.supabase.from('padre').insert({ padre_id: usuarioId })
      }
    }

    return this.getUsuarioById(usuarioId)
  }

  // Activar/Desactivar usuario (soft delete)
  async toggleUsuarioEstado(usuarioId: string, activar: boolean): Promise<UsuarioCompleto> {
    const updateData: UpdateUsuario = {
      deleted_at: activar ? null : new Date().toISOString()
    }

    const { error } = await this.supabase
      .from('usuarios')
      .update(updateData)
      .eq('usuario_id', usuarioId)

    if (error) {
      throw new Error(`Error al cambiar estado del usuario: ${error.message}`)
    }

    return this.getUsuarioById(usuarioId)
  }

  // Obtener historial de suscripciones de un usuario
  async getHistorialSuscripciones(usuarioId: string): Promise<HistorialSuscripcion[]> {
    const { data, error } = await this.supabase
      .from('suscripcion')
      .select('*')
      .eq('usuario_id', usuarioId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Error al obtener historial de suscripciones: ${error.message}`)
    }

    return data as HistorialSuscripcion[]
  }

  // Eliminar usuario permanentemente (solo para admins)
  // NOTA: Esta función requiere permisos de admin de Supabase
  // Para uso en producción, implementar como API route server-side
  async deleteUsuario(usuarioId: string): Promise<void> {
    // Solo eliminamos de la BD, no podemos eliminar de Auth desde el cliente
    const { error: dbError } = await this.supabase
      .from('usuarios')
      .delete()
      .eq('usuario_id', usuarioId)

    if (dbError) {
      throw new Error(`Error al eliminar usuario de BD: ${dbError.message}`)
    }
  }
}

export const usuariosService = new UsuariosService()
