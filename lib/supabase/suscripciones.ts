import { createSupabaseServerClient } from './server'

export interface NuevaSuscripcion {
  usuario_id: string
  plan: string
  estado: 'activo' | 'inactivo' | 'cancelada' | 'pendiente'
  fecha_inicio: string
  fecha_fin?: string | null
  mp_payment_id?: string | null
  mp_preference_id?: string | null
  mp_subscription_id?: string | null
  mp_payment_status?: string | null
  mp_external_reference?: string | null
}

export class SuscripcionesService {
  private async getSupabase() {
    return await createSupabaseServerClient()
  }

  /**
   * Crear una nueva suscripción
   */
  async crearSuscripcion(datos: NuevaSuscripcion) {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase
      .from('suscripcion')
      .insert({
        usuario_id: datos.usuario_id,
        plan: datos.plan,
        estado: datos.estado,
        fecha_inicio: datos.fecha_inicio,
        fecha_fin: datos.fecha_fin || null,
        mp_payment_id: datos.mp_payment_id || null,
        mp_preference_id: datos.mp_preference_id || null,
        mp_subscription_id: datos.mp_subscription_id || null,
        mp_payment_status: datos.mp_payment_status || null,
        mp_external_reference: datos.mp_external_reference || null
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Error al crear suscripción: ${error.message}`)
    }

    return data
  }

  /**
   * Actualizar estado de suscripción por payment ID
   */
  async actualizarSuscripcionPorPaymentId(
    paymentId: string,
    updates: {
      estado?: 'activo' | 'inactivo' | 'cancelada' | 'pendiente'
      mp_payment_status?: string
      fecha_fin?: string | null
    }
  ) {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase
      .from('suscripcion')
      .update({
        estado: updates.estado,
        mp_payment_status: updates.mp_payment_status,
        fecha_fin: updates.fecha_fin,
        updated_at: new Date().toISOString()
      })
      .eq('mp_payment_id', paymentId)
      .select()
      .single()

    if (error) {
      throw new Error(`Error al actualizar suscripción: ${error.message}`)
    }

    return data
  }

  /**
   * Buscar suscripción por external reference
   */
  async buscarPorExternalReference(externalReference: string) {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase
      .from('suscripcion')
      .select('*')
      .eq('mp_external_reference', externalReference)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw new Error(`Error al buscar suscripción: ${error.message}`)
    }

    return data
  }

  /**
   * Obtener todas las suscripciones activas
   */
  async obtenerSuscripcionesActivas() {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase
      .from('suscripcion')
      .select('*')
      .eq('estado', 'activo')
      .is('deleted_at', null)

    if (error) {
      throw new Error(`Error al obtener suscripciones: ${error.message}`)
    }

    return data || []
  }
}

export const suscripcionesService = new SuscripcionesService()

