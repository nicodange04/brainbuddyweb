'use client'

import { MetricasSuscripciones as MetricasSuscripcionesType } from '@/lib/types/reportes'
import Card from '@/app/components/Card'

interface MetricasSuscripcionesProps {
  data: MetricasSuscripcionesType
}

export function MetricasSuscripciones({ data }: MetricasSuscripcionesProps) {
  const totalSuscripciones = data.suscripciones_activas + data.suscripciones_canceladas
  const porcentajeActivas = totalSuscripciones > 0 
    ? Math.round((data.suscripciones_activas / totalSuscripciones) * 100) 
    : 0

  const porcentajeEstudiante = (data.distribucion_planes.estudiante + data.distribucion_planes.familiar) > 0 
    ? Math.round((data.distribucion_planes.estudiante / (data.distribucion_planes.estudiante + data.distribucion_planes.familiar)) * 100) 
    : 0

  const porcentajeFamiliar = (data.distribucion_planes.estudiante + data.distribucion_planes.familiar) > 0 
    ? Math.round((data.distribucion_planes.familiar / (data.distribucion_planes.estudiante + data.distribucion_planes.familiar)) * 100) 
    : 0

  return (
    <Card className="p-6">
      <div className="flex items-center mb-4">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <span className="text-purple-600 text-lg">📋</span>
          </div>
        </div>
        <div className="ml-3">
          <h3 className="text-lg font-semibold text-gray-900">Suscripciones</h3>
          <p className="text-sm text-gray-600">Estado y distribución de suscripciones</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Estado de suscripciones */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-600">{data.suscripciones_activas}</div>
            <div className="text-sm text-gray-600">Activas ({porcentajeActivas}%)</div>
          </div>
          <div className="bg-red-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-red-600">{data.suscripciones_canceladas}</div>
            <div className="text-sm text-gray-600">Canceladas</div>
          </div>
        </div>

        {/* Suscripciones nuevas */}
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-blue-600">+{data.suscripciones_nuevas_mes}</div>
              <div className="text-sm text-gray-600">Nuevas este mes</div>
            </div>
            <div className="text-blue-400 text-2xl">🆕</div>
          </div>
        </div>

        {/* Plan más popular */}
        <div className="bg-yellow-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-yellow-600">
                Plan {data.plan_popular === 'estudiante' ? 'Estudiante' : 'Familiar'}
              </div>
              <div className="text-sm text-gray-600">Plan más popular</div>
            </div>
            <div className="text-yellow-400 text-2xl">
              {data.plan_popular === 'estudiante' ? '🎓' : '👨‍👩‍👧‍👦'}
            </div>
          </div>
        </div>

        {/* Distribución por planes */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Distribución por planes</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Plan Estudiante</span>
              </div>
              <div className="text-sm font-medium text-gray-900">
                {data.distribucion_planes.estudiante} ({porcentajeEstudiante}%)
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Plan Familiar</span>
              </div>
              <div className="text-sm font-medium text-gray-900">
                {data.distribucion_planes.familiar} ({porcentajeFamiliar}%)
              </div>
            </div>
          </div>
        </div>

        {/* Total de suscripciones */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-gray-900">{totalSuscripciones}</div>
              <div className="text-sm text-gray-600">Total de suscripciones</div>
            </div>
            <div className="text-gray-400 text-xl">📊</div>
          </div>
        </div>
      </div>
    </Card>
  )
}
