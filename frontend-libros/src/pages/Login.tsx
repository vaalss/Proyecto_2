import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { BookOpen } from "lucide-react"

// ─── Animaciones CSS para el Marquee ──────────────────────────────────────────
const marqueeStyles = `
  @keyframes marquee-left {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes marquee-right {
    0% { transform: translateX(-50%); }
    100% { transform: translateX(0); }
  }
  .animate-marquee-left {
    display: flex;
    width: 200%;
    animation: marquee-left 40s linear infinite;
  }
  .animate-marquee-right {
    display: flex;
    width: 200%;
    animation: marquee-right 40s linear infinite;
  }
`

// ─── Portadas de Respaldo (Por si la DB está apagada o vacía) ────────────────
const FALLBACK_COVERS = [
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=280&fit=crop",
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=280&fit=crop",
  "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=200&h=280&fit=crop",
  "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=200&h=280&fit=crop",
  "https://images.unsplash.com/photo-1476275466078-4cad320172cf?w=200&h=280&fit=crop",
  "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=200&h=280&fit=crop",
  "https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=200&h=280&fit=crop",
  "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=200&h=280&fit=crop",
]

// ─── Componente de Fila Animada ───────────────────────────────────────────────
function MarqueeRow({ covers, direction, duration }: { covers: string[], direction: "left" | "right", duration: string }) {
  // Duplicamos el array para el loop infinito
  const doubled = [...covers, ...covers, ...covers]

  const animationName = direction === "left" ? "marquee-left" : "marquee-right"

  return (
    <div className="flex overflow-hidden w-full mb-4 opacity-90">
      <div
        className={direction === "left" ? "animate-marquee-left" : "animate-marquee-right"}
        style={{ animationDuration: duration }}
      >
        {doubled.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            aria-hidden="true"
            className="h-40 w-28 md:h-56 md:w-36 mx-2 rounded-lg object-cover shrink-0 shadow-md"
            onError={(e) => {
              // Si la imagen falla en cargar, ponemos una por defecto
              (e.target as HTMLImageElement).src = FALLBACK_COVERS[0];
            }}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Pantalla Principal de Login ──────────────────────────────────────────────
export default function Login() {
  const [email, setEmail] = useState("")
  const [nombre, setNombre] = useState("")
  const [error, setError] = useState("")
  const [esRegistro, setEsRegistro] = useState(false)
  const [portadas, setPortadas] = useState<string[]>(FALLBACK_COVERS)
  const navigate = useNavigate()

  // 1. Fetch para traer las portadas de la DB al cargar la pantalla
  useEffect(() => {
    const fetchCovers = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/libros")
        if (response.ok) {
          const data = await response.json()
          
          if (data.length > 0) {
            // Extraemos solo las URLs. Si el libro no tiene URL, usamos una de relleno aleatoria.
            let extractedUrls = data.map((libro: any) => 
              libro.urlPortada ? libro.urlPortada : FALLBACK_COVERS[Math.floor(Math.random() * FALLBACK_COVERS.length)]
            )

            // Si hay muy pocos libros (ej. solo 2), el carrusel se vería vacío. 
            // Multiplicamos la lista hasta tener al menos 12 imágenes.
            while (extractedUrls.length < 12) {
              extractedUrls = [...extractedUrls, ...extractedUrls]
            }

            setPortadas(extractedUrls)
          }
        }
      } catch (error) {
        console.error("Error cargando portadas para el fondo, usando respaldo:", error)
      }
    }
    fetchCovers()
  }, [])

  // Dividimos la lista de portadas en 3 pedazos (uno para cada fila del carrusel)
  const third = Math.floor(portadas.length / 3)
  const row1 = portadas.slice(0, third)
  const row2 = portadas.slice(third, third * 2)
  const row3 = portadas.slice(third * 2)

  // 2. Fetch para Login o Registro de usuario
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (esRegistro) {
      if (!nombre || !email) return
      try {
        const response = await fetch("http://localhost:8080/api/usuarios/registro", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, email })
        })
        if (response.ok) {
          const usuarioData = await response.json()
          localStorage.setItem("usuario", JSON.stringify(usuarioData))
          navigate("/home")
        } else if (response.status === 400) {
          setError("El correo ya está registrado")
        } else {
          setError("Error al crear la cuenta")
        }
      } catch {
        setError("No se pudo conectar con el servidor")
      }
    } else {
      if (!email) return
      try {
        const response = await fetch("http://localhost:8080/api/usuarios/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        })
        if (response.ok) {
          const usuarioData = await response.json()
          localStorage.setItem("usuario", JSON.stringify(usuarioData))
          navigate("/home")
        } else {
          setError("El correo no está registrado")
        }
      } catch {
        setError("No se pudo conectar con el servidor")
      }
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background flex items-center justify-center">
      <style>{marqueeStyles}</style>

      {/* Fondo animado dinámico conectado a la DB */}
      <div className="absolute inset-0 flex flex-col justify-center -rotate-[4deg] scale-110 pointer-events-none select-none overflow-hidden">
        <MarqueeRow covers={row1} direction="left" duration="45s" />
        <MarqueeRow covers={row2} direction="right" duration="55s" />
        <MarqueeRow covers={row3} direction="left" duration="50s" />
      </div>

      <div className="absolute inset-0 bg-foreground/10" aria-hidden="true" />

      {/* Tarjeta de Login */}
      <div className="relative z-10 w-full max-w-sm mx-4">
        <div className="rounded-2xl border border-border/40 bg-card/85 backdrop-blur-xl shadow-2xl p-8 flex flex-col gap-6">
          
          <div className="flex flex-col items-center justify-center gap-2 mb-4">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="h-10 w-10 text-primary" strokeWidth={2.5} />
              <span className="text-3xl font-bold tracking-tight text-foreground select-none">
                Booky <span className="text-primary">Tuky</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground font-medium text-balance">
              {esRegistro ? "Crear cuenta" : "Inicio de sesión"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            {esRegistro && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="nombre" className="text-sm font-medium text-foreground">
                  Nombre
                </label>
                <input
                  id="nombre"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Tu nombre"
                  required
                  autoComplete="name"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/60 transition-shadow"
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@ejemplo.com"
                required
                autoComplete="email"
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/60 transition-shadow"
              />
            </div>

            {error && (
              <p className="text-red-600 font-semibold text-sm text-center bg-red-100/50 py-1.5 rounded-md">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-[0.98] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/60"
            >
              {esRegistro ? "Registrarse" : "Ingresar"}
            </button>

            <button
              type="button"
              onClick={() => { setEsRegistro(!esRegistro); setError(""); setNombre(""); setEmail("") }}
              className="text-sm text-foreground hover:underline text-center w-full"
            >
              {esRegistro ? "Ya tengo cuenta, iniciar sesión" : "¿No tienes cuenta? Crea una aquí"}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}