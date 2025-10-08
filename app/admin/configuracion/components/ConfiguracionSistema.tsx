'use client'

import { useState } from 'react'
import type { ConfiguracionSistema } from '@/lib/types/configuracion'
import { configuracionService } from '@/lib/supabase/configuracion'
import Card from '@/app/components/Card'

interface ConfiguracionSistemaProps {
  data: ConfiguracionSistema
  onUpdate: () => void
}

export function ConfiguracionSistema({ data, onUpdate }: ConfiguracionSistemaProps) {
  const [, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleUpdateConfig = async (nuevaConfiguracion: Record<string, unknown>) => {
    try {
      setLoading(true)
      setError('')
      
      await configuracionService.actualizarConfiguracionSistema(nuevaConfiguracion)
      onUpdate()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar configuración')
    } finally {
      setLoading(false)
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo':
        return 'bg-green-100 text-green-800'
      case 'inactivo':
        return 'bg-yellow-100 text-yellow-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'activo':
        return '✅'
      case 'inactivo':
        return '⚠️'
      case 'error':
        return '❌'
      default:
        return '❓'
    }
  }

  return (
    <div className="space-y-6">
      {/* Información del Sistema */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Sistema</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">Versión</div>
            <div className="text-xl font-bold text-blue-600">{data.info.version}</div>
            <div className="text-xs text-gray-500">Versión actual</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">Uptime</div>
            <div className="text-xl font-bold text-green-600">{data.info.uptime}</div>
            <div className="text-xs text-gray-500">Disponibilidad</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">Usuarios</div>
            <div className="text-xl font-bold text-purple-600">{data.info.usuarios_totales}</div>
            <div className="text-xs text-gray-500">Total registrados</div>
          </div>
          <div className="bg-indigo-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">Suscripciones</div>
            <div className="text-xl font-bold text-indigo-600">{data.info.suscripciones_activas}</div>
            <div className="text-xs text-gray-500">Activas</div>
          </div>
        </div>
      </Card>

      {/* Estado de Servicios */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de Servicios</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(data.info.estado_servicios).map(([servicio, estado]) => (
            <div key={servicio} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-700 capitalize">
                  {servicio.replace('_', ' ')}
                </div>
                <span className="text-lg">{getEstadoIcon(estado)}</span>
              </div>
              <div className={`px-2 py-1 text-xs font-medium rounded-full ${getEstadoColor(estado)}`}>
                {estado}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Configuración de Mantenimiento */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Modo de Mantenimiento</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={data.mantenimiento.modo_mantenimiento}
              onChange={(e) => handleUpdateConfig({
                mantenimiento: {
                  ...data.mantenimiento,
                  modo_mantenimiento: e.target.checked
                }
              })}
              className="mr-3"
            />
            <label className="text-sm text-gray-700">
              Activar modo de mantenimiento
            </label>
          </div>
          
          {data.mantenimiento.modo_mantenimiento && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="text-sm text-yellow-800">
                <strong>⚠️ Advertencia:</strong> El modo de mantenimiento está activo. 
                Los usuarios no podrán acceder al sistema.
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mensaje de Mantenimiento
            </label>
            <textarea
              value={data.mantenimiento.mensaje_mantenimiento}
              onChange={(e) => handleUpdateConfig({
                mantenimiento: {
                  ...data.mantenimiento,
                  mensaje_mantenimiento: e.target.value
                }
              })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Mensaje que verán los usuarios durante el mantenimiento..."
            />
          </div>
        </div>
      </Card>

      {/* Configuración de Logs */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración de Logs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nivel de Log
            </label>
            <select
              value={data.logs.nivel}
              onChange={(e) => handleUpdateConfig({
                logs: {
                  ...data.logs,
                  nivel: e.target.value as 'error' | 'warn' | 'info' | 'debug'
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="error">Error</option>
              <option value="warn">Warning</option>
              <option value="info">Info</option>
              <option value="debug">Debug</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Nivel mínimo de logs a registrar
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Retención de Logs (días)
            </label>
            <input
              type="number"
              min="1"
              max="365"
              value={data.logs.retencion_dias}
              onChange={(e) => handleUpdateConfig({
                logs: {
                  ...data.logs,
                  retencion_dias: parseInt(e.target.value) || 30
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Días que se conservan los logs
            </p>
          </div>
        </div>
      </Card>

      {/* Espacio de Almacenamiento */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Espacio de Almacenamiento</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Espacio utilizado</span>
            <span className="text-sm font-medium text-gray-900">
              {data.info.espacio_utilizado} MB / {data.info.espacio_total} MB
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-violet-500 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${Math.min((data.info.espacio_utilizado / data.info.espacio_total) * 100, 100)}%` 
              }}
            ></div>
          </div>
          
          <div className="text-xs text-gray-500">
            {Math.round((data.info.espacio_utilizado / data.info.espacio_total) * 100)}% del espacio total utilizado
          </div>
        </div>
      </Card>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  )
}
