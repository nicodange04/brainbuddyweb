'use client'

import { useRouter } from 'next/navigation'
import Card from '@/app/components/Card'
import Button from '@/app/components/Button'
import Link from 'next/link'

export default function PagoErrorPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Error en el pago
          </h1>
          <p className="text-gray-600">
            No se pudo procesar tu pago. Por favor, intenta nuevamente.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => router.push('/#pricing')}
            variant="primary"
            className="w-full"
          >
            Intentar nuevamente
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

