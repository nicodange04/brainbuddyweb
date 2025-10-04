import { createSupabaseClient } from './client'
import { Database, Tables, Inserts } from '@/lib/types/database'

type Usuario = Tables<'usuarios'>
type NewUsuario = Inserts<'usuarios'>

export class AuthService {
  private supabase = createSupabaseClient()

  // Registro de usuario
  async signUp(email: string, password: string, nombre: string, apellido: string, rol: 'alumno' | 'padre' = 'alumno') {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    })

    if (error) throw error

    // Si el registro fue exitoso, crear el registro en la tabla usuarios
    if (data.user) {
      const { error: dbError } = await this.supabase
        .from('usuarios')
        .insert({
          usuario_id: data.user.id,
          nombre,
          apellido,
          correo: email,
          password_hash: '', // Supabase Auth se encarga de esto
          rol,
        })

      if (dbError) throw dbError

      // Crear registro en la tabla especializada
      if (rol === 'alumno') {
        await this.supabase.from('alumno').insert({
          alumno_id: data.user.id,
        })
      } else if (rol === 'padre') {
        await this.supabase.from('padre').insert({
          padre_id: data.user.id,
        })
      }
    }

    return { data, error }
  }

  // Login de usuario
  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    })

    return { data, error }
  }

  // Logout
  async signOut() {
    const { error } = await this.supabase.auth.signOut()
    return { error }
  }

  // Obtener usuario actual
  async getCurrentUser() {
    const { data: { user }, error } = await this.supabase.auth.getUser()
    return { user, error }
  }

  // Obtener datos del usuario desde nuestra tabla
  async getUserData(userId?: string) {
    const user = userId || (await this.getCurrentUser())?.user?.id
    
    if (!user) throw new Error('Usuario no autenticado')

    const { data, error } = await this.supabase
      .from('usuarios')
      .select('*')
      .eq('usuario_id', user)
      .single()

    return { data, error }
  }

  // Verificar si es admin
  async isAdmin(userId?: string) {
    try {
      const { data } = await this.getUserData(userId)
      return data?.rol === 'admin'
    } catch {
      return false
    }
  }

  // Resetear contraseña
  async resetPassword(email: string) {
    const { data, error } = await this.supabase.auth.resetPasswordForEmail(email)
    return { data, error }
  }

  // Actualizar contraseña
  async updatePassword(password: string) {
    const { data, error } = await this.supabase.auth.updateUser({
      password
    })
    return { data, error }
  }
}

export const authService = new AuthService()
