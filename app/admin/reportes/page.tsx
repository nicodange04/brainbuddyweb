'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { reportesService } from '@/lib/supabase/reportes'
import { authService } from '@/lib/supabase/auth'
import { RespuestaReportes, FiltrosReportes } from '@/lib/types/reportes'
import Card from '@/app/components/Card'
import { FiltrosReportes as FiltrosComponent } from './components/FiltrosReportes'
import { MetricasUsuarios } from './components/MetricasUsuarios'
import { MetricasFinancieras } from './components/MetricasFinancieras'
import { MetricasSuscripciones } from './components/MetricasSuscripciones'
import { GraficoCrecimiento } from './components/GraficoCrecimiento'

export default function ReportesPage() {
  const [user, setUser] = useState<any>(null)
  const [reportes, setReportes] = useState<RespuestaReportes | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filtros, setFiltros] = useState<FiltrosReportes>({ periodo: 'mes' })
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user) {
      loadReportes()
    }
  }, [user, filtros])

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

  const loadReportes = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await reportesService.getReportes(filtros)
      setReportes(data)
    } catch (err) {
      console.error('Load reportes error:', err)
      setError(err instanceof Error ? err.message : 'Error al cargar reportes')
    } finally {
      setLoading(false)
    }
  }

  const handleFiltrosChange = (newFiltros: FiltrosReportes) => {
    setFiltros(newFiltros)
  }

  const handleRefresh = () => {
    loadReportes()
  }

  const handleExportCSV = () => {
    if (!reportes) return

    // Crear datos para CSV
    const csvData = [
      // Headers
      ['Métrica', 'Valor', 'Período', 'Generado en'],
      
      // Usuarios
      ['Total Usuarios', reportes.data.usuarios.total_usuarios, reportes.periodo, reportes.generado_en],
      ['Usuarios Activos', reportes.data.usuarios.usuarios_activos, reportes.periodo, reportes.generado_en],
      ['Usuarios Nuevos Mes', reportes.data.usuarios.usuarios_nuevos_mes, reportes.periodo, reportes.generado_en],
      ['Alumnos', reportes.data.usuarios.distribucion_roles.alumno, reportes.periodo, reportes.generado_en],
      ['Padres', reportes.data.usuarios.distribucion_roles.padre, reportes.periodo, reportes.generado_en],
      ['Admins', reportes.data.usuarios.distribucion_roles.admin, reportes.periodo, reportes.generado_en],
      
      // Financiero
      ['MRR Actual', `$${reportes.data.financiero.mrr_actual}`, reportes.periodo, reportes.generado_en],
      ['Ingresos Estudiante', `$${reportes.data.financiero.ingresos_estudiante}`, reportes.periodo, reportes.generado_en],
      ['Ingresos Familiar', `$${reportes.data.financiero.ingresos_familiar}`, reportes.periodo, reportes.generado_en],
      ['Tasa Conversión', `${reportes.data.financiero.tasa_conversion}%`, reportes.periodo, reportes.generado_en],
      
      // Suscripciones
      ['Suscripciones Activas', reportes.data.suscripciones.suscripciones_activas, reportes.periodo, reportes.generado_en],
      ['Suscripciones Canceladas', reportes.data.suscripciones.suscripciones_canceladas, reportes.periodo, reportes.generado_en],
      ['Suscripciones Nuevas Mes', reportes.data.suscripciones.suscripciones_nuevas_mes, reportes.periodo, reportes.generado_en],
      ['Plan Popular', reportes.data.suscripciones.plan_popular, reportes.periodo, reportes.generado_en],
    ]

    // Convertir a CSV
    const csvContent = csvData.map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n')

    // Crear y descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `reportes-brainbuddy-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleLogout = async () => {
    try {
      await authService.signOut()
      router.push('/admin/login')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  if (loading && !reportes) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando reportes...</p>
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
                📊 Reportes de Brain Buddy
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
              <h1 className="text-3xl font-bold text-gray-900">Reportes</h1>
              <p className="text-gray-600 mt-2">Análisis y métricas del sistema</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {loading ? '⏳ Actualizando...' : '🔄 Actualizar'}
              </button>
              <button 
                onClick={handleExportCSV}
                disabled={!reportes || loading}
                className="px-4 py-2 text-sm bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                📄 Exportar CSV
              </button>
            </div>
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

        {/* Información del Reporte */}
        {reportes && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Período:</span> {reportes.periodo}
                </p>
                <p className="text-sm text-blue-600">
                  <span className="font-medium">Generado:</span> {reportes.generado_en}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Métricas Principales */}
        {reportes && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <MetricasUsuarios data={reportes.data.usuarios} />
            <MetricasFinancieras data={reportes.data.financiero} />
          </div>
        )}

        {/* Métricas Secundarias */}
        {reportes && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <MetricasSuscripciones data={reportes.data.suscripciones} />
            <GraficoCrecimiento data={reportes.data.crecimiento} />
          </div>
        )}
      </main>
    </div>
  )
}
