import Card from './Card';

const features = [
  {
    icon: '🎯',
    title: 'Organización Automática',
    description: 'La IA organiza tu plan de estudio personalizado según tus exámenes y disponibilidad horaria. Nunca más te perderás fechas importantes.'
  },
  {
    icon: '🧠',
    title: 'Evaluaciones Personalizadas',
    description: 'Quizzes adaptados a tu perfil de aprendizaje. La IA identifica tus fortalezas y debilidades para crear contenido específico.'
  },
  {
    icon: '🏆',
    title: 'Gamificación Motivante',
    description: 'Puntos, trofeos y rankings que te motivan a seguir estudiando. Compite con tus amigos y celebra tus logros.'
  },
  {
    icon: '👨‍👩‍👧‍👦',
    title: 'Seguimiento para Padres',
    description: 'Los padres pueden ver el progreso de sus hijos en tiempo real, recibir reportes de desempeño y mantenerse informados.'
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="section-padding px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Por qué Brain Buddy
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre cómo nuestra IA personalizada revoluciona la forma de estudiar 
            y ayuda a miles de estudiantes a mejorar sus resultados académicos.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="animate-fade-in-up" 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Card>
                <div className="text-center">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-violet-500 mb-2">10,000+</div>
              <div className="text-gray-600">Estudiantes activos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-500 mb-2">85%</div>
              <div className="text-gray-600">Mejoran sus calificaciones</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-500 mb-2">4.8/5</div>
              <div className="text-gray-600">Rating promedio</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
