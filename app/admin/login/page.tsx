'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/app/components/Button';
import Card from '@/app/components/Card';
import { authService } from '@/lib/supabase/auth';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Intentar login
      const { data, error: loginError } = await authService.signIn(email, password);
      
      if (loginError) {
        setError('Email o contraseña incorrectos');
        return;
      }

      if (!data.user) {
        setError('Error de autenticación');
        return;
      }

      // Verificar que sea admin
      const isAdmin = await authService.isAdmin(data.user.id);
      
      if (!isAdmin) {
        setError('Este usuario no es administrador');
        return;
      }

      // Redirigir al dashboard
      router.push('/admin/dashboard');
      
    } catch (err) {
      setError('Error inesperado. Intenta nuevamente.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-violet-100 rounded-full mb-4">
            <span className="text-2xl">🧠</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            <span className="text-violet-500">Brain Buddy</span>
          </h1>
          <p className="text-gray-600 mt-2">Panel de Administración</p>
        </div>

        {/* Login Form */}
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="admin@brainbuddy.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  Recordarme
                </label>
              </div>
              <a href="/admin/forgot-password" className="text-sm text-violet-600 hover:text-violet-500">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? '⏳ Iniciando sesión...' : '🔐 Iniciar Sesión'}
            </Button>
          </form>

          {/* Links adicionales */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿No eres admin?{' '}
              <a href="/" className="text-violet-600 hover:text-violet-500 font-medium">
                Volver al inicio
              </a>
            </p>
          </div>
        </Card>

        {/* Información adicional */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Acceso restringido a administradores autorizados
          </p>
        </div>
      </div>
    </div>
  );
}
