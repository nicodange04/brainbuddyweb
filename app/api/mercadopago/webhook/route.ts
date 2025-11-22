import { NextRequest, NextResponse } from 'next/server'
import type { MercadoPagoWebhook } from '@/lib/types/mercadopago'
import { mercadoPagoService } from '@/lib/mercadopago/pagos'
import { suscripcionesService } from '@/lib/supabase/suscripciones'

export const maxDuration = 30

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as MercadoPagoWebhook
    
    // Verificar que es una notificación de pago
    if (body.type !== 'payment') {
      return NextResponse.json({ received: true })
    }

    const paymentId = body.data.id
    
    // Obtener información completa del pago desde Mercado Pago
    const payment = await mercadoPagoService.getPayment(paymentId)
    
    if (!payment) {
      console.error('No se pudo obtener información del pago:', paymentId)
      return NextResponse.json({ received: true })
    }

    console.log('📦 Webhook recibido - Pago:', {
      paymentId: payment.id,
      status: payment.status,
      externalReference: payment.external_reference,
      amount: payment.transaction_amount
    })

    // Extraer información de la referencia externa
    // Formato: subscription_{userId}_{planId}_{timestamp}
    const externalRef = payment.external_reference || ''
    const refParts = externalRef.split('_')
    
    if (refParts.length < 3 || refParts[0] !== 'subscription') {
      console.error('Referencia externa inválida:', externalRef)
      return NextResponse.json({ received: true })
    }

    const userId = refParts[1]
    const planId = refParts[2]

    // Buscar si ya existe una suscripción con este payment_id
    const suscripcionExistente = await suscripcionesService.buscarPorExternalReference(externalRef)

    if (payment.status === 'approved') {
      // Pago aprobado - crear o actualizar suscripción
      if (suscripcionExistente) {
        // Actualizar suscripción existente
        await suscripcionesService.actualizarSuscripcionPorPaymentId(
          String(payment.id),
          {
            estado: 'activo',
            mp_payment_status: payment.status
          }
        )
        console.log('✅ Suscripción actualizada:', suscripcionExistente.suscripcion_id)
      } else {
        // Crear nueva suscripción
        const fechaFin = payment.date_approved 
          ? new Date(new Date(payment.date_approved).getTime() + (365 * 24 * 60 * 60 * 1000)).toISOString() // 1 año desde aprobación
          : null

        await suscripcionesService.crearSuscripcion({
          usuario_id: userId,
          plan: planId,
          estado: 'activo',
          fecha_inicio: payment.date_approved || new Date().toISOString(),
          fecha_fin: fechaFin,
          mp_payment_id: String(payment.id),
          mp_payment_status: payment.status,
          mp_external_reference: externalRef
        })
        console.log('✅ Nueva suscripción creada para usuario:', userId)
      }
    } else if (payment.status === 'rejected' || payment.status === 'cancelled') {
      // Pago rechazado o cancelado
      if (suscripcionExistente) {
        await suscripcionesService.actualizarSuscripcionPorPaymentId(
          String(payment.id),
          {
            estado: 'cancelada',
            mp_payment_status: payment.status
          }
        )
        console.log('❌ Suscripción cancelada:', suscripcionExistente.suscripcion_id)
      }
    } else if (payment.status === 'pending') {
      // Pago pendiente
      if (!suscripcionExistente) {
        await suscripcionesService.crearSuscripcion({
          usuario_id: userId,
          plan: planId,
          estado: 'pendiente',
          fecha_inicio: new Date().toISOString(),
          mp_payment_id: String(payment.id),
          mp_payment_status: payment.status,
          mp_external_reference: externalRef
        })
        console.log('⏳ Suscripción pendiente creada para usuario:', userId)
      }
    }

    // Siempre retornar 200 para que Mercado Pago sepa que recibimos la notificación
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error procesando webhook:', error)
    // Aún así retornamos 200 para que Mercado Pago no reenvíe
    return NextResponse.json({ received: true })
  }
}

