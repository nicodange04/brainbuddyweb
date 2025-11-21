import { createMercadoPagoClient } from './client'
import type { 
  CreatePreferenceRequest, 
  SubscriptionPaymentData,
  MercadoPagoPreference 
} from '@/lib/types/mercadopago'

export class MercadoPagoService {
  private client = createMercadoPagoClient()

  constructor() {
    if (!this.client) {
      console.warn('⚠️ Mercado Pago no está configurado. Las funciones de pago no estarán disponibles.')
    }
  }

  /**
   * Crea una preferencia de pago para una suscripción
   */
  async createSubscriptionPreference(
    data: SubscriptionPaymentData
  ): Promise<MercadoPagoPreference> {
    if (!this.client) {
      throw new Error('Mercado Pago no está configurado. Por favor, configura MERCADOPAGO_ACCESS_TOKEN en tus variables de entorno.')
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      
      // Calcular precio según frecuencia
      const unitPrice = data.amount
      const description = data.frequency === 'monthly' 
        ? `Suscripción mensual - ${data.planName}`
        : `Suscripción anual - ${data.planName}`

      // Construir URLs de retorno
      const successUrl = `${baseUrl}/pago/exito?plan=${data.planId}`
      const failureUrl = `${baseUrl}/pago/error`
      const pendingUrl = `${baseUrl}/pago/pendiente`
      
      const preferenceData: CreatePreferenceRequest = {
        items: [
          {
            title: data.planName,
            description,
            quantity: 1,
            unit_price: unitPrice,
            currency_id: data.currency
          }
        ],
        payer: {
          email: data.userEmail
        },
        back_urls: {
          success: successUrl,
          failure: failureUrl,
          pending: pendingUrl
        },
        notification_url: `${baseUrl}/api/mercadopago/webhook`,
        external_reference: `subscription_${data.userId}_${data.planId}_${Date.now()}`,
        statement_descriptor: 'BrainBuddy'
      }
      
      // Validar que las URLs estén definidas antes de enviar
      if (!preferenceData.back_urls?.success) {
        throw new Error('La URL de éxito no está definida')
      }

      console.log('📤 Enviando preferencia a Mercado Pago...')
      console.log('📋 Datos de preferencia:', JSON.stringify(preferenceData, null, 2))
      
      const response = await this.client.preferences.create({ body: preferenceData })
      
      console.log('📥 Respuesta de Mercado Pago:', {
        id: response.id,
        hasInitPoint: !!response.init_point,
        hasSandboxInitPoint: !!response.sandbox_init_point
      })

      if (!response.id || !response.init_point) {
        console.error('❌ Respuesta inválida de Mercado Pago:', response)
        throw new Error('Mercado Pago no devolvió una preferencia válida')
      }

      return {
        id: response.id,
        init_point: response.init_point,
        sandbox_init_point: response.sandbox_init_point || response.init_point
      }
    } catch (error) {
      // Log detallado del error
      console.error('Error al crear preferencia de Mercado Pago:', error)
      console.error('Tipo de error:', typeof error)
      console.error('Error completo:', JSON.stringify(error, null, 2))
      
      // Extraer mensaje del error
      let errorMessage = 'Error desconocido'
      
      if (error instanceof Error) {
        errorMessage = error.message
        console.error('Mensaje de error:', errorMessage)
        console.error('Stack:', error.stack)
      } else if (typeof error === 'object' && error !== null) {
        // Intentar extraer mensaje de objeto de error
        const errorObj = error as any
        errorMessage = errorObj.message || errorObj.error || errorObj.statusText || JSON.stringify(error)
        console.error('Error objeto:', errorObj)
      }
      
      // Mensajes de error más específicos
      if (errorMessage.includes('401') || errorMessage.includes('Unauthorized') || errorMessage.includes('authentication')) {
        throw new Error('Credenciales de Mercado Pago inválidas. Verifica tu Access Token en .env.local')
      }
      if (errorMessage.includes('400') || errorMessage.includes('Bad Request')) {
        throw new Error('Datos inválidos para crear el pago. Verifica los datos del plan.')
      }
      if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        throw new Error('Error de conexión con Mercado Pago. Verifica tu conexión a internet.')
      }
      
      throw new Error(`Error al crear preferencia de pago: ${errorMessage}`)
    }
  }

  /**
   * Obtiene información de un pago
   */
  async getPayment(paymentId: string) {
    try {
      // Nota: Necesitarías el SDK de Payments para esto
      // Por ahora retornamos null y lo manejamos en el webhook
      return null
    } catch (error) {
      console.error('Error al obtener pago:', error)
      throw error
    }
  }

  /**
   * Verifica la firma del webhook (seguridad)
   */
  verifyWebhookSignature(
    xSignature: string,
    xRequestId: string,
    dataId: string
  ): boolean {
    // Implementar verificación de firma si es necesario
    // Por ahora retornamos true, pero en producción deberías verificar
    return true
  }
}

export const mercadoPagoService = new MercadoPagoService()

