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
  const [netflixRows, setNetflixRows] = useState<{titulo: string, libros: Book[]}[]>([]) 
  const [cargando, setCargando] = useState(true)
  const [libroSeleccionado, setLibroSeleccionado] = useState<Book | null>(null)

  const formatBook = (l: any): Book => ({
    id: l.id,
    titulo: l.titulo,
    autor: l.autor ? l.autor.nombre : "Autor Anónimo",
    sinopsis: l.sinopsis || "Sin sinopsis disponible.",
    genero: l.generos && l.generos.length > 0 ? l.generos[0].nombre : "General",
    estilo: l.estilo ? l.estilo.nombre : "Sin Estilo",
    tematica: l.tematicas ? l.tematicas.map((t: any) => t.nombre) : [],
    urlPortada: l.urlPortada || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400",
    año: l.año || 2026,
    matchPercentage: l.matchPercentage 
  })

  const shuffleArray = (array: any[]) => {
    return [...array].sort(() => Math.random() - 0.5)
  }

  useEffect(() => {
    const fetchAllData = async () => {
      try {
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
          
          const resHero = await fetch(`http://localhost:8080/api/recomendaciones/hero/${usuario.id}`)
          if (resHero.ok) {
            const dataHero = await resHero.json()
            const heroFormat = dataHero.map((item: any) => {
              const b = formatBook(item.b)
              b.matchPercentage = item.score
              return b
            })
            setLibrosHero(shuffleArray(heroFormat).slice(0, 5))
          } else {
            setLibrosHero(shuffleArray(librosCat).slice(0, 5))
          }

          // Cargar carruseles del backend (Sugerencias y Favoritos)
          const resNetflix = await fetch(`http://localhost:8080/api/recomendaciones/netflix/${usuario.email}`)
          let backendRows: { titulo: string; libros: Book[] }[] = []
          if (resNetflix.ok) {
            const dataNetflix = await resNetflix.json()
            backendRows = dataNetflix.map((row: any) => ({
              titulo: row.titulo,
              libros: row.libros.map(formatBook)
            }))
          }

          // Generar carruseles temáticos extras dinámicamente
          const generosPopulares = ["Ciencia Ficción", "Fantasía", "Misterio", "Clásicos", "Romance"]
          const genreRows = generosPopulares.map(genero => {
            const filtrados = librosCat.filter(l => l.genero === genero || l.tematica.includes(genero))
            return {
              titulo: `Explora: ${genero}`,
              libros: shuffleArray(filtrados).slice(0, 10)
            }
          }).filter(row => row.libros.length >= 4) 

          setNetflixRows([...backendRows, ...genreRows])

        } else {
          setLibrosHero(shuffleArray(librosCat).slice(0, 5))
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
        {netflixRows.map((row, idx) => (
          <CarouselRow 
            key={`netflix-${idx}`} 
            titulo={row.titulo} 
            books={row.libros} 
            onOpenDetail={setLibroSeleccionado} 
            dismissable={true} 
          />
        ))}

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