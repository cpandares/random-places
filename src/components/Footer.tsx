export const Footer = () => {
  return (
    <footer className="w-full max-w-4xl px-6 sm:px-8 py-6 text-center text-xs text-slate-500">
        Datos de <a href="https://foursquare.com" target="_blank" rel="noreferrer" className="underline hover:text-slate-400">geoapify</a>. Hecho con ♥ por <a href="https://github.com/cpandares" target="_blank" rel="noreferrer" className="underline hover:text-slate-400">César Pandares: </a>.  
        <div className="mt-3 flex items-center justify-center gap-4">
          <a href="https://www.instagram.com/cessaaarrrr?igsh=ZjhudXltNWJveWgz" target="_blank" aria-label="Instagram" title="Instagram" className="inline-flex items-center text-slate-500 hover:text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="3.5" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
            <span className="sr-only">Instagram</span>
          </a>
          <a href="https://www.linkedin.com/in/cesar-pandares-91617b177/" target="_blank" aria-label="LinkedIn" title="LinkedIn" className="inline-flex items-center text-slate-500 hover:text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.225 0H1.771C.792 0 0 .775 0 1.73v20.541C0 23.225.792 24 1.771 24h20.454C23.2 24 24 23.225 24 22.271V1.73C24 .775 23.2 0 22.225 0zM7.06 20.452H3.56V9h3.5v11.452zM5.31 7.433a2.03 2.03 0 1 1 0-4.06 2.03 2.03 0 0 1 0 4.06zM20.45 20.452h-3.5v-6.2c0-1.478-.03-3.376-2.06-3.376-2.06 0-2.375 1.609-2.375 3.27v6.306h-3.5V9h3.36v1.56h.05c.47-.89 1.61-1.83 3.32-1.83 3.55 0 4.2 2.34 4.2 5.38v6.34z"/>
            </svg>
            <span className="sr-only">LinkedIn</span>
          </a>
        </div>
      </footer>
  )
}