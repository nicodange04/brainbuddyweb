'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { configuracionService } from '@/lib/supabase/configuracion'
import { authService } from '@/lib/supabase/auth'
import { RespuestaConfiguracion } from '@/lib/types/configuracion'
import Card from '@/app/components/Card'
import { PlanesPrecios } from './components/PlanesPrecios'
import { GestionAdmins } from './components/GestionAdmins'
import { ConfiguracionSistema } from './components/ConfiguracionSistema'

export default function ConfiguracionPage() {
  const [user, setUser] = useState<any>(null)
  const [configuracion, setConfiguracion] = useState<RespuestaConfiguracion | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'planes' | 'admins' | 'sistema'>('planes')
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user) {
      loadConfiguracion()
    }
  }, [user])

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

  const loadConfiguracion = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await configuracionService.getConfiguracion()
      setConfiguracion(data)
    } catch (err) {
      console.error('Load configuracion error:', err)
      setError(err instanceof Error ? err.message : 'Error al cargar configuración')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    loadConfiguracion()
  }

  const handleLogout = async () => {
    try {
      await authService.signOut()
      router.push('/admin/login')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  if (loading && !configuracion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando configuración...</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'planes', label: '💰 Planes y Precios', icon: '💰' },
    { id: 'admins', label: '👥 Administradores', icon: '👥' },
    { id: 'sistema', label: '🛠️ Sistema', icon: '🛠️' }
  ]

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
                ⚙️ Configuración de Brain Buddy
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
              <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
              <p className="text-gray-600 mt-2">Gestiona la configuración del sistema</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {loading ? '⏳ Actualizando...' : '🔄 Actualizar'}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Información del Reporte */}
        {configuracion && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Última actualización:</span> {configuracion.actualizado_en}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-violet-500 text-violet-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Contenido de las tabs */}
        {configuracion && (
          <div className="space-y-6">
            {activeTab === 'planes' && (
              <PlanesPrecios 
                data={configuracion.data.planes}
                onUpdate={loadConfiguracion}
              />
            )}
            
            {activeTab === 'admins' && (
              <GestionAdmins 
                data={configuracion.data.admins}
                onUpdate={loadConfiguracion}
              />
            )}
            
            {activeTab === 'sistema' && (
              <ConfiguracionSistema 
                data={configuracion.data.sistema}
                onUpdate={loadConfiguracion}
              />
            )}
          </div>
        )}
      </main>
    </div>
  )
}
