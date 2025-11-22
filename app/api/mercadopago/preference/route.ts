import { NextRequest, NextResponse } from 'next/server'
import { mercadoPagoService } from '@/lib/mercadopago/pagos'
import { authService } from '@/lib/supabase/auth'
import type { SubscriptionPaymentData } from '@/lib/types/mercadopago'

export const maxDuration = 30

export async function POST(request: NextRequest) {
  try {
    // Verificar que Mercado Pago esté configurado (solo en runtime, no durante build)
    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      return NextResponse.json(
        { 
          error: 'Mercado Pago no está configurado',
          message: 'Por favor, configura MERCADOPAGO_ACCESS_TOKEN en tus variables de entorno en Vercel'
        },
        { status: 500 }
      )
    }

    // Leer el body primero
    const body = await request.json()
    const { planId, planName, amount, currency, frequency } = body

    // Verificar autenticación (temporalmente opcional para pruebas)
    let user = null
    try {
      const authResult = await authService.getCurrentUser()
      user = authResult.user
    } catch {
      console.warn('Usuario no autenticado, continuando con datos del body')
    }
    
    // Si no hay usuario autenticado, usar datos del body
    const userId = user?.id || 'guest_' + Date.now()
    const userEmail = user?.email || body.userEmail || 'test@example.com'

    // Validar datos requeridos
    if (!planId || !planName || !amount || !currency || !frequency) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      )
    }

    // Preparar datos para la preferencia
    const paymentData: SubscriptionPaymentData = {
      planId,
      planName,
      userId,
      userEmail,
      amount: parseFloat(amount),
      currency: currency as 'ARS' | 'USD' | 'BRL' | 'MXN' | 'CLP' | 'COP' | 'PEN' | 'UYU',
      frequency: frequency as 'monthly' | 'annual'
    }

    // Crear preferencia de pago
    console.log('📦 Datos del pago:', JSON.stringify(paymentData, null, 2))
    console.log('🔑 Access Token configurado:', !!process.env.MERCADOPAGO_ACCESS_TOKEN)
    console.log('🔑 Access Token empieza con:', process.env.MERCADOPAGO_ACCESS_TOKEN?.substring(0, 10))
    
    const preference = await mercadoPagoService.createSubscriptionPreference(paymentData)
    
    console.log('✅ Preferencia creada exitosamente:', preference.id)

    // Determinar qué URL usar según el tipo de credenciales
    const isProduction = process.env.MERCADOPAGO_ACCESS_TOKEN?.startsWith('APP_USR-')
    const paymentUrl = isProduction 
      ? preference.init_point 
      : (preference.sandbox_init_point || preference.init_point)

    return NextResponse.json({
      success: true,
      preferenceId: preference.id,
      initPoint: preference.init_point,
      sandboxInitPoint: preference.sandbox_init_point,
      paymentUrl: paymentUrl // URL correcta según el tipo de credenciales
    })
  } catch (error) {
    console.error('Error al crear preferencia:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    
    // Mensaje más específico según el tipo de error
    let userMessage = 'Error al crear preferencia de pago'
    if (errorMessage.includes('no está configurado')) {
      userMessage = 'Mercado Pago no está configurado. Por favor, configura las credenciales.'
    } else if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
      userMessage = 'Credenciales de Mercado Pago inválidas. Verifica tu Access Token.'
    } else if (errorMessage.includes('400') || errorMessage.includes('Bad Request')) {
      userMessage = 'Datos inválidos para crear el pago. Verifica la información del plan.'
    }
    
    return NextResponse.json(
      { 
        error: userMessage,
        message: errorMessage,
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}

