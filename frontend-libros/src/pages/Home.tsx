import { useEffect, useState } from "react"
import { BookOpen } from "lucide-react"
import { Book } from "../types"
import Navbar from "../components/Navbar"
import HeroSection from "../components/HeroSection"
import CarouselRow from "../components/CarouselRow"

export default function Home() {
  const [libros, setLibros] = useState<Book[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const fetchLibros = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/libros")
        if (response.ok) {
          const data = await response.json()
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
        }
      } catch (error) {
        console.error("Error conectando al backend:", error)
      } finally {
        setCargando(false)
      }
    }
    fetchLibros()
  }, [])

  if (cargando) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
        <div className="flex items-center gap-3 animate-pulse">
          <BookOpen className="h-10 w-10 text-primary" strokeWidth={2.5} />
          <span className="text-3xl font-bold tracking-tight text-foreground select-none">
            Booky <span className="text-primary">Tuky</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.15s' }}></div>
          <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.3s' }}></div>
        </div>
        <p className="text-muted-foreground font-medium text-sm animate-pulse">
          Preparando tu biblioteca...
        </p>
      </div>
    )
  }

  if (libros.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center text-xl font-bold p-8 text-center">
        <p>Tu base de datos de Neo4j está vacía (0 libros).</p>
      </div>
    )
  }

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