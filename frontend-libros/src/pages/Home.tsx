import { useEffect, useState } from "react"
import { BookOpen } from "lucide-react"
import { Book } from "../types"
import Navbar from "../components/Navbar"
import HeroSection from "../components/HeroSection"
import CarouselRow from "../components/CarouselRow"
import BookDetail from "../components/BookDetail"

export default function Home() {
  const [libros, setLibros] = useState<Book[]>([])
  const [librosHero, setLibrosHero] = useState<Book[]>([])
  // NUEVO: Arreglo dinámico para guardar todos los carruseles que mande el backend
  const [netflixRows, setNetflixRows] = useState<{titulo: string, libros: Book[]}[]>([]) 
  const [cargando, setCargando] = useState(true)
  const [libroSeleccionado, setLibroSeleccionado] = useState<Book | null>(null)

  // Función auxiliar para formatear los libros que vienen de Neo4j al formato React
  const formatBook = (l: any): Book => ({
    id: l.id,
    titulo: l.titulo,
    autor: l.autor ? l.autor.nombre : "Autor Anónimo",
    sinopsis: l.sinopsis || "Sin sinopsis disponible.",
    genero: l.generos && l.generos.length > 0 ? l.generos[0].nombre : "General",
    estilo: l.estilo ? l.estilo.nombre : "Sin Estilo",
    tematica: l.tematicas ? l.tematicas.map((t: any) => t.nombre) : [],
    urlPortada: l.urlPortada || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400",
    año: 2026,
    matchPercentage: l.matchPercentage // Conservamos el porcentaje si el backend lo incluye
  })

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // 1. Cargar el catálogo general 
        const responseCat = await fetch("http://localhost:8080/api/libros")
        let librosCat: Book[] = []
        if (responseCat.ok) {
          const data = await responseCat.json()
          librosCat = data.map(formatBook)
          setLibros(librosCat)
        }

        const usuarioRaw = localStorage.getItem("usuario")
        if (usuarioRaw) {
          const usuario = JSON.parse(usuarioRaw)
          
          // 2. Cargar recomendaciones del Hero
          const resHero = await fetch(`http://localhost:8080/api/recomendaciones/hero/${usuario.id}`)
          if (resHero.ok) {
            const dataHero = await resHero.json()
            const heroFormat = dataHero.map((item: any) => {
              const b = formatBook(item.b)
              b.matchPercentage = item.score
              return b
            })
            setLibrosHero(heroFormat)
          } else {
            setLibrosHero(librosCat.slice(0, 5))
          }

          // 3. LA MAGIA: Cargar filas dinámicas estilo Netflix
          const resNetflix = await fetch(`http://localhost:8080/api/recomendaciones/netflix/${usuario.email}`)
          if (resNetflix.ok) {
            const dataNetflix = await resNetflix.json()
            // Formateamos cada carrusel
            const rowsFormat = dataNetflix.map((row: any) => ({
              titulo: row.titulo,
              libros: row.libros.map(formatBook)
            }))
            setNetflixRows(rowsFormat)
          }

        } else {
          setLibrosHero(librosCat.slice(0, 5))
        }

      } catch (error) {
        console.error("Error conectando al backend:", error)
      } finally {
        setCargando(false)
      }
    }
    
    fetchAllData()
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
      
      <HeroSection booksPool={librosHero.length > 0 ? librosHero : libros} onOpenDetail={setLibroSeleccionado} />
      
      <section className="pt-8 pb-20">
        
        {/* Generación Automática de Filas */}
        {netflixRows.map((row, idx) => (
          <CarouselRow 
            key={`netflix-${idx}`} 
            titulo={row.titulo} 
            books={row.libros} 
            onOpenDetail={setLibroSeleccionado} 
            dismissable={true} 
          />
        ))}

        {/* Fila de Respaldo: El Catálogo General Siempre al Final */}
        <CarouselRow 
          key="todos" 
          titulo="Explorar todo el catálogo" 
          books={libros} 
          onOpenDetail={setLibroSeleccionado} 
          dismissable={false} 
        />
      </section>
      
      <footer className="border-t border-border px-6 md:px-12 py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Booky Tuky
      </footer>

      {libroSeleccionado && (
        <BookDetail 
          book={libroSeleccionado} 
          onClose={() => setLibroSeleccionado(null)} 
        />
      )}
    </main>
  )
}