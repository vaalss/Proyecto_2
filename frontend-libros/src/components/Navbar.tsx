import { useEffect, useRef, useState } from "react"
import { Search, BookOpen, X, User, LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (searchOpen) {
      // Pequeño timeout para permitir que la animación empiece antes de enfocar
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

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 transition-all duration-500 ${scrolled ? "bg-card shadow-lg shadow-border/50" : "bg-gradient-to-b from-background/95 to-transparent"}`}>
      <div className="flex items-center gap-2 shrink-0">
        <BookOpen className="h-6 w-6 text-primary" strokeWidth={2.5} />
        <span className="text-xl font-bold tracking-tight text-foreground select-none">
          Booky <span className="text-primary">Tuky</span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        
        {/* Contenedor Animado de Búsqueda */}
        <div className={`relative flex items-center transition-all duration-300 ease-in-out h-9 ${searchOpen ? 'w-56' : 'w-9'}`}>
          {/* Input Expandible */}
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

          {/* Botón Lupa (Estado Cerrado) */}
          <button 
            onClick={() => setSearchOpen(true)} 
            className={`absolute right-0 p-2 text-muted-foreground hover:text-foreground transition-all duration-300 rounded-full hover:bg-secondary h-9 w-9 flex items-center justify-center ${searchOpen ? 'opacity-0 invisible scale-50' : 'opacity-100 visible scale-100'}`}
          >
            <Search className="h-5 w-5" />
          </button>
        </div>

        <div ref={menuRef} className="relative">
          <button onClick={() => setMenuOpen((v) => !v)} className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm hover:ring-2 hover:ring-primary/50 transition-all">
            <span className="transition-transform duration-300 ease-in-out" style={{ transform: menuOpen ? "rotate(360deg)" : "rotate(0deg)" }}>A</span>
          </button>

          <div className="absolute right-0 mt-2 w-44 rounded-lg overflow-hidden shadow-xl border border-border bg-background" style={{ transformOrigin: "top right", transform: menuOpen ? "scale(1)" : "scale(0.92)", opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? "auto" : "none", transition: "all 200ms ease" }}>
            <button onClick={() => setMenuOpen(false)} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
              <User className="h-4 w-4 shrink-0" /> Mi cuenta
            </button>
            <div className="h-px bg-border" />
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
              <LogOut className="h-4 w-4 shrink-0" /> Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}