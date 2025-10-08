'use client'

import { UsuarioCompleto, PaginacionUsuarios } from '@/lib/types/usuarios'

interface UsuariosTableProps {
  usuarios: UsuarioCompleto[]
  paginacion?: PaginacionUsuarios
  loading: boolean
  onPageChange: (page: number) => void
  onEdit: (usuario: UsuarioCompleto) => void
  onView: (usuario: UsuarioCompleto) => void
  onToggleEstado: (usuario: UsuarioCompleto) => void
}

export function UsuariosTable({
  usuarios,
  paginacion,
  loading,
  onPageChange,
  onEdit,
  onView,
  onToggleEstado
}: UsuariosTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getRolBadge = (rol: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      alumno: 'bg-blue-100 text-blue-800',
      padre: 'bg-green-100 text-green-800'
    }
    
    const labels = {
      admin: 'Admin',
      alumno: 'Alumno',
      padre: 'Padre'
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[rol as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
        {labels[rol as keyof typeof labels] || rol}
      </span>
    )
  }

  const getEstadoBadge = (estado: string) => {
    const isActivo = estado === 'Activo'
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
        isActivo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {estado}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando usuarios...</p>
        </div>
      </div>
    )
  }

  if (usuarios.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">👥</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay usuarios</h3>
        <p className="text-gray-600">No se encontraron usuarios con los filtros aplicados.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Suscripción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Registro
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {usuarios.map((usuario) => (
              <tr key={usuario.usuario_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center">
                        <span className="text-violet-600 font-medium text-sm">
                          {usuario.nombre.charAt(0)}{usuario.apellido.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {usuario.nombre} {usuario.apellido}
                      </div>
                      <div className="text-sm text-gray-500">{usuario.correo}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getRolBadge(usuario.rol)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getEstadoBadge(usuario.estado_usuario)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>
                    <div className="font-medium">{usuario.plan || 'Sin suscripción'}</div>
                    {usuario.suscripcion_vigente && (
                      <div className="text-xs text-gray-500">
                        {usuario.suscripcion_vigente}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(usuario.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onView(usuario)}
                      className="text-violet-600 hover:text-violet-900"
                      title="Ver detalle"
                    >
                      👁️
                    </button>
                    <button
                      onClick={() => onEdit(usuario)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => onToggleEstado(usuario)}
                      className={`${
                        usuario.estado_usuario === 'Activo' 
                          ? 'text-red-600 hover:text-red-900' 
                          : 'text-green-600 hover:text-green-900'
                      }`}
                      title={usuario.estado_usuario === 'Activo' ? 'Desactivar' : 'Activar'}
                    >
                      {usuario.estado_usuario === 'Activo' ? '⏸️' : '▶️'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {usuarios.map((usuario) => (
          <div key={usuario.usuario_id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10">
                  <div className="h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center">
                    <span className="text-violet-600 font-medium text-sm">
                      {usuario.nombre.charAt(0)}{usuario.apellido.charAt(0)}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">
                    {usuario.nombre} {usuario.apellido}
                  </div>
                  <div className="text-sm text-gray-500">{usuario.correo}</div>
                  <div className="flex items-center space-x-2 mt-1">
                    {getRolBadge(usuario.rol)}
                    {getEstadoBadge(usuario.estado_usuario)}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => onView(usuario)}
                  className="text-violet-600 hover:text-violet-900 p-1"
                  title="Ver detalle"
                >
                  👁️
                </button>
                <button
                  onClick={() => onEdit(usuario)}
                  className="text-blue-600 hover:text-blue-900 p-1"
                  title="Editar"
                >
                  ✏️
                </button>
                <button
                  onClick={() => onToggleEstado(usuario)}
                  className={`p-1 ${
                    usuario.estado_usuario === 'Activo' 
                      ? 'text-red-600 hover:text-red-900' 
                      : 'text-green-600 hover:text-green-900'
                  }`}
                  title={usuario.estado_usuario === 'Activo' ? 'Desactivar' : 'Activar'}
                >
                  {usuario.estado_usuario === 'Activo' ? '⏸️' : '▶️'}
                </button>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                <div>Suscripción: {usuario.plan || 'Sin suscripción'}</div>
                <div>Registro: {formatDate(usuario.created_at)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {paginacion && paginacion.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando {((paginacion.page - 1) * paginacion.limit) + 1} a{' '}
            {Math.min(paginacion.page * paginacion.limit, paginacion.total)} de{' '}
            {paginacion.total} usuarios
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(paginacion.page - 1)}
              disabled={paginacion.page <= 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <span className="px-3 py-1 text-sm bg-violet-100 text-violet-800 rounded-md">
              {paginacion.page}
            </span>
            <button
              onClick={() => onPageChange(paginacion.page + 1)}
              disabled={paginacion.page >= paginacion.totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
