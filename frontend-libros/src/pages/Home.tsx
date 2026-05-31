"use client"

import { useEffect, useRef, useState } from "react"
import { ThumbsUp, ThumbsDown, Info, Search, ChevronLeft, ChevronRight, BookOpen, X, User, LogOut } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────
interface Book {
  id: number
  titulo: string
  autor: string
  sinopsis: string
  genero: string
  tematica: string[]
  urlPortada: string
  año: number
}

// ─── Mock Data (Respaldo) ──────────────────────────────────────────────────────
const books: Book[] = [
  {
    id: 1,
    titulo: "Cien Años de Soledad",
    autor: "Gabriel García Márquez",
    sinopsis: "La historia de la familia Buendía a lo largo de siete generaciones en el pueblo ficticio de Macondo, explorando temas de amor, guerra y el paso inevitable del tiempo.",
    genero: "Realismo Mágico",
    tematica: ["Familia", "Magia", "Historia"],
    urlPortada: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400",
    año: 1967,
  },
  {
    id: 2,
    titulo: "El Amor en los Tiempos del Cólera",
    autor: "Gabriel García Márquez",
    sinopsis: "Una historia de amor que abarca más de cincuenta años, siguiendo a Florentino Ariza en su devoción eterna por Fermina Daza.",
    genero: "Novela Romántica",
    tematica: ["Amor", "Vejez", "Esperanza"],
    urlPortada: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400",
    año: 1985,
  }
]

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus()
  }, [searchOpen])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [menuOpen])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 transition-all duration-500 ${
        scrolled
          // CORRECCIÓN 1: Usamos bg-card en lugar de bg-secondary para el color crema/arena
          ? "bg-card shadow-lg shadow-border/50" 
          : "bg-gradient-to-b from-background/95 to-transparent"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <BookOpen className="h-6 w-6 text-primary" strokeWidth={2.5} />
        <span className="text-xl font-bold tracking-tight text-foreground select-none">
          Booky <span className="text-primary">Tuky</span>
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="flex items-center">
          {searchOpen ? (
            <div className="flex items-center gap-2 bg-secondary border border-border rounded-md px-3 py-1.5 animate-in fade-in slide-in-from-right-4 duration-200">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Títulos, autores, géneros…"
                className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-48"
              />
              <button
                onClick={() => { setSearchOpen(false); setQuery("") }}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Cerrar búsqueda"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary"
              aria-label="Abrir búsqueda"
            >
              <Search className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Avatar + dropdown */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm hover:ring-2 hover:ring-primary/50 transition-all"
            aria-label="Perfil de usuario"
            aria-expanded={menuOpen}
          >
            <span
              className="inline-flex items-center justify-center w-full h-full transition-transform duration-300 ease-in-out"
              style={{ transform: menuOpen ? "rotate(360deg)" : "rotate(0deg)" }}
            >
              A
            </span>
          </button>

          {/* Dropdown */}
          <div
            // CORRECCIÓN 2: Le agregamos la clase bg-background directamente aquí
            className="absolute right-0 mt-2 w-44 rounded-lg overflow-hidden shadow-xl border border-border bg-background"
            style={{
              transformOrigin: "top right",
              transform: menuOpen ? "scale(1)" : "scale(0.92)",
              opacity: menuOpen ? 1 : 0,
              pointerEvents: menuOpen ? "auto" : "none",
              transition: "transform 200ms cubic-bezier(0.4,0,0.2,1), opacity 200ms cubic-bezier(0.4,0,0.2,1)",
            }}
            role="menu"
          >
            <button
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              role="menuitem"
              onClick={() => setMenuOpen(false)}
            >
              <User className="h-4 w-4 shrink-0" />
              Mi cuenta
            </button>
            <div className="h-px bg-border" />
            <button
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              role="menuitem"
              onClick={() => setMenuOpen(false)}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection({ booksPool }: { booksPool: Book[] }) {
  const [poolIndex, setPoolIndex] = useState(0)
  const [liked, setLiked] = useState(false)
  const [exiting, setExiting] = useState(false)
  const [entering, setEntering] = useState(false)

  if (!booksPool || booksPool.length === 0) return null

  const currentBook = booksPool[poolIndex % booksPool.length]

  const handleNotInterested = () => {
    setExiting(true)
    setTimeout(() => {
      setPoolIndex((i) => i + 1)
      setLiked(false)
      setExiting(false)
      setEntering(true)
      setTimeout(() => setEntering(false), 500)
    }, 450)
  }

  return (
    <section className="relative w-full h-[80vh] min-h-[520px] flex items-end overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: `url(${currentBook.urlPortada})` }}
        aria-hidden="true"
      />
      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-transparent" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" aria-hidden="true" />

      {/* Content */}
      <div
        className="relative z-10 px-6 md:px-12 pb-16 max-w-2xl transition-all duration-450 ease-in-out"
        style={{
          opacity: exiting ? 0 : entering ? 0 : 1,
          transform: exiting
            ? "translateX(80px)"
            : entering
            ? "translateX(-40px)"
            : "translateX(0)",
          transition: "opacity 450ms ease-in-out, transform 450ms ease-in-out",
        }}
      >
        <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-3">
          Recomendado para ti
        </p>
        <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight text-balance mb-3">
          {currentBook.titulo}
        </h1>
        <p className="text-sm text-muted-foreground mb-1">
          {currentBook.autor} · {currentBook.año} · {currentBook.genero}
        </p>
        <p className="text-sm md:text-base text-foreground/80 leading-relaxed mb-6 line-clamp-3">
          {currentBook.sinopsis}
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setLiked((v) => !v)}
            className={`flex items-center gap-2 px-6 py-3 rounded-md font-bold text-sm border transition-colors ${
              liked
                ? "bg-foreground border-foreground text-background"
                : "bg-primary text-primary-foreground border-primary hover:bg-primary/80"
            }`}
          >
            <ThumbsUp className={`h-4 w-4 ${liked ? "fill-background" : ""}`} />
            Me gusta
          </button>
          <button className="flex items-center gap-2 px-6 py-3 rounded-md font-bold text-sm bg-transparent text-foreground border border-primary hover:bg-primary/10 transition-colors">
            <Info className="h-4 w-4" />
            Más información
          </button>
          <button
            onClick={handleNotInterested}
            className="group/ni flex items-center gap-2 px-6 py-3 rounded-md font-bold text-sm bg-transparent text-muted-foreground border border-border hover:bg-background hover:border-background hover:text-foreground transition-colors"
          >
            <ThumbsDown className="h-4 w-4 group-hover/ni:text-foreground transition-colors" />
            No me interesa
          </button>
        </div>
      </div>
    </section>
  )
}

// ─── Book Card ─────────────────────────────────────────────────────────────────
function BookCard({
  book,
  dismissable = false,
  onDismiss,
}: {
  book: Book
  dismissable?: boolean
  onDismiss?: (id: number) => void
}) {
  const [imgError, setImgError] = useState(false)

  return (
    <div className="group relative w-full cursor-pointer">
      {/* Card */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-muted transition-transform duration-300 ease-out group-hover:scale-110 group-hover:z-10 group-hover:shadow-2xl group-hover:shadow-border">
        {/* Cover */}
        {!imgError ? (
          <img
            src={book.urlPortada || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400"}
            alt={`Portada de ${book.titulo}`}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-secondary p-3">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
            <span className="text-xs text-muted-foreground text-center leading-tight">
              {book.titulo}
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-muted via-muted/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 gap-1.5">
          <p className="text-foreground text-xs font-semibold leading-tight line-clamp-2">
            {book.titulo}
          </p>
          <p className="text-foreground/75 text-[11px] leading-tight">{book.autor}</p>
          <div className="flex flex-wrap gap-1 mt-0.5">
            <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-sm font-semibold">
              {book.genero}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Carousel Row ──────────────────────────────────────────────────────────────
function CarouselRow({
  titulo,
  books,
  dismissable = false,
}: {
  titulo: string
  books: Book[]
  dismissable?: boolean
}) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [items, setItems] = useState<Book[]>(books)
  const [removingIds, setRemovingIds] = useState<number[]>([])
  const [offset, setOffset] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Sincronizar items con los libros que vengan de DB
  useEffect(() => {
    setItems(books)
  }, [books])

  const getMaxOffset = () => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return 0
    const paddingLeft = parseFloat(getComputedStyle(viewport).paddingLeft) || 0
    const paddingRight = parseFloat(getComputedStyle(viewport).paddingRight) || 0
    return Math.max(0, track.scrollWidth - viewport.clientWidth + paddingLeft + paddingRight)
  }

  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateButtons = (currentOffset: number) => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return
    const max = getMaxOffset()
    setCanScrollLeft(currentOffset > 0)
    setCanScrollRight(currentOffset < max - 4)
  }

  useEffect(() => {
    updateButtons(offset)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset, items.length])

  const scroll = (dir: "left" | "right") => {
    if (isAnimating) return
    const viewport = viewportRef.current
    if (!viewport) return
    const step = viewport.clientWidth * 0.75
    const maxOffset = getMaxOffset()
    const next = dir === "right"
      ? Math.min(offset + step, maxOffset)
      : Math.max(offset - step, 0)
    setIsAnimating(true)
    setOffset(next)
    setTimeout(() => setIsAnimating(false), 420)
  }

  const handleDismiss = (id: number) => {
    setRemovingIds((prev) => [...prev, id])
    window.setTimeout(() => {
      setItems((prev) => prev.filter((b) => b.id !== id))
      setRemovingIds((prev) => prev.filter((x) => x !== id))
      setOffset((prev) => {
        const maxOffset = getMaxOffset()
        return Math.min(prev, maxOffset)
      })
    }, 320)
  }

  useEffect(() => {
    const onResize = () => {
      const maxOffset = getMaxOffset()
      setOffset((prev) => {
        const clamped = Math.min(prev, maxOffset)
        updateButtons(clamped)
        return clamped
      })
    }
    window.addEventListener("resize", onResize)
    requestAnimationFrame(onResize)
    return () => window.removeEventListener("resize", onResize)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (items.length === 0) return null

  return (
    <div className="mb-10">
      <h2 className="px-6 md:px-12 text-sm md:text-base font-semibold text-foreground mb-4 tracking-wide">
        {titulo}
      </h2>
      <div className="relative group/row">
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-0 bottom-0 z-20 w-12 flex items-center justify-center bg-gradient-to-r from-background to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity"
            aria-label="Desplazar izquierda"
          >
            <ChevronLeft className="h-7 w-7 text-foreground drop-shadow" />
          </button>
        )}

        <div ref={viewportRef} className="overflow-hidden px-6 md:px-12 pb-2">
          <div
            ref={trackRef}
            className="flex gap-3"
            style={{
              transform: `translateX(-${offset}px)`,
              transition: "transform 420ms cubic-bezier(0.4, 0, 0.2, 1)",
              willChange: "transform",
            }}
          >
            {items.map((book) => {
              const removing = removingIds.includes(book.id)
              return (
                <div
                  key={book.id}
                  className={`flex-shrink-0 transition-all duration-300 ease-out ${
                    removing
                      ? "w-0 opacity-0 scale-75 -translate-y-3 overflow-hidden -mr-3"
                      : "w-32 md:w-40"
                  }`}
                >
                  <BookCard
                    book={book}
                    dismissable={dismissable}
                    onDismiss={handleDismiss}
                  />
                </div>
              )
            })}
          </div>
        </div>

        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-0 bottom-0 z-20 w-12 flex items-center justify-center bg-gradient-to-l from-background to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity"
            aria-label="Desplazar derecha"
          >
            <ChevronRight className="h-7 w-7 text-foreground drop-shadow" />
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Dashboard ─────────────────────────────────────────
export default function Dashboard() {
  const [libros, setLibros] = useState<Book[]>([])
  const [cargando, setCargando] = useState(true)
  const [errorDb, setErrorDb] = useState(false)

  useEffect(() => {
    const fetchLibros = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/libros")
        if (response.ok) {
          const data = await response.json()
          
          // Imprimimos en la consola lo que nos manda Spring Boot para revisarlo
          console.log("Datos que llegaron de Spring Boot:", data)
          
          const librosFormateados = data.map((l: any) => ({
            id: l.id,
            titulo: l.titulo,
            autor: l.autor ? l.autor.nombre : "Autor Anónimo",
            sinopsis: l.sinopsis || "Sin sinopsis disponible.",
            genero: l.generos && l.generos.length > 0 ? l.generos[0].nombre : "General",
            tematica: l.tematicas ? l.tematicas.map((t: any) => t.nombre) : [],
            urlPortada: l.urlPortada || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400",
            año: 2026
          }))
          setLibros(librosFormateados)
        } else {
          console.error("El backend respondió con error:", response.status)
          setErrorDb(true)
        }
      } catch (error) {
        console.error("Error conectando al backend:", error)
        setErrorDb(true)
      } finally {
        setCargando(false)
      }
    }
    fetchLibros()
  }, [])

  if (cargando) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center text-xl font-bold">
        Cargando biblioteca...
      </div>
    )
  }

  // DIAGNÓSTICO 1: Si hubo error en el fetch
  if (errorDb) {
    return (
      <div className="min-h-screen bg-background text-red-600 flex flex-col items-center justify-center text-xl font-bold p-8 text-center">
        <p>Hubo un error al conectar con Spring Boot.</p>
        <p className="text-sm text-foreground mt-4">Abre la consola de tu navegador (F12) para ver el error exacto.</p>
      </div>
    )
  }

  // DIAGNÓSTICO 2: Si la conexión fue exitosa pero no hay libros
  if (libros.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center text-xl font-bold p-8 text-center">
        <p>¡Conexión exitosa a Spring Boot!</p>
        <p className="text-sm text-muted-foreground mt-4">Pero tu base de datos de Neo4j está vacía (0 libros). Agrega un libro en tu base de datos para verlo aquí.</p>
      </div>
    )
  }

  // DIAGNÓSTICO 3: Todo funciona perfecto (Usamos SÓLO los libros de la DB)
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <HeroSection booksPool={libros} />
      <section className="pt-8 pb-20">
        <CarouselRow key="todos" titulo="Todos los libros disponibles" books={libros} dismissable={false} />
        <CarouselRow key="recomendaciones" titulo="Sugerencias del recomendador" books={libros.slice().reverse()} dismissable={true} />
      </section>
      <footer className="border-t border-border px-6 md:px-12 py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Booky Tuky
      </footer>
    </main>
  )
}