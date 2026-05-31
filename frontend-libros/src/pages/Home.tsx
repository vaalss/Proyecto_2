import { useEffect, useState } from "react"
import { BookOpen } from "lucide-react"
import { Book } from "../types"
import Navbar from "../components/Navbar"
import HeroSection from "../components/HeroSection"
import CarouselRow from "../components/CarouselRow"
import BookDetail from "../components/BookDetail"

export default function Home() {
  const [libros, setLibros] = useState<Book[]>([])
  const [cargando, setCargando] = useState(true)
  
  // 1. Creamos el estado para saber qué libro quiere ver el usuario
  const [libroSeleccionado, setLibroSeleccionado] = useState<Book | null>(null)

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
            estilo: l.estilo ? l.estilo.nombre : "Sin Estilo", // <--- LA SOLUCIÓN
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
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      
      {/* 2. Le pasamos la función setLibroSeleccionado a las secciones */}
      <HeroSection booksPool={libros} onOpenDetail={setLibroSeleccionado} />
      
      <section className="pt-8 pb-20">
        <CarouselRow key="todos" titulo="Todos los libros disponibles" books={libros} onOpenDetail={setLibroSeleccionado} dismissable={false} />
        <CarouselRow key="recomendaciones" titulo="Sugerencias del recomendador" books={libros.slice().reverse()} onOpenDetail={setLibroSeleccionado} dismissable={true} />
      </section>
      
      <footer className="border-t border-border px-6 md:px-12 py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Booky Tuky
      </footer>

      {/* 3. Si el usuario seleccionó un libro, dibujamos el modal de detalles */}
      {libroSeleccionado && (
        <BookDetail 
          book={libroSeleccionado} 
          onClose={() => setLibroSeleccionado(null)} 
        />
      )}
    </main>
  )
}