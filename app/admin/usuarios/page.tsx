'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usuariosService } from '@/lib/supabase/usuarios'
import { authService } from '@/lib/supabase/auth'
import { UsuarioCompleto, FiltrosUsuarios, RespuestaUsuarios } from '@/lib/types/usuarios'
import { USUARIOS_POR_PAGINA } from '@/lib/config/constants'
import Card from '@/app/components/Card'
import { UsuariosTable } from './components/UsuariosTable'
import { FiltrosUsuarios as FiltrosComponent } from './components/FiltrosUsuarios'
import { UsuarioForm } from './components/UsuarioForm'
import { UsuarioDetail } from './components/UsuarioDetail'

export default function UsuariosPage() {
  const [user, setUser] = useState<any>(null)
  const [usuarios, setUsuarios] = useState<RespuestaUsuarios | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filtros, setFiltros] = useState<FiltrosUsuarios>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [selectedUsuario, setSelectedUsuario] = useState<UsuarioCompleto | null>(null)
  const [editingUsuario, setEditingUsuario] = useState<UsuarioCompleto | null>(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user) {
      loadUsuarios()
    }
  }, [user, filtros, currentPage])

  const checkAuth = async () => {
    try {
      const { user: currentUser } = await authService.getCurrentUser()
      
      if (!currentUser) {
        router.push('/admin/login')
        return
      }

      const isAdmin = await authService.isAdmin(currentUser.id)
      
      if (!isAdmin) {
        router.push('/admin/login')
        return
      }

      setUser(currentUser)
    } catch (err) {
      console.error('Auth check error:', err)
      router.push('/admin/login')
    }
  }

  const loadUsuarios = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await usuariosService.getUsuarios(filtros, currentPage, USUARIOS_POR_PAGINA)
      setUsuarios(data)
    } catch (err) {
      console.error('Load usuarios error:', err)
      setError(err instanceof Error ? err.message : 'Error al cargar usuarios')
    } finally {
      setLoading(false)
    }
  }

  const handleFiltrosChange = (newFiltros: FiltrosUsuarios) => {
    setFiltros(newFiltros)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleCreateUsuario = () => {
    setEditingUsuario(null)
    setShowForm(true)
  }

  const handleEditUsuario = (usuario: UsuarioCompleto) => {
    setEditingUsuario(usuario)
    setShowForm(true)
  }

  const handleViewUsuario = (usuario: UsuarioCompleto) => {
    setSelectedUsuario(usuario)
    setShowDetail(true)
  }

  const handleToggleEstado = async (usuario: UsuarioCompleto) => {
    try {
      const isActivo = usuario.estado_usuario === 'Activo'
      await usuariosService.toggleUsuarioEstado(usuario.usuario_id, !isActivo)
      await loadUsuarios() // Reload data
    } catch (err) {
      console.error('Toggle estado error:', err)
      setError(err instanceof Error ? err.message : 'Error al cambiar estado del usuario')
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingUsuario(null)
    loadUsuarios() // Reload data
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingUsuario(null)
  }

  const handleDetailClose = () => {
    setShowDetail(false)
    setSelectedUsuario(null)
  }

  const handleLogout = async () => {
    try {
      await authService.signOut()
      router.push('/admin/login')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  if (loading && !usuarios) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando usuarios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="text-violet-600 hover:text-violet-800"
              >
                ← Volver al Dashboard
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <span className="text-xl font-bold text-gray-900">
                👥 Gestión de Usuarios
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Bienvenido, {user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
              <p className="text-gray-600 mt-2">Gestiona todos los usuarios del sistema</p>
            </div>
            <button
              onClick={handleCreateUsuario}
              className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors"
            >
              + Nuevo Usuario
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Filtros */}
        <Card className="p-6 mb-6">
          <FiltrosComponent
            filtros={filtros}
            onFiltrosChange={handleFiltrosChange}
          />
        </Card>

        {/* Tabla de Usuarios */}
        <Card className="p-6">
          <UsuariosTable
            usuarios={usuarios?.usuarios || []}
            paginacion={usuarios?.paginacion}
            loading={loading}
            onPageChange={handlePageChange}
            onEdit={handleEditUsuario}
            onView={handleViewUsuario}
            onToggleEstado={handleToggleEstado}
          />
        </Card>
      </main>

      {/* Modal de Formulario */}
      {showForm && (
        <UsuarioForm
          usuario={editingUsuario}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}

      {/* Modal de Detalle */}
      {showDetail && selectedUsuario && (
        <UsuarioDetail
          usuario={selectedUsuario}
          onClose={handleDetailClose}
          onEdit={() => {
            setShowDetail(false)
            handleEditUsuario(selectedUsuario)
          }}
        />
      )}
    </div>
  )
}
