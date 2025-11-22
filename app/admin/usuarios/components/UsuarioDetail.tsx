'use client'

import { useState, useEffect } from 'react'
import { usuariosService } from '@/lib/supabase/usuarios'
import { UsuarioCompleto, HistorialSuscripcion } from '@/lib/types/usuarios'

interface UsuarioDetailProps {
  usuario: UsuarioCompleto
  onClose: () => void
  onEdit: () => void
}

export function UsuarioDetail({ usuario, onClose, onEdit }: UsuarioDetailProps) {
  const [historialSuscripciones, setHistorialSuscripciones] = useState<HistorialSuscripcion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadHistorialSuscripciones()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario.usuario_id])

  const loadHistorialSuscripciones = async () => {
    try {
      setLoading(true)
      setError('')
      const historial = await usuariosService.getHistorialSuscripciones(usuario.usuario_id)
      setHistorialSuscripciones(historial)
    } catch (err) {
      console.error('Load historial error:', err)
      setError(err instanceof Error ? err.message : 'Error al cargar historial')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRolBadge = (rol: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      alumno: 'bg-blue-100 text-blue-800',
      padre: 'bg-green-100 text-green-800'
    }
    
    const labels = {
      admin: 'Administrador',
      alumno: 'Alumno',
      padre: 'Padre'
    }

    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${colors[rol as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
        {labels[rol as keyof typeof labels] || rol}
      </span>
    )
  }

  const getEstadoBadge = (estado: string) => {
    const isActivo = estado === 'Activo'
    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
        isActivo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {estado}
      </span>
    )
  }

  const getSuscripcionBadge = (estado: string) => {
    const colors = {
      activo: 'bg-green-100 text-green-800',
      cancelada: 'bg-red-100 text-red-800',
      suspendida: 'bg-yellow-100 text-yellow-800',
      expirada: 'bg-gray-100 text-gray-800'
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </span>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-violet-100 flex items-center justify-center">
                <span className="text-violet-600 font-bold text-xl">
                  {usuario.nombre.charAt(0)}{usuario.apellido.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {usuario.nombre} {usuario.apellido}
                </h2>
                <p className="text-gray-600">{usuario.correo}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={onEdit}
                className="px-4 py-2 text-sm bg-violet-600 text-white rounded-md hover:bg-violet-700"
              >
                ✏️ Editar
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Información Personal */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nombre:</span>
                    <span className="font-medium">{usuario.nombre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Apellido:</span>
                    <span className="font-medium">{usuario.apellido}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Correo:</span>
                    <span className="font-medium">{usuario.correo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rol:</span>
                    {getRolBadge(usuario.rol)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estado:</span>
                    {getEstadoBadge(usuario.estado_usuario)}
                  </div>
                </div>
              </div>

              {/* Información de Registro */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Registro</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fecha de Registro:</span>
                    <span className="font-medium">{formatDate(usuario.created_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Última Actualización:</span>
                    <span className="font-medium">{formatDate(usuario.updated_at)}</span>
                  </div>
                  {usuario.deleted_at && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Desactivado el:</span>
                      <span className="font-medium text-red-600">{formatDate(usuario.deleted_at)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Suscripción Actual */}
              {usuario.plan && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Suscripción Actual</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plan:</span>
                      <span className="font-medium">{usuario.plan}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estado:</span>
                      {getSuscripcionBadge(usuario.estado_suscripcion || '')}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vigencia:</span>
                      <span className="font-medium">{usuario.suscripcion_vigente}</span>
                    </div>
                    {usuario.created_at && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Registro:</span>
                        <span className="font-medium">{formatDate(usuario.created_at)}</span>
                      </div>
                    )}
                    {usuario.updated_at && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Actualizado:</span>
                        <span className="font-medium">{formatDate(usuario.updated_at)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Historial de Suscripciones */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Historial de Suscripciones</h3>
                
                {error && (
                  <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500 mx-auto mb-4"></div>
                      <p className="text-gray-600">Cargando historial...</p>
                    </div>
                  </div>
                ) : historialSuscripciones.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-2">📋</div>
                    <p className="text-gray-600">No hay historial de suscripciones</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {historialSuscripciones.map((suscripcion) => (
                      <div key={suscripcion.suscripcion_id} className="bg-white border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{suscripcion.plan}</span>
                          {getSuscripcionBadge(suscripcion.estado)}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>Inicio: {formatDate(suscripcion.fecha_inicio)}</div>
                          {suscripcion.fecha_fin && (
                            <div>Fin: {formatDate(suscripcion.fecha_fin)}</div>
                          )}
                          <div>Creada: {formatDate(suscripcion.created_at)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
