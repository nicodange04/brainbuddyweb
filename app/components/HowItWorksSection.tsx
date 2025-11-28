import Button from './Button';

export default function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Cargá tus exámenes',
      description: 'Ingresá las materias, fechas de exámenes y tu disponibilidad horaria. La IA analizará tu perfil de aprendizaje.',
      icon: '📚',
      color: 'violet'
    },
    {
      number: '02', 
      title: 'La IA organiza tu plan',
      description: 'Recibí un plan de estudio personalizado que se adapta a tu ritmo y estilo de aprendizaje.',
      icon: '🤖',
      color: 'purple'
    },
    {
      number: '03',
      title: 'Estudiá y mejorá',
      description: 'Ejecutá el plan, completá quiz interactivos y ganá puntos por tu progreso.',
      icon: '🏆',
      color: 'indigo'
    }
  ];

  return (
    <section id="how-it-works" className="section-padding px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Cómo funciona Brain Buddy
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            En solo 3 pasos simples, Brain Buddy revoluciona tu forma de estudiar 
            y te ayuda a alcanzar tus metas académicas.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              {/* Step Number */}
              <div className={`inline-flex items-center justify-center w-16 h-16 text-2xl font-bold text-white rounded-full mb-6 ${
                step.color === 'violet' ? 'bg-violet-500' :
                step.color === 'purple' ? 'bg-purple-500' : 'bg-indigo-500'
              }`}>
                {step.number}
              </div>

              {/* Step Icon */}
              <div className="text-5xl mb-4">{step.icon}</div>

              {/* Step Content */}
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent"></div>
              )}
            </div>
          ))}
        </div>

        {/* Visual Flow */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-4 bg-white rounded-full px-6 py-3 shadow-sm">
            <span className="text-sm font-medium text-gray-700">
              Resultado:
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">📈</span>
              <span className="text-lg font-semibold text-violet-500">
                Mejores calificaciones
              </span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <Button href="/brainbuddyapp.apk" variant="primary" size="lg">
              Comenzar gratis
            </Button>
            <Button href="#features" variant="secondary" size="lg">
              Ver demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
