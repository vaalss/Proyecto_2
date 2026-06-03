import { useEffect, useRef, useState } from "react"
import { Search, BookOpen, X, User, LogOut, Home } from "lucide-react"
import { useNavigate } from "react-router-dom"
import AdminModal from "./AdminModal"
import BookDetail from "./BookDetail" // <--- Importamos el modal
import { Book } from "../types"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)
  
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [usuario, setUsuario] = useState<any>(null)
  
  // ─── NUEVOS ESTADOS PARA BÚSQUEDA ───
  const [catalogoCompleto, setCatalogoCompleto] = useState<Book[]>([])
  const [libroSeleccionado, setLibroSeleccionado] = useState<Book | null>(null)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const ADMIN_EMAILS = [
    "sergio@uvg.edu.gt", 
    "cris@uvg.edu.gt",
    "admin@admin.com"
  ]

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario")
    if (usuarioGuardado) setUsuario(JSON.parse(usuarioGuardado))

    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // ─── CARGAR CATÁLOGO EN SEGUNDO PLANO PARA BÚSQUEDA INSTANTÁNEA ───
  useEffect(() => {
    fetch("http://localhost:8080/api/libros")
      .then(res => res.json())
      .then(data => {
        const formateados = data.map((l: any) => ({
          id: l.id,
          titulo: l.titulo,
          autor: l.autor ? l.autor.nombre : "Autor Anónimo",
          sinopsis: l.sinopsis || "Sin sinopsis disponible.",
          genero: l.generos && l.generos.length > 0 ? l.generos[0].nombre : "General",
          estilo: l.estilo ? l.estilo.nombre : "Sin Estilo",
          tematica: l.tematicas ? l.tematicas.map((t: any) => t.nombre) : [],
          urlPortada: l.urlPortada || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400",
          año: l.año || 2026,
        }))
        setCatalogoCompleto(formateados)
      })
      .catch(err => console.error("Error precargando libros para búsqueda", err))
  }, [])

  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 100)
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

  // ─── LÓGICA DE FILTRADO (Por Título, Autor o Género) ───
  const searchResults = query.trim().length > 0 
    ? catalogoCompleto.filter(b => 
        b.titulo.toLowerCase().includes(query.toLowerCase()) ||
        b.autor.toLowerCase().includes(query.toLowerCase()) ||
        b.genero.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5) // Mostramos solo los mejores 5 resultados rápidos
    : []

  const isAdmin = usuario && ADMIN_EMAILS.includes(usuario.email)

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 transition-all duration-500 ${scrolled ? "bg-card shadow-lg shadow-border/50" : "bg-gradient-to-b from-background/95 to-transparent"}`}>
        
        <div onClick={() => navigate("/home")} className="flex items-center gap-2 shrink-0 cursor-pointer hover:opacity-80 transition-opacity" title="Ir a Pantalla Principal">
          <BookOpen className="h-6 w-6 text-primary" strokeWidth={2.5} />
          <span className="text-xl font-bold tracking-tight text-foreground select-none">
            Booky <span className="text-primary">Tuky</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          
          {/* Contenedor Animado de Búsqueda */}
          <div className={`relative flex items-center transition-all duration-300 ease-in-out h-9 ${searchOpen ? 'w-64 md:w-72' : 'w-9'}`}>
            <div className={`absolute right-0 flex items-center gap-2 bg-secondary border border-border rounded-full py-1.5 px-3 transition-all duration-300 ease-in-out w-full h-full ${searchOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input 
                ref={inputRef} 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                placeholder="Título, autor o género..." 
                className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full" 
              />
              <button onClick={() => { setSearchOpen(false); setQuery("") }} className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
                <X className="h-4 w-4" />
              </button>
            </div>

            <button onClick={() => setSearchOpen(true)} className={`absolute right-0 p-2 text-muted-foreground hover:text-foreground transition-all duration-300 rounded-full hover:bg-secondary h-9 w-9 flex items-center justify-center ${searchOpen ? 'opacity-0 invisible scale-50' : 'opacity-100 visible scale-100'}`}>
              <Search className="h-5 w-5" />
            </button>

            {/* ─── DROPDOWN DE RESULTADOS EN TIEMPO REAL ─── */}
            {searchOpen && query.trim().length > 0 && (
              <div className="absolute top-full right-0 mt-3 w-full bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2">
                {searchResults.length > 0 ? (
                  <div className="flex flex-col">
                    {searchResults.map((b) => (
                      <div 
                        key={b.id}
                        onClick={() => {
                          setLibroSeleccionado(b)
                          setQuery("")
                          setSearchOpen(false)
                        }}
                        className="flex items-center gap-3 p-3 hover:bg-primary/10 cursor-pointer transition-colors border-b border-border/50 last:border-0"
                      >
                        <img src={b.urlPortada} alt={b.titulo} className="w-10 h-14 object-cover rounded shadow-sm" />
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-foreground line-clamp-1">{b.titulo}</span>
                          <span className="text-xs text-muted-foreground">{b.autor} • {b.genero}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-5 text-center text-sm text-muted-foreground">
                    No se encontraron resultados para "<span className="text-foreground font-bold">{query}</span>"
                  </div>
                )}
              </div>
            )}
          </div>

          <div ref={menuRef} className="relative">
            <button onClick={() => setMenuOpen((v) => !v)} className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm hover:ring-2 hover:ring-primary/50 transition-all uppercase">
              <span className="transition-transform duration-300 ease-in-out" style={{ transform: menuOpen ? "rotate(360deg)" : "rotate(0deg)" }}>
                {usuario ? usuario.nombre.charAt(0) : "U"}
              </span>
            </button>

            {/* Menú desplegable */}
            <div className="absolute right-0 mt-2 w-52 rounded-lg overflow-hidden shadow-xl border border-border bg-background" style={{ transformOrigin: "top right", transform: menuOpen ? "scale(1)" : "scale(0.92)", opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? "auto" : "none", transition: "all 200ms ease" }}>
              <button onClick={() => { setMenuOpen(false); navigate("/home"); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                <Home className="h-4 w-4 shrink-0" /> Pantalla principal
              </button>
              
              <div className="h-px bg-border" />

              <button onClick={() => { setMenuOpen(false); navigate("/mi-cuenta"); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                <User className="h-4 w-4 shrink-0" /> Mi cuenta
              </button>
              
              {isAdmin && (
                <button onClick={() => { setShowAdminModal(true); setMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
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

      {/* RENDERIZADO DE MODALES */}
      {showAdminModal && <AdminModal onClose={() => setShowAdminModal(false)} />}
      
      {/* ¡La magia! El modal de detalles funciona desde cualquier pantalla */}
      {libroSeleccionado && (
        <BookDetail 
          book={libroSeleccionado} 
          onClose={() => setLibroSeleccionado(null)} 
        />
      )}
    </>
  )
}