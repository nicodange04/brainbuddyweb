import { createMercadoPagoClient } from './client'
import type { 
  CreatePreferenceRequest, 
  SubscriptionPaymentData,
  MercadoPagoPreference,
  MercadoPagoPayment
} from '@/lib/types/mercadopago'

export class MercadoPagoService {
  private _client: ReturnType<typeof createMercadoPagoClient> | null = null

  private get client() {
    if (!this._client) {
      this._client = createMercadoPagoClient()
      if (!this._client) {
        throw new Error('Mercado Pago no está configurado. Por favor, configura MERCADOPAGO_ACCESS_TOKEN en tus variables de entorno.')
      }
    }
    return this._client
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
      // Determinar la URL base según el ambiente
      const baseUrl = process.env.NODE_ENV === 'development' 
        ? (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
        : (process.env.NEXT_PUBLIC_APP_URL || 'https://brainbuddyweb.vercel.app')
      
      console.log('🌐 URL base configurada:', baseUrl)
      
      // Calcular precio según frecuencia y validar
      let unitPrice = parseFloat(data.amount.toString())
      
      // Validar que el precio sea válido y mayor a 0
      if (isNaN(unitPrice) || unitPrice <= 0) {
        throw new Error(`El precio debe ser mayor a 0. Precio recibido: ${data.amount}`)
      }
      
      // Mercado Pago requiere que el precio tenga máximo 2 decimales
      unitPrice = Math.round(unitPrice * 100) / 100
      
      // Validar monto mínimo según la moneda
      // Mercado Pago Argentina requiere mínimo $100 ARS para pagos con tarjeta
      if (data.currency === 'ARS' && unitPrice < 100) {
        throw new Error('El monto mínimo para pagos en ARS con tarjeta es $100. El precio actual es demasiado bajo.')
      }
      
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
            id: data.planId || `plan-${data.planName.toLowerCase().replace(/\s+/g, '-')}`,
            title: data.planName,
            description,
            quantity: 1,
            unit_price: unitPrice,
            currency_id: data.currency
          }
        ],
        payer: {
          email: data.userEmail || 'test_user@testuser.com',
          // Agregar más información del payer para sandbox
          name: 'Test',
          surname: 'User'
        },
        back_urls: {
          success: successUrl,
          failure: failureUrl,
          pending: pendingUrl
        },
        auto_return: 'approved',
        notification_url: `${baseUrl}/api/mercadopago/webhook`,
        external_reference: `subscription_${data.userId}_${data.planId}_${Date.now()}`,
        statement_descriptor: 'BrainBuddy',
        binary_mode: false // Permitir pagos en proceso
      } as CreatePreferenceRequest
      
      // Validar que las URLs estén definidas antes de enviar
      if (!preferenceData.back_urls?.success) {
        throw new Error('La URL de éxito no está definida')
      }

      console.log('📤 Enviando preferencia a Mercado Pago...')
      console.log('💰 Precio validado:', {
        original: data.amount,
        processed: unitPrice,
        currency: data.currency,
        meetsMinimum: unitPrice >= 100
      })
      console.log('📋 Datos de preferencia:', JSON.stringify(preferenceData, null, 2))
      
      const response = await this.client.preferences.create({ body: preferenceData })
      
      console.log('📥 Respuesta de Mercado Pago:', {
        id: response.id,
        hasInitPoint: !!response.init_point,
        hasSandboxInitPoint: !!response.sandbox_init_point,
        initPoint: response.init_point?.substring(0, 100) + '...',
        sandboxInitPoint: response.sandbox_init_point?.substring(0, 100) + '...'
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
        const errorObj = error as Record<string, unknown>
        errorMessage = String(
          errorObj.message || 
          errorObj.error || 
          errorObj.statusText || 
          JSON.stringify(error)
        )
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
   * Obtiene información de un pago desde Mercado Pago
   */
  async getPayment(paymentId: string) {
    try {
      if (!this.client) {
        throw new Error('Mercado Pago no está configurado')
      }

      // Hacer llamada a la API de Mercado Pago para obtener el pago
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Error al obtener pago: ${response.statusText}`)
      }

      const payment = await response.json()
      return payment as MercadoPagoPayment
    } catch (error) {
      console.error('Error al obtener pago:', error)
      throw error
    }
  }

  /**
   * Verifica la firma del webhook (seguridad)
   */
  verifyWebhookSignature(): boolean {
    // Implementar verificación de firma si es necesario
    // Por ahora retornamos true, pero en producción deberías verificar
    // TODO: Implementar verificación de firma con xSignature, xRequestId, dataId
    return true
  }
}

export const mercadoPagoService = new MercadoPagoService()

