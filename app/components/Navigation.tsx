import Button from './Button';

export default function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold text-gray-900">
                🧠 <span className="text-violet-500 ml-2">Brain Buddy</span>
              </span>
            </div>
          </div>

          {/* Navigation Links - Hidden on mobile */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#features" className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors">
                Características
              </a>
              <a href="#how-it-works" className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors">
                Cómo Funciona
              </a>
              <a href="#pricing" className="text-grey-700 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors">
                Precios
              </a>
              <a href="#faq" className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors">
                FAQ
              </a>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-3">
            <Button href="/admin/login" variant="secondary" size="md">
              Admin Login
            </Button>
            <Button href="/brainbuddyapp.apk" variant="primary">
              Empieza Gratis 14 Días
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
