export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold">
                🧠 <span className="text-violet-400 ml-2">Brain Buddy</span>
              </span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              El tutor de IA que ayuda a estudiantes de secundaria a organizarse, 
              estudiar mejor y alcanzar sus metas académicas.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-violet-400 transition-colors" aria-label="Instagram">
                {/* Instagram Icon */}
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-violet-400 transition-colors" aria-label="TikTok">
                {/* TikTok Icon */}
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.321 6.737c-1.04-1.04-1.485-2.498-1.202-3.95.283-1.453 1.421-2.661 2.873-2.944.072-.014.114-.063.128-.135.003-.014.003-.062-.001-.141-.004-.074-.013-.123-.027-.147-.029-.049-.08-.093-.153-.132-.073-.04-.126-.063-.159-.072-.033-.009-.092-.014-.178-.016-.174-.003-.289.018-.344.062-.055.044-.074.125-.056.241.018.117.044.177.078.181.034.004.082-.029.143-.099.061-.071.097-.127.109-.168.012-.041.014-.082.006-.122-.008-.041-.024-.073-.049-.097-.025-.023-.062-.039-.111-.047-.049-.008-.105-.006-.166.005-.061.011-.117.029-.168.054-.051.025-.093.057-.127.094-.034.037-.058.079-.072.124-.014.045-.013.089.003.133.016.044.041.077.076.098.035.021.075.029.122.024.047-.005.095-.022.145-.05 1.004-.558 1.566-1.469 1.566-2.598V1.54h.1c.061 0 .119.014.174.042.055.028.099.067.131.118.032.051.048.107.048.167v.1c0 .12.022.233.065.338.043.106.104.199.182.279.078.08.166.13.265.149.198.037.379-.036.542-.22.163-.184.235-.39.215-.86-.02-.47-.125-.858-.317-1.165-.192-.307-.448-.512-.77-.616-.322-.104-.65-.098-.985.018-.336.116-.596.32-.78.611-.185.292-.264.613-.238.964.026.351.157.67.394.958.237.288.562.508.975.659.414.151.841.218 1.281.204.44-.014.854-.142 1.242-.384.388-.242.667-.564.836 -.966.169-.402.205-.853.108-1.353-.097-5.5-.135-.9-.114-1.217v-.107c0-.061-.016-.119-.048-.174-.032-.055-.076-.099-.131-.127-.055-.028-.113-.042-.174-.042h-.1v1.294c-.2-.1-.41-.173-.63-.218-.22-.045-.447-.045-.683 0-.236.045-.453.118-.651.218v-.3c0-.06-.019-.118-.058-.175.073-.056.1-.089.082-.098-.018-.009-.061-.003-.129.018-.068.021-.124.046-.168.076-.044.03-.074.064-.09.102-.016.038-.018.077-.006.117.012.04.033.071.063.093.03.022.066.03.108.024.042-.006.081-.024.117-.054.036-.03.064-.069.084-.117.02-.048.024-.097.012-.146-.012-.049-.036-.087-.072-.115-.036-.028-.08-.041-.132-.039-.052.002-.101.016-.147.042-.046.026-.081.064-.105.114-.024.05-.028.099-.012.148.016.049.048.088.096.117.048.029.101.039.159.03.058-.009.109-.036.153-.081.044-.045.067-.101.069-.168.002-.067-.068-.136-.21-.206-.142-.07-.317-.093-.525-.069-.208.024-.406.131-.594.321-.188.191-.319.421-.393.69-.075.269-.086.554-.034.856.052.302.158.564.318.787.16.223.358.386.594.489.236.103.494.131.774.084.28-.047.532-.157.756-.33v-.063c-1.2 0-2.2-.4-3-.5z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-violet-400 transition-colors" aria-label="YouTube">
                {/* YouTube Icon */}
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Producto</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-300 hover:text-violet-400 transition-colors">Características</a></li>
              <li><a href="#pricing" className="text-gray-300 hover:text-violet-400 transition-colors">Precios</a></li>
              <li><a href="#how-it-works" className="text-gray-300 hover:text-violet-400 transition-colors">Cómo funciona</a></li>
              <li><a href="#faq" className="text-gray-300 hover:text-violet-400 transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Soporte</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-violet-400 transition-colors">Centro de ayuda</a></li>
              <li><a href="#" className="text-gray-300 hover:text-violet-400 transition-colors">Contacto</a></li>
              <li><a href="#" className="text-gray-300 hover:text-violet-400 transition-colors">Documentación</a></li>
              <li><a href="#" className="text-gray-300 hover:text-violet-400 transition-colors">Reportar bug</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-300 text-sm mb-4 md:mb-0">
              © 2024 Brain Buddy. Todos los derechos reservados.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-300 hover:text-violet-400 transition-colors">
                Términos y condiciones
              </a>
              <a href="#" className="text-gray-300 hover:text-violet-400 transition-colors">
                Política de privacidad
              </a>
              <a href="#" className="text-gray-300 hover:text-violet-400 transition-colors">
                Cookies
              </a>
            </div>
          </div>
          
          {/* Contact Email */}
          <div className="text-center mt-4">
            <a href="mailto:support@brainbuddy.com" className="text-gray-300 hover:text-violet-400 transition-colors">
              support@brainbuddy.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
