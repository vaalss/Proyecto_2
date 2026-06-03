import { useEffect, useRef, useState } from "react"
import { Search, BookOpen, X, User, LogOut, Home } from "lucide-react"
import { useNavigate } from "react-router-dom"
import AdminModal from "./AdminModal"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)
  
  // Estados para el Admin Modal y el Usuario
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [usuario, setUsuario] = useState<any>(null)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // ─── LISTA BLANCA DE CORREOS PARA ADMINISTRAR ───
  const ADMIN_EMAILS = [
    "sergio@uvg.edu.gt", 
    "cris@uvg.edu.gt",
    "admin@admin.com"
  ]

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario")
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado))
    }

    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [searchOpen])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [menuOpen])

  const handleLogout = () => {
    localStorage.removeItem("usuario")
    navigate("/")
  }

  const isAdmin = usuario && ADMIN_EMAILS.includes(usuario.email)

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 transition-all duration-500 ${scrolled ? "bg-card shadow-lg shadow-border/50" : "bg-gradient-to-b from-background/95 to-transparent"}`}>
        
        {/* 1. LOGO INTERACTIVO: Al hacer clic, navega a /home */}
        <div 
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
          title="Ir a Pantalla Principal"
        >
          <BookOpen className="h-6 w-6 text-primary" strokeWidth={2.5} />
          <span className="text-xl font-bold tracking-tight text-foreground select-none">
            Booky <span className="text-primary">Tuky</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          
          {/* Contenedor Animado de Búsqueda */}
          <div className={`relative flex items-center transition-all duration-300 ease-in-out h-9 ${searchOpen ? 'w-56' : 'w-9'}`}>
            <div className={`absolute right-0 flex items-center gap-2 bg-secondary border border-border rounded-full py-1.5 px-3 transition-all duration-300 ease-in-out w-full h-full ${searchOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input 
                ref={inputRef} 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                placeholder="Buscar..." 
                className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full" 
              />
              <button onClick={() => { setSearchOpen(false); setQuery("") }} className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
                <X className="h-4 w-4" />
              </button>
            </div>

            <button 
              onClick={() => setSearchOpen(true)} 
              className={`absolute right-0 p-2 text-muted-foreground hover:text-foreground transition-all duration-300 rounded-full hover:bg-secondary h-9 w-9 flex items-center justify-center ${searchOpen ? 'opacity-0 invisible scale-50' : 'opacity-100 visible scale-100'}`}
            >
              <Search className="h-5 w-5" />
            </button>
          </div>

          <div ref={menuRef} className="relative">
            <button onClick={() => setMenuOpen((v) => !v)} className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm hover:ring-2 hover:ring-primary/50 transition-all uppercase">
              <span className="transition-transform duration-300 ease-in-out" style={{ transform: menuOpen ? "rotate(360deg)" : "rotate(0deg)" }}>
                {usuario ? usuario.nombre.charAt(0) : "U"}
              </span>
            </button>

            {/* Menú desplegable */}
            <div className="absolute right-0 mt-2 w-52 rounded-lg overflow-hidden shadow-xl border border-border bg-background" style={{ transformOrigin: "top right", transform: menuOpen ? "scale(1)" : "scale(0.92)", opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? "auto" : "none", transition: "all 200ms ease" }}>
              
              {/* 2. OPCIÓN: PANTALLA PRINCIPAL */}
              <button 
                onClick={() => { setMenuOpen(false); navigate("/home"); }} 
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Home className="h-4 w-4 shrink-0" /> Pantalla principal
              </button>
              
              <div className="h-px bg-border" />

              <button 
                onClick={() => { setMenuOpen(false); navigate("/mi-cuenta"); }} 
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <User className="h-4 w-4 shrink-0" /> Mi cuenta
              </button>
              
              {isAdmin && (
                <button 
                  onClick={() => {
                    setShowAdminModal(true)
                    setMenuOpen(false)
                  }} 
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <BookOpen className="h-4 w-4 shrink-0" /> Administrar Catálogo
                </button>
              )}

              <div className="h-px bg-border" />
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                <LogOut className="h-4 w-4 shrink-0" /> Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* RENDERIZADO DEL MODAL SI ESTÁ ACTIVO */}
      {showAdminModal && <AdminModal onClose={() => setShowAdminModal(false)} />}
    </>
  )
}