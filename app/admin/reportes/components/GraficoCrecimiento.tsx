'use client'

import { CrecimientoUsuario } from '@/lib/types/reportes'
import Card from '@/app/components/Card'

interface GraficoCrecimientoProps {
  data: CrecimientoUsuario[]
}

export function GraficoCrecimiento({ data }: GraficoCrecimientoProps) {
  // Encontrar el valor máximo para escalar el gráfico
  const maxUsuarios = Math.max(...data.map(d => d.usuarios_totales), 1)
  const maxNuevos = Math.max(...data.map(d => d.usuarios_nuevos), 1)

  return (
    <Card className="p-6">
      <div className="flex items-center mb-4">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
            <span className="text-indigo-600 text-lg">📈</span>
          </div>
        </div>
        <div className="ml-3">
          <h3 className="text-lg font-semibold text-gray-900">Crecimiento</h3>
          <p className="text-sm text-gray-600">Evolución de usuarios (últimos 6 meses)</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Gráfico simple de barras */}
        <div className="space-y-3">
          {data.map((mes, index) => {
            const porcentajeTotal = (mes.usuarios_totales / maxUsuarios) * 100
            const porcentajeNuevos = (mes.usuarios_nuevos / maxNuevos) * 100

            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{mes.mes}</span>
                  <div className="text-xs text-gray-500">
                    +{mes.usuarios_nuevos} nuevos
                  </div>
                </div>
                
                {/* Barra de usuarios totales */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${porcentajeTotal}%` }}
                  ></div>
                </div>
                
                {/* Barra de usuarios nuevos */}
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className="bg-green-400 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${porcentajeNuevos}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Total: {mes.usuarios_totales}</span>
                  <span>Nuevos: {mes.usuarios_nuevos}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Leyenda */}
        <div className="flex items-center justify-center space-x-4 pt-2 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
            <span className="text-xs text-gray-600">Usuarios totales</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
            <span className="text-xs text-gray-600">Usuarios nuevos</span>
          </div>
        </div>

        {/* Resumen */}
        <div className="bg-indigo-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-indigo-600">
                {data[data.length - 1]?.usuarios_totales || 0}
              </div>
              <div className="text-sm text-gray-600">Usuarios totales actuales</div>
            </div>
            <div className="text-indigo-400 text-2xl">📊</div>
          </div>
        </div>
      </div>
    </Card>
  )
}
