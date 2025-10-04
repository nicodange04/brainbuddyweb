'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: '¿Cómo funciona el free trial?',
    answer: 'El trial gratuito te da acceso completo a todas las funcionalidades por 14 días, sin necesidad de tarjeta de crédito. Simplemente registrate con tu email y empezás a usar Brain Buddy de inmediato.'
  },
  {
    question: '¿Puedo cancelar en cualquier momento?',
    answer: '¡Sí! Podés cancelar tu suscripción en cualquier momento desde tu perfil. No hay penalizaciones ni cobros adicionales. Tu acceso continúa hasta el final del periodo pagado.'
  },
  {
    question: '¿Los padres pueden ver el progreso?',
    answer: 'Absolutamente. Los padres pueden vincularse a la cuenta de sus hijos y recibir reportes de progreso en tiempo real, incluyendo tiempo de estudio, calificaciones en quiz y evolución académica.'
  },
  {
    question: '¿Qué materias cubre Brain Buddy?',
    answer: 'Brain Buddy funciona con cualquier materia de secundaria: Matemática, Física, Química, Historia, Literatura, Inglés, Biología y más. La IA se adapta al contenido que necesites estudiar.'
  },
  {
    question: '¿Necesito conocimientos técnicos?',
    answer: '¡Para nada! Brain Buddy está diseñado para ser súper simple de usar. Solo necesitás ingresar tus exámenes y la IA hace todo el resto. Perfecto para estudiantes y padres.'
  },
  {
    question: '¿Qué pasa si tengo problemas técnicos?',
    answer: 'Ofrecemos soporte técnico completo por email y chat. Además, ten tu plana documentación y tutoriales en video para ayudarte a aprovechar al máximo la plataforma.'
  },
  {
    question: '¿Es seguro para menores?',
    answer: 'Sí, Brain Buddy cumple con todas las regulaciones de seguridad y privacidad para menores. Los datos están protegidos y siempre cumplimos con las leyes de protección de datos.'
  },
  {
    question: '¿Puedo usar Brain Buddy en mi escuela?',
    answer: 'Sí, estamos desarrollando un Plan Institucional para escuelas. Contactanos directamente para conocer nuestras opciones de precios especiales para instituciones educativas.'
  }
];

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  return (
    <section id="faq" className="section-padding px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Preguntas frecuentes
          </h2>
          <p className="text-xl text-gray-600">
            Todas las respuestas que necesitás para empezar con Brain Buddy
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={() => toggleItem(index)}
              >
                <span className="text-lg font-medium text-gray-900">
                  {faq.question}
                </span>
                <svg 
                  className={`text-gray-400 transition-transform duration-200 ${
                    openItems.includes(index) ? 'rotate-180' : ''
                  }`} 
                  width="20" 
                  height="20" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-200 ${
                  openItems.includes(index) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              ¿No encontraste tu respuesta?
            </h3>
            <p className="text-gray-600 mb-6">
              Nuestro equipo de soporte está listo para ayudarte
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-violet-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-violet-600 transition-colors">
                Contactar soporte
              </button>
              <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Ver documentación
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
