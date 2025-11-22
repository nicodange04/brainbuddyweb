'use client'

import { useState } from 'react'
import Button from './Button'
import type { PlanSuscripcion } from '@/lib/types/configuracion'

interface CheckoutButtonProps {
  plan: PlanSuscripcion
  frequency: 'monthly' | 'annual'
  onError?: (error: string) => void
  variant?: 'primary' | 'secondary' | 'accent'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function CheckoutButton({ 
  plan, 
  frequency, 
  onError,
  variant = 'primary',
  size = 'lg',
  className = ''
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    try {
      setLoading(true)

      // Calcular precio según frecuencia
      let amount = frequency === 'monthly' 
        ? plan.precio_mensual 
        : (plan.precio_anual || plan.precio_mensual * 12)
      
      // Asegurar que el precio sea un número válido
      amount = parseFloat(amount.toString())
      
      console.log('💰 Precio calculado:', {
        frequency,
        precio_mensual: plan.precio_mensual,
        precio_anual: plan.precio_anual,
        amount,
        planName: plan.nombre
      })
      
      if (isNaN(amount) || amount <= 0) {
        throw new Error(`El precio del plan no es válido: ${amount}`)
      }
      
      // Validar monto mínimo de Mercado Pago
      if (amount < 100) {
        throw new Error(`El monto mínimo es $100 ARS. El precio actual es $${amount} ARS`)
      }

      // Crear preferencia de pago
      const requestBody = {
        planId: plan.id,
        planName: plan.nombre,
        amount,
        currency: 'ARS', // Pesos argentinos
        frequency
      }
      
      console.log('📤 Enviando request a Mercado Pago:', requestBody)
      
      const response = await fetch('/api/mercadopago/preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        let errorData
        try {
          const text = await response.text()
          errorData = text ? JSON.parse(text) : { error: `Error ${response.status}` }
        } catch {
          errorData = { error: `Error ${response.status}: ${response.statusText}` }
        }
        
        console.error('Error del servidor:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        })
        
        const errorMessage = errorData.error || errorData.message || `Error ${response.status}: No se pudo crear la preferencia de pago`
        throw new Error(errorMessage)
      }

      const data = await response.json()

      // Usar la URL que el servidor determinó (ya sabe si es producción o test)
      const paymentUrl = data.paymentUrl || data.initPoint || data.sandboxInitPoint

      if (paymentUrl) {
        window.location.href = paymentUrl
      } else {
        throw new Error('No se pudo obtener el link de pago')
      }
    } catch (error) {
      console.error('Error en checkout:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      
      // Mostrar mensaje amigable al usuario
      if (errorMessage.includes('no está configurado')) {
        alert('⚠️ Mercado Pago no está configurado aún. Por favor, contacta al administrador.')
      } else {
        alert(`❌ Error: ${errorMessage}`)
      }
      
      onError?.(errorMessage)
      setLoading(false)
    }
  }

  const buttonText = loading 
    ? 'Procesando...' 
    : frequency === 'monthly' 
      ? 'Suscribirse Mensual' 
      : 'Suscribirse Anual'

  return (
    <Button
      onClick={handleCheckout}
      disabled={loading}
      variant={variant}
      size={size}
      className={`w-full ${className}`}
    >
      {buttonText}
    </Button>
  )
}

