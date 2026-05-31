import { useState } from "react"
import { ThumbsUp, ThumbsDown, Info } from "lucide-react"
import { Book } from "../types"

export default function HeroSection({ booksPool }: { booksPool: Book[] }) {
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
      <div className="absolute inset-0 bg-cover bg-center scale-105" style={{ backgroundImage: `url(${currentBook.urlPortada})` }} />
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

      <div className="relative z-10 px-6 md:px-12 pb-16 max-w-2xl transition-all duration-450 ease-in-out" style={{ opacity: exiting ? 0 : entering ? 0 : 1, transform: exiting ? "translateX(80px)" : entering ? "translateX(-40px)" : "translateX(0)", transition: "all 450ms ease-in-out" }}>
        <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-3">Recomendado para ti</p>
        <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight text-balance mb-3">{currentBook.titulo}</h1>
        <p className="text-sm text-muted-foreground mb-1">{currentBook.autor} · {currentBook.año} · {currentBook.genero}</p>
        <p className="text-sm md:text-base text-foreground/80 leading-relaxed mb-6 line-clamp-3">{currentBook.sinopsis}</p>
        <div className="flex items-center gap-3 flex-wrap">
          <button onClick={() => setLiked((v) => !v)} className={`flex items-center gap-2 px-6 py-3 rounded-md font-bold text-sm border transition-colors ${liked ? "bg-foreground border-foreground text-background" : "bg-primary text-primary-foreground border-primary hover:bg-primary/80"}`}>
            <ThumbsUp className={`h-4 w-4 ${liked ? "fill-background" : ""}`} /> Me gusta
          </button>
          <button className="flex items-center gap-2 px-6 py-3 rounded-md font-bold text-sm bg-transparent text-foreground border border-primary hover:bg-primary/10 transition-colors">
            <Info className="h-4 w-4" /> Más información
          </button>
          <button onClick={handleNotInterested} className="group/ni flex items-center gap-2 px-6 py-3 rounded-md font-bold text-sm bg-transparent text-muted-foreground border border-border hover:bg-background hover:border-background hover:text-foreground transition-colors">
            <ThumbsDown className="h-4 w-4 group-hover/ni:text-foreground transition-colors" /> No me interesa
          </button>
        </div>
      </div>
    </section>
  )
}