'use client'

import { MetricasUsuarios as MetricasUsuariosType } from '@/lib/types/reportes'
import Card from '@/app/components/Card'

interface MetricasUsuariosProps {
  data: MetricasUsuariosType
}

export function MetricasUsuarios({ data }: MetricasUsuariosProps) {
  const porcentajeActivos = data.total_usuarios > 0 
    ? Math.round((data.usuarios_activos / data.total_usuarios) * 100) 
    : 0

  const porcentajeAlumno = data.total_usuarios > 0 
    ? Math.round((data.distribucion_roles.alumno / data.total_usuarios) * 100) 
    : 0

  const porcentajePadre = data.total_usuarios > 0 
    ? Math.round((data.distribucion_roles.padre / data.total_usuarios) * 100) 
    : 0

  const porcentajeAdmin = data.total_usuarios > 0 
    ? Math.round((data.distribucion_roles.admin / data.total_usuarios) * 100) 
    : 0

  return (
    <Card className="p-6">
      <div className="flex items-center mb-4">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-600 text-lg">👥</span>
          </div>
        </div>
        <div className="ml-3">
          <h3 className="text-lg font-semibold text-gray-900">Usuarios</h3>
          <p className="text-sm text-gray-600">Métricas de usuarios del sistema</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Métricas principales */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-gray-900">{data.total_usuarios}</div>
            <div className="text-sm text-gray-600">Total usuarios</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-600">{data.usuarios_activos}</div>
            <div className="text-sm text-gray-600">Activos ({porcentajeActivos}%)</div>
          </div>
        </div>

        {/* Usuarios nuevos */}
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-blue-600">+{data.usuarios_nuevos_mes}</div>
              <div className="text-sm text-gray-600">Nuevos este mes</div>
            </div>
            <div className="text-blue-400 text-2xl">📈</div>
          </div>
        </div>

        {/* Distribución por roles */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Distribución por roles</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Alumnos</span>
              </div>
              <div className="text-sm font-medium text-gray-900">
                {data.distribucion_roles.alumno} ({porcentajeAlumno}%)
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Padres</span>
              </div>
              <div className="text-sm font-medium text-gray-900">
                {data.distribucion_roles.padre} ({porcentajePadre}%)
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Admins</span>
              </div>
              <div className="text-sm font-medium text-gray-900">
                {data.distribucion_roles.admin} ({porcentajeAdmin}%)
              </div>
            </div>
          </div>
        </div>

        {/* Estado de usuarios */}
        <div className="bg-yellow-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-yellow-600">{data.usuarios_inactivos}</div>
              <div className="text-sm text-gray-600">Usuarios inactivos</div>
            </div>
            <div className="text-yellow-400 text-2xl">⏸️</div>
          </div>
        </div>
      </div>
    </Card>
  )
}
