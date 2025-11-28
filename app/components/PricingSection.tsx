'use client'

import { useEffect, useState } from 'react';
import Button from './Button';
import Card from './Card';
import CheckoutButton from './CheckoutButton';
import { configuracionService } from '@/lib/supabase/configuracion';
import { PlanSuscripcion } from '@/lib/types/configuracion';

export default function PricingSection() {
  const [plans, setPlans] = useState<PlanSuscripcion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const config = await configuracionService.getConfiguracion();
      // config.data.planes es un objeto ConfiguracionPlanes, el array está en .planes
      const planesArray = config.data.planes?.planes || [];
      setPlans(planesArray.filter(plan => plan.activo));
    } catch (error) {
      console.error('Error al cargar planes:', error);
      // Fallback a planes por defecto
      setPlans([
        {
          id: 'estudiante',
          nombre: 'Plan Estudiante',
          descripcion: 'Ideal para estudiantes individuales',
          precio_mensual: 100,
          precio_anual: 1000,
          caracteristicas: [
            'Hasta 5 exámenes simultáneos',
            'Sesiones de estudio ilimitadas',
            'Generación de contenido con IA',
            'Gamificación completa',
            '1 padre puede vincularse',
            'Reportes de progreso',
            'Soporte prioritario'
          ],
          activo: true,
          limite_usuarios: 1
        },
        {
          id: 'familiar',
          nombre: 'Plan Familiar',
          descripcion: 'Perfecto para familias múltiples',
          precio_mensual: 250,
          precio_anual: 2500,
          caracteristicas: [
            'Todo lo del Plan Estudiante',
            'Hasta 3 alumnos por cuenta',
            'Exámenes ilimitados',
            'Múltiples padres pueden vincularse',
            'Reportes comparativos entre hermanos',
            'Dashboard familiar',
            'Soporte prioritario'
          ],
          activo: true,
          limite_usuarios: 3
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const displayPlans = [
    {
      name: 'Free Trial',
      price: 'Gratis',
      period: '14 días',
      description: 'Perfecto para probar todas las funcionalidades',
      features: [
        'Acceso completo por 14 días',
        'Máximo 2 exámenes simultáneos',
        'Todas las funcionalidades disponibles',
        'Soporte por email',
        'Sin tarjeta de crédito requerida'
      ],
      cta: 'Empieza gratis',
      isPopular: false,
      color: 'gray'
    },
    ...plans.map((plan, index) => ({
      name: plan.nombre,
      price: formatPrice(plan.precio_mensual),
      period: '/mes',
      description: plan.descripcion,
      features: plan.caracteristicas,
      cta: 'Seleccionar plan',
      isPopular: index === 0,
      color: plan.id === 'familiar' ? 'purple' : 'violet',
      planData: plan
    }))
  ];

  if (loading) {
    return (
      <section id="pricing" className="section-padding px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando planes...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="pricing" className="section-padding px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Elige tu plan perfecto
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comienza gratis por 14 días. Sin compromisos, sin tarjeta de crédito requerida. 
            Cancela en cualquier momento.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {displayPlans.map((plan, index) => (
            <div key={index} className={`relative ${plan.isPopular ? 'scale-105' : ''}`}>
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-violet-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Más Popular
                  </span>
                </div>
              )}
              
              <Card className={`h-full ${plan.isPopular ? 'ring-2 ring-violet-500 shadow-lg' : ''}`}>
                <div className="text-center">
                  {/* Plan Name */}
                  <h3 className={`text-xl font-bold mb-2 ${
                    plan.color === 'violet' ? 'text-violet-600' :
                    plan.color === 'purple' ? 'text-purple-600' : 'text-gray-600'
                  }`}>
                    {plan.name}
                  </h3>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-6">{plan.description}</p>

                  {/* Features */}
                  <ul className="space-y-3 mb-8 text-left">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <svg className="text-green-500 mr-3 flex-shrink-0 mt-0.5" width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  {plan.name === 'Free Trial' ? (
                    <Button 
                      href="/brainbuddyapp.apk"
                      variant={
                        plan.color === 'violet' ? 'accent' :
                        plan.color === 'purple' ? 'secondary' : 'primary'
                      }
                      className="w-full"
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  ) : (
                    plan.planData && (
                      <div className="space-y-2">
                        {/* Botón Anual - Arriba, todo violeta */}
                        {plan.planData.precio_anual && (
                          <CheckoutButton
                            plan={plan.planData}
                            frequency="annual"
                            variant="primary"
                            size="lg"
                            className="w-full"
                          />
                        )}
                        
                        {/* Botón Mensual - Abajo, borde violeta y texto violeta */}
                        <CheckoutButton
                          plan={plan.planData}
                          frequency="monthly"
                          variant="primary"
                          size="lg"
                          className="w-full bg-transparent border-2 border-violet-500 text-violet-600 hover:bg-violet-50"
                        />
                      </div>
                    )
                  )}
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Money Back Guarantee */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center bg-violet-50 rounded-full px-6 py-3">
            <svg className="text-violet-500 mr-2" width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-violet-700 font-medium">
              Garantía de devolución de dinero de 30 días
            </span>
          </div>
        </div>

        {/* FAQ Quick Links */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            ¿Tenés dudas?{' '}
            <a href="#faq" className="text-violet-500 hover:text-violet-600 underline">
              Preguntas frecuentes
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
