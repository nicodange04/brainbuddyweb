'use client'

import { useRouter } from 'next/navigation'
import Card from '@/app/components/Card'
import Button from '@/app/components/Button'
import Link from 'next/link'

export default function PagoPendientePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
            <svg className="h-8 w-8 text-yellow-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Pago pendiente
          </h1>
          <p className="text-gray-600">
            Tu pago está siendo procesado. Te notificaremos por email cuando se complete.
          </p>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            ⏳ El procesamiento puede tardar unos minutos. Revisa tu email para más información.
          </p>
        </div>

        <div className="space-y-3">
          <Link href="/" className="block">
            <Button variant="primary" className="w-full">
              Volver al inicio
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}

