'use client'

import { MetricasFinancieras as MetricasFinancierasType } from '@/lib/types/reportes'
import Card from '@/app/components/Card'

interface MetricasFinancierasProps {
  data: MetricasFinancierasType
}

export function MetricasFinancieras({ data }: MetricasFinancierasProps) {
  const formatearMoneda = (cantidad: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(cantidad)
  }

  const porcentajeEstudiante = data.total_ingresos > 0 
    ? Math.round((data.ingresos_estudiante / data.total_ingresos) * 100) 
    : 0

  const porcentajeFamiliar = data.total_ingresos > 0 
    ? Math.round((data.ingresos_familiar / data.total_ingresos) * 100) 
    : 0

  return (
    <Card className="p-6">
      <div className="flex items-center mb-4">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <span className="text-green-600 text-lg">💰</span>
          </div>
        </div>
        <div className="ml-3">
          <h3 className="text-lg font-semibold text-gray-900">Financiero</h3>
          <p className="text-sm text-gray-600">Métricas de ingresos y conversión</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* MRR Principal */}
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">{formatearMoneda(data.mrr_actual)}</div>
              <div className="text-sm text-gray-600">MRR (Ingresos Recurrentes Mensuales)</div>
            </div>
            <div className="text-green-400 text-3xl">💵</div>
          </div>
        </div>

        {/* Ingresos por plan */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Ingresos por plan</h4>
          
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-blue-600">{formatearMoneda(data.ingresos_estudiante)}</div>
                <div className="text-sm text-gray-600">Plan Estudiante ({porcentajeEstudiante}%)</div>
              </div>
              <div className="text-blue-400 text-xl">🎓</div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-purple-600">{formatearMoneda(data.ingresos_familiar)}</div>
                <div className="text-sm text-gray-600">Plan Familiar ({porcentajeFamiliar}%)</div>
              </div>
              <div className="text-purple-400 text-xl">👨‍👩‍👧‍👦</div>
            </div>
          </div>
        </div>

        {/* Tasa de conversión */}
        <div className="bg-indigo-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-indigo-600">{data.tasa_conversion}%</div>
              <div className="text-sm text-gray-600">Tasa de conversión</div>
              <div className="text-xs text-gray-500">(usuarios → suscriptores)</div>
            </div>
            <div className="text-indigo-400 text-2xl">📊</div>
          </div>
        </div>

        {/* Resumen total */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-gray-900">{formatearMoneda(data.total_ingresos)}</div>
              <div className="text-sm text-gray-600">Total de ingresos</div>
            </div>
            <div className="text-gray-400 text-xl">💎</div>
          </div>
        </div>
      </div>
    </Card>
  )
}
