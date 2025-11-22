'use client'

import { useState } from 'react'
import { ConfiguracionPlanes, PlanSuscripcion } from '@/lib/types/configuracion'
import { configuracionService } from '@/lib/supabase/configuracion'
import Card from '@/app/components/Card'

interface PlanesPreciosProps {
  data: ConfiguracionPlanes
  onUpdate: () => void
}

export function PlanesPrecios({ data, onUpdate }: PlanesPreciosProps) {
  const [editingPlan, setEditingPlan] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(precio)
  }

  const handleEditPlan = (planId: string) => {
    setEditingPlan(planId)
  }

  const handleSavePlan = async (planId: string, datosActualizados: Partial<PlanSuscripcion>) => {
    try {
      setLoading(true)
      setError('')
      
      await configuracionService.actualizarPlan(planId, datosActualizados)
      setEditingPlan(null)
      onUpdate()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar plan')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingPlan(null)
    setError('')
  }

  return (
    <div className="space-y-6">
      {/* Configuración General */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración General</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">Descuento Anual</div>
            <div className="text-2xl font-bold text-gray-900">{data.descuento_anual}%</div>
            <div className="text-xs text-gray-500">Ahorro por pago anual</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">Período de Prueba</div>
            <div className="text-2xl font-bold text-gray-900">{data.periodo_prueba_dias} días</div>
            <div className="text-xs text-gray-500">Gratis para nuevos usuarios</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">Moneda</div>
            <div className="text-2xl font-bold text-gray-900">{data.moneda}</div>
            <div className="text-xs text-gray-500">Moneda de facturación</div>
          </div>
        </div>
      </Card>

      {/* Planes de Suscripción */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Planes de Suscripción</h3>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {data.planes.map((plan) => (
            <Card key={plan.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-xl font-bold text-gray-900">{plan.nombre}</h4>
                  <p className="text-gray-600">{plan.descripcion}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    plan.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {plan.activo ? 'Activo' : 'Inactivo'}
                  </span>
                  <button
                    onClick={() => handleEditPlan(plan.id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ✏️
                  </button>
                </div>
              </div>

              {editingPlan === plan.id ? (
                <PlanEditForm
                  plan={plan}
                  onSave={(datos) => handleSavePlan(plan.id, datos)}
                  onCancel={handleCancelEdit}
                  loading={loading}
                />
              ) : (
                <div className="space-y-4">
                  {/* Precios */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="text-sm text-gray-600">Precio Mensual</div>
                      <div className="text-xl font-bold text-blue-600">
                        {formatearPrecio(plan.precio_mensual)}
                      </div>
                    </div>
                    {plan.precio_anual && (
                      <div className="bg-green-50 rounded-lg p-3">
                        <div className="text-sm text-gray-600">Precio Anual</div>
                        <div className="text-xl font-bold text-green-600">
                          {formatearPrecio(plan.precio_anual)}
                        </div>
                        <div className="text-xs text-green-600">
                          Ahorra {formatearPrecio((plan.precio_mensual * 12) - plan.precio_anual)}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Características */}
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Características</h5>
                    <ul className="space-y-1">
                      {plan.caracteristicas.map((caracteristica, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <span className="text-green-500 mr-2">✓</span>
                          {caracteristica}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Límites */}
                  {plan.limite_usuarios && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-600">Límite de usuarios</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {plan.limite_usuarios} {plan.limite_usuarios === 1 ? 'usuario' : 'usuarios'}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

// Componente para editar plan
function PlanEditForm({ 
  plan, 
  onSave, 
  onCancel, 
  loading 
}: { 
  plan: PlanSuscripcion
  onSave: (datos: Partial<PlanSuscripcion>) => void
  onCancel: () => void
  loading: boolean
}) {
  const [formData, setFormData] = useState({
    precio_mensual: plan.precio_mensual,
    precio_anual: plan.precio_anual || 0,
    activo: plan.activo
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio Mensual
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.precio_mensual}
            onChange={(e) => setFormData(prev => ({ ...prev, precio_mensual: parseFloat(e.target.value) || 0 }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio Anual
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.precio_anual}
            onChange={(e) => setFormData(prev => ({ ...prev, precio_anual: parseFloat(e.target.value) || 0 }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.activo}
            onChange={(e) => setFormData(prev => ({ ...prev, activo: e.target.checked }))}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Plan activo</span>
        </label>
      </div>

      <div className="flex items-center justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm bg-violet-600 text-white rounded-md hover:bg-violet-700 disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}
