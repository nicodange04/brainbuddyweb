'use client';

import { useState } from 'react';
import Button from '@/app/components/Button';
import Card from '@/app/components/Card';
import { authService } from '@/lib/supabase/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { data, error: resetError } = await authService.resetPassword(email);
      
      if (resetError) {
        setError('Error al enviar el email de recuperación');
        return;
      }

      setMessage('Se ha enviado un email con las instrucciones para restablecer tu contraseña.');
      
    } catch (err) {
      setError('Error inesperado. Intenta nuevamente.');
      console.error('Reset password error:', err);
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
            <span className="text-2xl">🔐</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Recuperar Contraseña
          </h1>
          <p className="text-gray-600 mt-2">Ingresa tu email para recibir instrucciones</p>
        </div>

        {/* Reset Form */}
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

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {message && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-600">{message}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? '⏳ Enviando...' : '📧 Enviar Instrucciones'}
            </Button>
          </form>

          {/* Links adicionales */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              ¿Recordaste tu contraseña?{' '}
              <a href="/admin/login" className="text-violet-600 hover:text-violet-500 font-medium">
                Volver al login
              </a>
            </p>
            <p className="text-sm text-gray-600">
              <a href="/" className="text-violet-600 hover:text-violet-500 font-medium">
                ← Volver al inicio
              </a>
            </p>
          </div>
        </Card>

        {/* Información adicional */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            El email puede tardar unos minutos en llegar
          </p>
        </div>
      </div>
    </div>
  );
}
