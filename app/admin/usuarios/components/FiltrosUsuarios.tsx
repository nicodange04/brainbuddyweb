'use client'

import { useState } from 'react'
import { FiltrosUsuarios as FiltrosType } from '@/lib/types/usuarios'

interface FiltrosUsuariosProps {
  filtros: FiltrosType
  onFiltrosChange: (filtros: FiltrosType) => void
}

export function FiltrosUsuarios({ filtros, onFiltrosChange }: FiltrosUsuariosProps) {
  const [localFiltros, setLocalFiltros] = useState<FiltrosType>(filtros)

  const handleInputChange = (field: keyof FiltrosType, value: string) => {
    const newFiltros = { ...localFiltros, [field]: value }
    setLocalFiltros(newFiltros)
  }

  const handleApplyFiltros = () => {
    onFiltrosChange(localFiltros)
  }

  const handleClearFiltros = () => {
    const emptyFiltros: FiltrosType = {
      rol: '',
      estado: '',
      fecha_desde: '',
      fecha_hasta: '',
      busqueda: ''
    }
    setLocalFiltros(emptyFiltros)
    onFiltrosChange(emptyFiltros)
  }

  const hasActiveFilters = Object.values(filtros).some(value => value && value !== '')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
        {hasActiveFilters && (
          <button
            onClick={handleClearFiltros}
            className="text-sm text-violet-600 hover:text-violet-800"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Búsqueda */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Búsqueda
          </label>
          <input
            type="text"
            placeholder="Nombre, apellido o correo..."
            value={localFiltros.busqueda || ''}
            onChange={(e) => handleInputChange('busqueda', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
        </div>

        {/* Filtro por Rol */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rol
          </label>
          <select
            value={localFiltros.rol || ''}
            onChange={(e) => handleInputChange('rol', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          >
            <option value="">Todos los roles</option>
            <option value="admin">Admin</option>
            <option value="alumno">Alumno</option>
            <option value="padre">Padre</option>
          </select>
        </div>

        {/* Filtro por Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            value={localFiltros.estado || ''}
            onChange={(e) => handleInputChange('estado', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          >
            <option value="">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>

        {/* Fecha Desde */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha Desde
          </label>
          <input
            type="date"
            value={localFiltros.fecha_desde || ''}
            onChange={(e) => handleInputChange('fecha_desde', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
        </div>

        {/* Fecha Hasta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha Hasta
          </label>
          <input
            type="date"
            value={localFiltros.fecha_hasta || ''}
            onChange={(e) => handleInputChange('fecha_hasta', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          {hasActiveFilters && (
            <span>
              Filtros activos: {Object.entries(filtros).filter(([_, value]) => value && value !== '').length}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleClearFiltros}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Limpiar
          </button>
          <button
            onClick={handleApplyFiltros}
            className="px-4 py-2 text-sm bg-violet-600 text-white rounded-md hover:bg-violet-700"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>

      {/* Filtros Activos */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {filtros.rol && filtros.rol !== '' && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-violet-100 text-violet-800 rounded-full">
                Rol: {filtros.rol}
                <button
                  onClick={() => {
                    const newFiltros = { ...localFiltros, rol: '' }
                    setLocalFiltros(newFiltros)
                    onFiltrosChange(newFiltros)
                  }}
                  className="ml-1 text-violet-600 hover:text-violet-800"
                >
                  ×
                </button>
              </span>
            )}
            {filtros.estado && filtros.estado !== '' && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                Estado: {filtros.estado}
                <button
                  onClick={() => {
                    const newFiltros = { ...localFiltros, estado: '' }
                    setLocalFiltros(newFiltros)
                    onFiltrosChange(newFiltros)
                  }}
                  className="ml-1 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            )}
            {filtros.busqueda && filtros.busqueda !== '' && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                Búsqueda: {filtros.busqueda}
                <button
                  onClick={() => {
                    const newFiltros = { ...localFiltros, busqueda: '' }
                    setLocalFiltros(newFiltros)
                    onFiltrosChange(newFiltros)
                  }}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {filtros.fecha_desde && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                Desde: {new Date(filtros.fecha_desde).toLocaleDateString('es-ES')}
                <button
                  onClick={() => {
                    const newFiltros = { ...localFiltros, fecha_desde: '' }
                    setLocalFiltros(newFiltros)
                    onFiltrosChange(newFiltros)
                  }}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
            {filtros.fecha_hasta && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                Hasta: {new Date(filtros.fecha_hasta).toLocaleDateString('es-ES')}
                <button
                  onClick={() => {
                    const newFiltros = { ...localFiltros, fecha_hasta: '' }
                    setLocalFiltros(newFiltros)
                    onFiltrosChange(newFiltros)
                  }}
                  className="ml-1 text-yellow-600 hover:text-yellow-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
