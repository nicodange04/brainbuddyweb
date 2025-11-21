import { MercadoPagoConfig, Preference } from 'mercadopago'

// Cliente de Mercado Pago
export function createMercadoPagoClient() {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN

  if (!accessToken) {
    // En desarrollo, usar un token de prueba si no está configurado
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ MERCADOPAGO_ACCESS_TOKEN no está configurado. Usando modo de prueba.')
      // Retornar null para que el servicio maneje el error gracefully
      return null
    }
    throw new Error('MERCADOPAGO_ACCESS_TOKEN no está configurado en las variables de entorno')
  }

  const client = new MercadoPagoConfig({
    accessToken,
    options: {
      timeout: 5000,
      idempotencyKey: 'abc'
    }
  })

  return {
    preferences: new Preference(client)
  }
}

// Función helper para verificar si Mercado Pago está configurado
export function isMercadoPagoConfigured(): boolean {
  return !!process.env.MERCADOPAGO_ACCESS_TOKEN
}

