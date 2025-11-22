import { MercadoPagoConfig, Preference } from 'mercadopago'

// Cliente de Mercado Pago
export function createMercadoPagoClient() {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN

  if (!accessToken) {
    // Durante el build, no lanzar error, solo retornar null
    // El error se lanzará cuando se intente usar el cliente
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return null
    }
    // En desarrollo, retornar null para manejo graceful
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ MERCADOPAGO_ACCESS_TOKEN no está configurado. Usando modo de prueba.')
      return null
    }
    // En runtime, lanzar error
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

