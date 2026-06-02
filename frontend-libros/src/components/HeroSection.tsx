import { useState, useEffect } from "react"
import { ThumbsUp, ThumbsDown, Info, Star, ChevronLeft, ChevronRight } from "lucide-react"
import { Book } from "../types"

export default function HeroSection({ booksPool, onOpenDetail }: { booksPool: Book[], onOpenDetail: (book: Book) => void }) {  
  const [poolIndex, setPoolIndex] = useState(0)
  const [liked, setLiked] = useState(false)
  const [exiting, setExiting] = useState(false)
  const [entering, setEntering] = useState(false)
  const [usuarioId, setUsuarioId] = useState<number | null>(null)

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario")
    if (usuarioGuardado) {
      const usuario = JSON.parse(usuarioGuardado)
      setUsuarioId(usuario.id)
    }
  }, [])

  const heroBooks = booksPool ? booksPool.slice(0, 5) : []

  // ── Funciones de Navegación ──────────────────────────────────────────────
  const goToNextBook = () => {
    if (exiting || entering) return;
    setExiting(true)
    setTimeout(() => {
      setPoolIndex((i) => i + 1)
      setLiked(false)
      setExiting(false)
      setEntering(true)
      setTimeout(() => setEntering(false), 500)
    }, 450)
  }

  const goToPrevBook = () => {
    if (exiting || entering) return;
    setExiting(true)
    setTimeout(() => {
      setPoolIndex((i) => i - 1)
      setLiked(false)
      setExiting(false)
      setEntering(true)
      setTimeout(() => setEntering(false), 500)
    }, 450)
  }

  const goToIndex = (targetIdx: number) => {
    if (exiting || entering || targetIdx === currentIndex) return;
    setExiting(true)
    setTimeout(() => {
      setPoolIndex(targetIdx)
      setLiked(false)
      setExiting(false)
      setEntering(true)
      setTimeout(() => setEntering(false), 500)
    }, 450)
  }

  // Auto-rotación
  useEffect(() => {
    if (heroBooks.length <= 1 || exiting || entering) return

    const timer = setTimeout(() => {
      goToNextBook()
    }, 8000)

    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolIndex, exiting, entering, heroBooks.length])

  if (heroBooks.length === 0) return null

  // Fórmula segura para índices negativos en JavaScript
  const currentIndex = ((poolIndex % heroBooks.length) + heroBooks.length) % heroBooks.length
  const currentBook = heroBooks[currentIndex]

  const toggleLike = async () => {
    if (!usuarioId) return
    const method = liked ? "DELETE" : "POST"

    try {
      const response = await fetch(`http://localhost:8080/api/usuarios/${usuarioId}/favoritos/${currentBook.id}`, {
        method: method,
      })

      if (response.ok) {
        setLiked(!liked)
      }
    } catch (error) {
      console.error("Error de conexión con el servidor:", error)
    }
  }

  return (
    // Agregamos "group" para detectar el hover sobre la sección completa
    <section className="relative w-full h-[80vh] min-h-[520px] flex items-end overflow-hidden group">
      <div 
        className="absolute inset-0 bg-cover bg-center scale-105 transition-all duration-1000 ease-in-out" 
        style={{ backgroundImage: `url(${currentBook.urlPortada})` }} 
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

      {/* ── Botones de Navegación Laterales (Aparecen al hacer hover) ── */}
      {heroBooks.length > 1 && (
        <>
          <button
            onClick={goToPrevBook}
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-40 p-2 md:p-3 rounded-full bg-background/40 hover:bg-background/80 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 border border-white/20"
            aria-label="Recomendación anterior"
          >
            <ChevronLeft size={28} />
          </button>

          <button
            onClick={goToNextBook}
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-40 p-2 md:p-3 rounded-full bg-background/40 hover:bg-background/80 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 border border-white/20"
            aria-label="Recomendación siguiente"
          >
            <ChevronRight size={28} />
          </button>
        </>
      )}

      <div 
        className="relative z-10 px-6 md:px-12 pb-16 max-w-2xl transition-all duration-450 ease-in-out" 
        style={{ 
          opacity: exiting ? 0 : entering ? 0 : 1, 
          transform: exiting ? "translateX(80px)" : entering ? "translateX(-40px)" : "translateX(0)", 
        }}
      >
        {currentBook.matchPercentage && currentBook.matchPercentage >= 70 ? (
          <div className="inline-flex items-center gap-1.5 font-bold text-primary bg-primary/15 px-3 py-1 rounded-md border border-primary/20 text-xs mb-3 shadow-sm">
            <Star size={13} className="fill-primary shrink-0" />
            {currentBook.matchPercentage}% de coincidencia
          </div>
        ) : (
          <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-3">Recomendado para ti</p>
        )}

        <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight text-balance mb-3">{currentBook.titulo}</h1>
        <p className="text-sm text-muted-foreground mb-1">{currentBook.autor} · {currentBook.año} · {currentBook.genero}</p>
        <p className="text-sm md:text-base text-foreground/80 leading-relaxed mb-6 line-clamp-3">{currentBook.sinopsis}</p>
        
        <div className="flex items-center gap-3 flex-wrap">
          <button onClick={toggleLike} className={`flex items-center gap-2 px-6 py-3 rounded-md font-bold text-sm border transition-colors ${liked ? "bg-foreground border-foreground text-background" : "bg-primary text-primary-foreground border-primary hover:bg-primary/80"}`}>
            <ThumbsUp className={`h-4 w-4 ${liked ? "fill-background" : ""}`} /> Me gusta
          </button>
          
          <button onClick={() => onOpenDetail(currentBook)} className="flex items-center gap-2 px-6 py-3 rounded-md font-bold text-sm bg-transparent text-foreground border border-primary hover:bg-primary/10 transition-colors">
            <Info className="h-4 w-4" /> Más información
          </button>
          
          <button onClick={goToNextBook} className="group/ni flex items-center gap-2 px-6 py-3 rounded-md font-bold text-sm bg-transparent text-muted-foreground border border-border hover:bg-background hover:border-background hover:text-foreground transition-colors">
            <ThumbsDown className="h-4 w-4 group-hover/ni:text-foreground transition-colors" /> No me interesa
          </button>
        </div>
      </div>

      {/* ── Bolitas Indicadoras Interactivas ── */}
      <div className="absolute bottom-6 left-6 md:left-12 flex items-center gap-2 z-40">
        {heroBooks.map((_, idx) => (
          <button 
            key={idx}
            onClick={() => goToIndex(idx)}
            aria-label={`Ir a la recomendación ${idx + 1}`}
            className={`h-2 rounded-full transition-all duration-500 ease-in-out cursor-pointer hover:bg-primary/80 ${
              idx === currentIndex ? "w-8 bg-primary shadow-[0_0_8px_rgba(203,153,126,0.6)]" : "w-2 bg-foreground/40"
            }`}
          />
        ))}
      </div>
    </section>
  )
}