import Button from './Button';

export default function HeroSection() {
  return (
    <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-6 mb-12 lg:mb-0 animate-fade-in-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Aprende mejor,{' '}
              <span className="text-violet-500">rinde más</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              El tutor de IA que se adapta a tu forma de aprender. 
              Organízate, estudia y supera tus objetivos con la ayuda de la inteligencia artificial.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button size="lg" variant="primary">
                Empieza gratis 14 días
              </Button>
              <Button size="lg" variant="secondary">
                Descargar app móvil
              </Button>
            </div>

            {/* Features List */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center text-gray-700">
                <svg className="text-violet-500 mr-3 flex-shrink-0" width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Sin tarjeta de crédito requerida</span>
              </div>
              <div className="flex items-center text-gray-700">
                <svg className="text-violet-500 mr-3 flex-shrink-0" width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Planes desde $9.99/mes después del trial</span>
              </div>
              <div className="flex items-center text-gray-700">
                <svg className="text-violet-500 mr-3 flex-shrink-0" width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Perfecto para alumnos de 13-18 años</span>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <span className="text-indigo-500 mr-1">★★★★★</span>
                <span>4.8 de 5 estrellas</span>
              </div>
              <div>
                10,000+ alumnos felices
              </div>
            </div>
          </div>

          {/* Mockup/Illustration */}
          <div className="lg:col-span-6 animate-fade-in-up">
            <div className="relative">
              {/* Mockup placeholder - En un proyecto real aquí iría un mockup de la app */}
              <div className="mx-auto w-full max-w-md">
                <div className="relative rounded-3xl bg-gradient-to-b from-violet-400 to-purple-500 p-1 shadow-2xl">
                  <div className="rounded-[22px] bg-white p-8 text-center">
                    <div className="mb-6">
                      <div className="w-16 h-16 bg-violet-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-2xl">🧠</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Brain Buddy</h3>
                      <p className="text-gray-600">Tu tutor de IA personal</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-violet-50 rounded-lg p-3">
                        <div className="text-sm text-violet-700 font-medium">Mis exámenes</div>
                        <div className="text-xs text-violet-600">Matemática - 15 de Nov</div>
                      </div>
                      
                      <div className="bg-purple-50 rounded-lg p-3">
                        <div className="text-sm text-purple-700 font-medium">Plan de estudio</div>
                        <div className="text-xs text-purple-600">2h hoy + ejercicios</div>
                      </div>
                      
                      <div className="bg-indigo-50 rounded-lg p-3">
                        <div className="text-sm text-indigo-700 font-medium">Mis puntos</div>
                        <div className="text-xs text-indigo-600">🏆 1,240 pts</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center animate-bounce">
                  <span className="text-white text-sm">🎯</span>
                </div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-white text-xs">📚</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
