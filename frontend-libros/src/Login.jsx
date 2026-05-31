import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen } from 'lucide-react'

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
  .animate-marquee-left:hover, .animate-marquee-right:hover {
    animation-play-state: paused;
  }
`

// ─── URLs de portadas de prueba (Unsplash) ────────────────────────────────────
const coversRow1 = [
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400",
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400",
  "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=400",
  "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=400",
  "https://images.unsplash.com/photo-1526485856375-9110812fbf35?q=80&w=400",
]
const coversRow2 = [
  "https://images.unsplash.com/photo-1495640388908-05fa85288e61?q=80&w=400",
  "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=400",
  "https://images.unsplash.com/photo-1476275466078-4007374efac4?q=80&w=400",
  "https://images.unsplash.com/photo-1589998059171-989d887df446?q=80&w=400",
  "https://images.unsplash.com/photo-1519682337058-a94d519337bc?q=80&w=400",
]
const coversRow3 = [
  "https://images.unsplash.com/photo-1531901599143-df5010ab9438?q=80&w=400",
  "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=400",
  "https://images.unsplash.com/photo-1524578971030-a359483863ce?q=80&w=400",
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=400",
  "https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=400",
]

// ─── Componente Fila del Carrusel ─────────────────────────────────────────────
function MarqueeRow({ images, direction = "left" }: { images: string[], direction?: "left" | "right" }) {
  // Duplicamos el array para que el scroll infinito sea continuo sin cortes
  const duplicatedImages = [...images, ...images, ...images, ...images]
  
  return (
    <div className="overflow-hidden w-full h-48 md:h-64 mb-4 opacity-40">
      <div className={direction === "left" ? "animate-marquee-left" : "animate-marquee-right"}>
        {duplicatedImages.map((src, index) => (
          <div key={index} className="w-32 md:w-44 shrink-0 mx-2 overflow-hidden rounded-md shadow-lg">
            <img src={src} alt="Cover" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Componente Principal ─────────────────────────────────────────────────────
export default function Login() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleLogin() {
    setError('')
    try {
      const response = await fetch('http://localhost:8080/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      
      if (response.ok) {
        const usuarioData = await response.json()
        localStorage.setItem('usuario', JSON.stringify(usuarioData))
        navigate('/home')
      } else {
        setError('El correo no está registrado')
      }
    } catch {
      setError('No se pudo conectar con el servidor')
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background flex items-center justify-center">
      {/* 1. Inyectamos la magia CSS para las animaciones */}
      <style>{marqueeStyles}</style>

      {/* 2. El fondo animado (3 filas, alternando direcciones) */}
      <div className="absolute inset-0 z-0 flex flex-col justify-center -rotate-6 scale-110 pointer-events-none">
        <MarqueeRow images={coversRow1} direction="left" />
        <MarqueeRow images={coversRow2} direction="right" />
        <MarqueeRow images={coversRow3} direction="left" />
      </div>

      {/* 3. Una capa para oscurecer/teñir sutilmente el fondo y que el form resalte */}
      <div className="absolute inset-0 bg-background/50 z-10" aria-hidden="true" />

      {/* 4. La Tarjeta Central de Login (Efecto Glassmorphism) */}
      <div className="relative z-20 w-full max-w-sm mx-6 p-8 rounded-2xl bg-card/80 backdrop-blur-md border border-border shadow-2xl">
        <div className="flex flex-col items-center justify-center mb-6 gap-2">
          <BookOpen className="h-10 w-10 text-primary" strokeWidth={2.5} />
          <h1 className="text-3xl font-bold tracking-tight text-foreground select-none">
            Booky <span className="text-primary">Tuky</span>
          </h1>
          <h2 className="text-sm text-muted-foreground font-medium">
            Inicio de sesión
          </h2>
        </div>

        <div className="mb-6">
          <label className="block text-foreground text-sm font-semibold mb-2" htmlFor="email">
            Correo Electrónico
          </label>
          <input
            id="email"
            type="email"
            placeholder="ejemplo@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full px-4 py-3 rounded-lg bg-background/50 text-foreground placeholder:text-muted-foreground/70 outline-none border border-border focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all shadow-inner"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm font-semibold text-center mb-4 bg-red-100/50 py-2 rounded-md">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleLogin}
          className="w-full py-3 rounded-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98]"
        >
          Ingresar
        </button>
      </div>
    </main>
  )
}