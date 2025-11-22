'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Card from '@/app/components/Card'
import Button from '@/app/components/Button'
import Link from 'next/link'

function PagoExitoContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const planId = searchParams.get('plan')

  useEffect(() => {
    // Aquí podrías verificar el estado del pago con Mercado Pago
    // Por ahora solo mostramos el mensaje de éxito
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando pago...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Pago exitoso!
          </h1>
          <p className="text-gray-600">
            Tu suscripción ha sido activada correctamente.
          </p>
        </div>

        {planId && (
          <div className="bg-violet-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Plan seleccionado:</p>
            <p className="font-semibold text-violet-900 capitalize">{planId}</p>
          </div>
        )}

        <div className="space-y-3">
          <Button
            onClick={() => router.push('/admin/dashboard')}
            variant="primary"
            className="w-full"
          >
            Ir al Dashboard
          </Button>
          <Link href="/" className="block">
            <Button variant="secondary" className="w-full">
              Volver al inicio
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}

export default function PagoExitoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    }>
      <PagoExitoContent />
    </Suspense>
  )
}

