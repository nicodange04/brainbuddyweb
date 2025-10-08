'use client'

import { useState, useEffect } from 'react'
import { usuariosService } from '@/lib/supabase/usuarios'
import { UsuarioCompleto, FormularioUsuario } from '@/lib/types/usuarios'

interface UsuarioFormProps {
  usuario?: UsuarioCompleto | null
  onSuccess: () => void
  onCancel: () => void
}

export function UsuarioForm({ usuario, onSuccess, onCancel }: UsuarioFormProps) {
  const [formData, setFormData] = useState<FormularioUsuario>({
    nombre: '',
    apellido: '',
    correo: '',
    password: '',
    rol: 'alumno'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const isEditing = !!usuario

  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        password: '', // No mostrar contraseña existente
        rol: usuario.rol
      })
    }
  }, [usuario])

  const handleInputChange = (field: keyof FormularioUsuario, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const validateForm = (): boolean => {
    if (!formData.nombre.trim()) {
      setError('El nombre es requerido')
      return false
    }
    if (!formData.apellido.trim()) {
      setError('El apellido es requerido')
      return false
    }
    if (!formData.correo.trim()) {
      setError('El correo es requerido')
      return false
    }
    if (!isEditing && !formData.password) {
      setError('La contraseña es requerida para nuevos usuarios')
      return false
    }
    if (formData.password && formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return false
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.correo)) {
      setError('El correo electrónico no es válido')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    setError('')

    try {
      if (isEditing && usuario) {
        // Update existing user
        const updateData: Partial<FormularioUsuario> = {
          nombre: formData.nombre,
          apellido: formData.apellido,
          correo: formData.correo,
          rol: formData.rol
        }
        
        // Only include password if it was provided
        if (formData.password) {
          updateData.password = formData.password
        }

        await usuariosService.updateUsuario(usuario.usuario_id, updateData)
      } else {
        // Create new user
        await usuariosService.createUsuario(formData)
      }
      
      onSuccess()
    } catch (err) {
      console.error('Form submit error:', err)
      setError(err instanceof Error ? err.message : 'Error al guardar usuario')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="Ingresa el nombre"
                required
              />
            </div>

            {/* Apellido */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido *
              </label>
              <input
                type="text"
                value={formData.apellido}
                onChange={(e) => handleInputChange('apellido', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="Ingresa el apellido"
                required
              />
            </div>

            {/* Correo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico *
              </label>
              <input
                type="email"
                value={formData.correo}
                onChange={(e) => handleInputChange('correo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="usuario@ejemplo.com"
                required
              />
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña {!isEditing && '*'}
                {isEditing && <span className="text-gray-500 text-xs">(dejar vacío para mantener la actual)</span>}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  placeholder={isEditing ? "Nueva contraseña (opcional)" : "Mínimo 6 caracteres"}
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Rol */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rol *
              </label>
              <select
                value={formData.rol}
                onChange={(e) => handleInputChange('rol', e.target.value as 'admin' | 'alumno' | 'padre')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                required
              >
                <option value="alumno">Alumno</option>
                <option value="padre">Padre</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            {/* Botones */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm bg-violet-600 text-white rounded-md hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Guardando...
                  </div>
                ) : (
                  isEditing ? 'Actualizar Usuario' : 'Crear Usuario'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
