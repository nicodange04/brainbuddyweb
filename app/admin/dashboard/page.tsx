'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/app/components/Card';
import { authService } from '@/lib/supabase/auth';
import { createSupabaseClient } from '@/lib/supabase/client';

interface DashboardMetrics {
  alumnos_activos: number;
  padres_registrados: number;
  admins_registrados: number;
  suscripciones_activas: number;
  suscriptores_estudiante: number;
  suscriptores_familiar: number;
  usuarios_mes_actual: number;
  suscripciones_mes_actual: number;
  mrr_estimado: number;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    loadMetrics();
  }, []);

  const checkAuth = async () => {
    try {
      const { user: currentUser } = await authService.getCurrentUser();
      
      if (!currentUser) {
        router.push('/admin/login');
        return;
      }

      const isAdmin = await authService.isAdmin(currentUser.id);
      
      if (!isAdmin) {
        router.push('/admin/login');
        return;
      }

      setUser(currentUser);
    } catch (err) {
      console.error('Auth check error:', err);
      router.push('/admin/login');
    }
  };

  const loadMetrics = async () => {
    try {
      const supabase = createSupabaseClient();
      
      const { data, error } = await supabase
        .from('v_metricas_dashboard')
        .select('*')
        .limit(1);

      if (error) {
        console.error('Metrics error:', error);
        setError('Error al cargar métricas');
        return;
      }

      setMetrics(data[0] || null);
    } catch (err) {
      console.error('Load metrics error:', err);
      setError('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      router.push('/admin/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-gray-900">
                🧠 <span className="text-violet-500">Brain Buddy</span> Admin
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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Resumen general de Brain Buddy</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Metrics Cards */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                    <span className="text-violet-600">👨‍🎓</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Alumnos Activos</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.alumnos_activos}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600">👨‍👩‍👧‍👦</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Padres Registrados</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.padres_registrados}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <span className="text-indigo-600">💰</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">MRR Estimado</p>
                  <p className="text-2xl font-bold text-gray-900">${metrics.mrr_estimado}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600">📈</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Suscripciones Activas</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.suscripciones_activas}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-violet-50 rounded-lg hover:bg-violet-100 transition-colors">
                <span className="text-violet-600 font-medium">👥 Gestionar Usuarios</span>
              </button>
              <button className="w-full text-left p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <span className="text-purple-600 font-medium">📊 Ver Reportes</span>
              </button>
              <button className="w-full text-left p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                <span className="text-indigo-600 font-medium">⚙️ Configuración</span>
              </button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas Recientes</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Usuarios este mes</span>
                <span className="font-semibold text-gray-900">{metrics?.usuarios_mes_actual || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Suscripciones este mes</span>
                <span className="font-semibold text-gray-900">{metrics?.suscripciones_mes_actual || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Plan Estudiante</span>
                <span className="font-semibold text-gray-900">{metrics?.suscriptores_estudiante || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Plan Familiar</span>
                <span className="font-semibold text-gray-900">{metrics?.suscriptores_familiar || 0}</span>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
