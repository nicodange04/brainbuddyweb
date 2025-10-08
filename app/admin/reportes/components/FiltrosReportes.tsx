'use client'

import { useState } from 'react'
import { FiltrosReportes as FiltrosType } from '@/lib/types/reportes'

interface FiltrosReportesProps {
  filtros: FiltrosType
  onFiltrosChange: (filtros: FiltrosType) => void
}

export function FiltrosReportes({ filtros, onFiltrosChange }: FiltrosReportesProps) {
  const [localFiltros, setLocalFiltros] = useState<FiltrosType>(filtros)

  const handlePeriodoChange = (periodo: 'mes' | 'trimestre' | 'año' | 'personalizado') => {
    const newFiltros: FiltrosType = { periodo }
    
    // Si es personalizado, mantener las fechas existentes
    if (periodo === 'personalizado' && localFiltros.fecha_desde && localFiltros.fecha_hasta) {
      newFiltros.fecha_desde = localFiltros.fecha_desde
      newFiltros.fecha_hasta = localFiltros.fecha_hasta
    }
    
    setLocalFiltros(newFiltros)
    onFiltrosChange(newFiltros)
  }

  const handleFechaChange = (campo: 'fecha_desde' | 'fecha_hasta', valor: string) => {
    const newFiltros = { 
      ...localFiltros, 
      [campo]: valor,
      periodo: 'personalizado' as const
    }
    setLocalFiltros(newFiltros)
    onFiltrosChange(newFiltros)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Filtros de Período</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Filtro por Período */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Período
          </label>
          <select
            value={localFiltros.periodo}
            onChange={(e) => handlePeriodoChange(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          >
            <option value="mes">Último mes</option>
            <option value="trimestre">Último trimestre</option>
            <option value="año">Último año</option>
            <option value="personalizado">Personalizado</option>
          </select>
        </div>

        {/* Fecha Desde (solo si es personalizado) */}
        {localFiltros.periodo === 'personalizado' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Desde
            </label>
            <input
              type="date"
              value={localFiltros.fecha_desde || ''}
              onChange={(e) => handleFechaChange('fecha_desde', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Fecha Hasta (solo si es personalizado) */}
        {localFiltros.periodo === 'personalizado' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Hasta
            </label>
            <input
              type="date"
              value={localFiltros.fecha_hasta || ''}
              onChange={(e) => handleFechaChange('fecha_hasta', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Información del período actual */}
        <div className="flex items-end">
          <div className="w-full p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Período actual:</span>
            </p>
            <p className="text-sm text-gray-800">
              {localFiltros.periodo === 'mes' && 'Último mes'}
              {localFiltros.periodo === 'trimestre' && 'Último trimestre'}
              {localFiltros.periodo === 'año' && 'Último año'}
              {localFiltros.periodo === 'personalizado' && 'Personalizado'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
