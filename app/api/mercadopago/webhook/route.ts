import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { MercadoPagoWebhook, MercadoPagoPayment } from '@/lib/types/mercadopago'

export const maxDuration = 30

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as MercadoPagoWebhook
    
    // Verificar que es una notificación de pago
    if (body.type !== 'payment') {
      return NextResponse.json({ received: true })
    }

    // Obtener información del pago desde Mercado Pago
    // Nota: Necesitarías hacer una llamada a la API de Mercado Pago aquí
    // Por ahora, procesamos con la información del webhook
    
    if (body.action === 'payment.created' || body.action === 'payment.updated') {
      // El pago fue creado o actualizado
      // Aquí deberías:
      // 1. Obtener el pago completo desde Mercado Pago
      // 2. Actualizar la suscripción en la base de datos
      // 3. Activar/desactivar según el estado del pago
      
      console.log('Webhook recibido:', {
        paymentId: body.data.id,
        action: body.action,
        type: body.type
      })
      
      // TODO: Implementar lógica para actualizar suscripción en base de datos
      // const supabase = await createSupabaseServerClient()
      // Actualizar suscripción según el estado del pago
    }

    // Siempre retornar 200 para que Mercado Pago sepa que recibimos la notificación
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error procesando webhook:', error)
    // Aún así retornamos 200 para que Mercado Pago no reenvíe
    return NextResponse.json({ received: true })
  }
}

