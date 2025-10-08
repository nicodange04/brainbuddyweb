'use client'

import { useState } from 'react'
import { ConfiguracionAdmins, AdminUsuario } from '@/lib/types/configuracion'
import { configuracionService } from '@/lib/supabase/configuracion'
import Card from '@/app/components/Card'

interface GestionAdminsProps {
  data: ConfiguracionAdmins
  onUpdate: () => void
}

export function GestionAdmins({ data, onUpdate }: GestionAdminsProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAddAdmin = async (datosAdmin: { nombre: string; apellido: string; correo: string; password: string }) => {
    try {
      setLoading(true)
      setError('')
      
      await configuracionService.agregarAdmin(datosAdmin)
      setShowAddForm(false)
      onUpdate()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al agregar administrador')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveAdmin = async (usuarioId: string) => {
    if (!confirm('¿Estás seguro de que quieres desactivar este administrador?')) {
      return
    }

    try {
      setLoading(true)
      setError('')
      
      await configuracionService.eliminarAdmin(usuarioId)
      onUpdate()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar administrador')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Nunca'
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Resumen */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen de Administradores</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">Total Administradores</div>
            <div className="text-2xl font-bold text-blue-600">{data.admins.length}</div>
            <div className="text-xs text-gray-500">Activos en el sistema</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">Límite Máximo</div>
            <div className="text-2xl font-bold text-green-600">{data.max_admins}</div>
            <div className="text-xs text-gray-500">Administradores permitidos</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">Confirmación</div>
            <div className="text-2xl font-bold text-yellow-600">
              {data.requiere_confirmacion ? 'Sí' : 'No'}
            </div>
            <div className="text-xs text-gray-500">Requiere confirmación</div>
          </div>
        </div>
      </Card>

      {/* Lista de Administradores */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Administradores</h3>
          <button
            onClick={() => setShowAddForm(true)}
            disabled={data.admins.length >= data.max_admins}
            className="px-4 py-2 text-sm bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + Agregar Administrador
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {data.admins.length >= data.max_admins && (
          <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-600">
              Has alcanzado el límite máximo de {data.max_admins} administradores.
            </p>
          </div>
        )}

        {/* Formulario para agregar administrador */}
        {showAddForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <AddAdminForm
              onSave={handleAddAdmin}
              onCancel={() => setShowAddForm(false)}
              loading={loading}
            />
          </div>
        )}

        {/* Lista de administradores */}
        <div className="space-y-4">
          {data.admins.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-2">👥</div>
              <p className="text-gray-600">No hay administradores registrados</p>
            </div>
          ) : (
            data.admins.map((admin) => (
              <div key={admin.usuario_id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center">
                      <span className="text-violet-600 font-medium text-sm">
                        {admin.nombre.charAt(0)}{admin.apellido.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {admin.nombre} {admin.apellido}
                    </div>
                    <div className="text-sm text-gray-500">{admin.correo}</div>
                    <div className="text-xs text-gray-400">
                      Último acceso: {formatDate(admin.ultimo_acceso)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    admin.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {admin.activo ? 'Activo' : 'Inactivo'}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {admin.rol === 'super_admin' ? 'Super Admin' : 'Admin'}
                  </span>
                  <button
                    onClick={() => handleRemoveAdmin(admin.usuario_id)}
                    disabled={loading}
                    className="text-red-600 hover:text-red-800 disabled:opacity-50"
                    title="Desactivar administrador"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}

// Componente para agregar administrador
function AddAdminForm({ 
  onSave, 
  onCancel, 
  loading 
}: { 
  onSave: (datos: { nombre: string; apellido: string; correo: string; password: string }) => void
  onCancel: () => void
  loading: boolean
}) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    password: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h4 className="text-lg font-medium text-gray-900">Agregar Nuevo Administrador</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre *
          </label>
          <input
            type="text"
            value={formData.nombre}
            onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Apellido *
          </label>
          <input
            type="text"
            value={formData.apellido}
            onChange={(e) => setFormData(prev => ({ ...prev, apellido: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Correo Electrónico *
        </label>
        <input
          type="email"
          value={formData.correo}
          onChange={(e) => setFormData(prev => ({ ...prev, correo: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Contraseña Temporal *
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          placeholder="Mínimo 6 caracteres"
          minLength={6}
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          El administrador deberá cambiar esta contraseña en su primer acceso.
        </p>
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
          {loading ? 'Agregando...' : 'Agregar Administrador'}
        </button>
      </div>
    </form>
  )
}
