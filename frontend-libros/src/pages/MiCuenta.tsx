import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { BookOpen, BookCheck, Heart, Star, Save, KeyRound, Trash2, AlertTriangle } from "lucide-react"
import Navbar from "../components/Navbar"

type Tab = "listas" | "preferencias" | "configuracion"

const tabs: { id: Tab; label: string }[] = [
  { id: "listas", label: "Mis Listas" },
  { id: "preferencias", label: "Preferencias" },
  { id: "configuracion", label: "Configuración" },
]

const allGenres = [
  "Ciencia Ficción", "Fantasía", "Thriller", "Misterio",
  "Historia", "Biografías", "Filosofía", "Tecnología", "Aventura",
  "Romance", "Terror", "Economía", "Psicología", "Clásicos", "Ensayo",
]

// ─── SUB-COMPONENTES ────────────────────────────────────────────────────────

function ProfileHeader({ usuario }: { usuario: any }) {
  const iniciales = usuario?.nombre
    ? usuario.nombre.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()
    : "U"

  return (
    <div className="flex flex-col items-center gap-4 py-10 px-6 text-center">
      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="text-primary w-5 h-5" />
        <span className="text-sm font-semibold tracking-widest uppercase text-primary">Booky Tuky</span>
      </div>
      <div className="relative">
        <div className="w-28 h-28 rounded-full flex items-center justify-center text-3xl font-bold bg-card border-4 border-primary/20 text-foreground shadow-[0_0_30px_rgba(203,153,126,0.35)]">
          {iniciales}
        </div>
        <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-primary border-2 border-background" />
      </div>
      <div className="flex flex-col items-center gap-1">
        <h1 className="text-4xl font-bold tracking-tight text-foreground text-balance">{usuario?.nombre || "Cargando..."}</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">{usuario?.email || ""}</p>
        <span className="mt-2 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold bg-primary/10 text-primary border border-primary/30">
          ✦ Miembro desde 2026
        </span>
      </div>
    </div>
  )
}

function StatsDashboard({ perfil }: { perfil: any }) {
  const stats = [
    { label: "Libros Leídos", value: perfil?.totalLeidos || "0", icon: BookCheck, suffix: "" },
    { label: "Favoritos", value: perfil?.totalFavoritos || "0", icon: Heart, suffix: "" },
    { label: "Afinidad Promedio", value: perfil?.afinidadPromedio || "0", icon: Star, suffix: "%" },
  ]

  return (
    <div className="grid grid-cols-3 gap-3 px-4 md:px-8 max-w-3xl mx-auto w-full">
      {stats.map(({ label, value, icon: Icon, suffix }) => (
        <div key={label} className="relative flex flex-col items-center gap-2 rounded-xl bg-card border border-border p-4 md:p-6 shadow-md transition-all duration-200 hover:border-primary/50 hover:-translate-y-1">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <span className="text-2xl md:text-3xl font-bold text-foreground">
            {value}<span className="text-lg text-primary">{suffix}</span>
          </span>
          <span className="text-xs text-muted-foreground text-center leading-relaxed">{label}</span>
        </div>
      ))}
    </div>
  )
}

function BookGrid({ books, fallbackText }: { books: any[], fallbackText: string }) {
  if (!books || books.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-border rounded-xl bg-background/50">
        <p className="text-sm text-muted-foreground">{fallbackText}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {books.map((book) => (
        <div key={book.id || book.titulo} className="group flex flex-col gap-2 cursor-pointer">
          <div className="relative overflow-hidden rounded-lg aspect-[2/3] border border-border">
            <img src={book.urlPortada || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400"} alt={book.titulo} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
          </div>
          <span className="text-xs text-center font-medium text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed line-clamp-2">
            {book.titulo}
          </span>
        </div>
      ))}
    </div>
  )
}

function TabMisListas({ favoritos, leidos }: { favoritos: any[], leidos: any[] }) {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-primary">Libros Favoritos</h3>
        <BookGrid books={favoritos} fallbackText="Aún no has agregado libros a tus favoritos." />
      </div>
      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-primary">Historial de Lectura</h3>
        <BookGrid books={leidos} fallbackText="Tu historial de lectura está vacío." />
      </div>
    </div>
  )
}

function TabPreferencias({ usuario }: { usuario: any }) {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (usuario) {
      fetch(`http://localhost:8080/api/usuarios/${usuario.id}/preferencias`)
        .then(res => res.json())
        .then(data => setSelected(new Set(data)))
        .catch(err => console.error("Error cargando preferencias:", err))
    }
  }, [usuario])

  function toggle(genre: string) {
    const isAdding = !selected.has(genre)
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(genre) ? next.delete(genre) : next.add(genre)
      return next
    })

    const method = isAdding ? "POST" : "DELETE"
    fetch(`http://localhost:8080/api/usuarios/${usuario.id}/preferencias/${encodeURIComponent(genre)}`, { method })
      .catch(err => console.error("Error al actualizar preferencia:", err))
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest mb-1 text-primary">Géneros literarios preferidos</h3>
        <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
          Selecciona los géneros que más disfrutas. Estos alterarán directamente el algoritmo de tus recomendaciones en la pantalla principal.
        </p>
        <div className="flex flex-wrap gap-3">
          {allGenres.map((genre) => {
            const active = selected.has(genre)
            return (
              <button
                key={genre}
                onClick={() => toggle(genre)}
                className={`rounded-full px-5 py-2 text-sm font-bold border transition-all duration-200 ${
                  active
                    ? "bg-primary/20 border-primary text-primary shadow-[0_0_10px_rgba(203,153,126,0.2)]"
                    : "bg-background border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {active && <span className="mr-1">✦</span>} {genre}
              </button>
            )
          })}
        </div>
      </div>
      <div className="rounded-xl border border-border bg-background/50 p-4 mt-4">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="font-bold text-primary">{selected.size} géneros seleccionados.</span> Tu feed se actualiza automáticamente con base en tus preferencias.
        </p>
      </div>
    </div>
  )
}

function TabConfiguracion({ usuario }: { usuario: any }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [saved, setSaved] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  useEffect(() => {
    if (usuario) {
      setName(usuario.nombre || "")
      setEmail(usuario.email || "")
    }
  }, [usuario])

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="flex flex-col gap-8 max-w-xl">
      <form onSubmit={handleSave} className="flex flex-col gap-5">
        <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Editar Perfil</h3>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-muted-foreground font-bold">Nombre completo</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:border-primary outline-none transition-colors" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-muted-foreground font-bold">Correo electrónico</label>
          <input type="email" value={email} disabled className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 text-sm opacity-60 cursor-not-allowed" />
        </div>
        <button type="submit" className="flex items-center justify-center gap-2 w-full sm:w-auto sm:self-start rounded-lg px-6 py-3 text-sm font-bold bg-primary text-white hover:bg-primary/90 transition-colors">
          <Save className="w-4 h-4" /> {saved ? "¡Guardado!" : "Guardar cambios"}
        </button>
      </form>

      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-red-500">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="text-sm font-bold uppercase tracking-widest">Zona de peligro</h3>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">Esta acción es permanente. Se eliminarán todos tus datos, favoritos e historial de lectura.</p>
        {!deleteConfirm ? (
          <button onClick={() => setDeleteConfirm(true)} className="flex items-center gap-2 self-start rounded-lg border border-red-500/30 bg-transparent text-red-500 px-5 py-2.5 text-sm font-bold hover:bg-red-500 hover:text-white transition-colors">
            <Trash2 className="w-4 h-4" /> Eliminar mi cuenta
          </button>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold text-red-500">¿Estás seguro? Esta acción no se puede deshacer.</p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteConfirm(false)} className="rounded-lg border border-border bg-background px-5 py-2 text-xs font-bold hover:bg-secondary transition-colors">Cancelar</button>
              <button className="rounded-lg bg-red-500 text-white px-5 py-2 text-xs font-bold hover:bg-red-600 transition-colors">Sí, eliminar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────────

export default function MiCuenta() {
  const [activeTab, setActiveTab] = useState<Tab>("listas")
  const [usuario, setUsuario] = useState<any>(null)
  const [perfil, setPerfil] = useState({
    favoritos: [], leidos: [], totalFavoritos: 0, totalLeidos: 0, afinidadPromedio: 0
  })
  const navigate = useNavigate()

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario")
    if (usuarioGuardado) {
      const userObj = JSON.parse(usuarioGuardado)
      setUsuario(userObj)
      fetch(`http://localhost:8080/api/usuarios/${userObj.id}/perfil`)
        .then(res => res.json())
        .then(data => setPerfil(data))
        .catch(err => console.error("Error al cargar perfil:", err))
    } else {
      navigate("/")
    }
  }, [navigate])

  if (!usuario) return null

  return (
    <main className="min-h-screen w-full font-sans bg-background pb-20">
      <Navbar />
      
      {/* Luz ambiente central sutil */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-10 blur-3xl rounded-full bg-primary" />

      <div className="relative max-w-4xl mx-auto px-4 pt-28">
        <ProfileHeader usuario={usuario} />
        <StatsDashboard perfil={perfil} />

        {/* Tab Navigation */}
        <div className="mt-10 mb-6 flex overflow-x-auto hide-scrollbar bg-card/50 backdrop-blur-md p-1.5 rounded-xl border border-border">
          {tabs.map((tab) => {
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 sm:flex-none rounded-lg px-6 py-2.5 text-sm font-bold transition-all duration-200 ${
                  active ? "bg-primary/10 text-primary shadow-sm" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-md p-6 md:p-8 shadow-xl">
          {activeTab === "listas" && <TabMisListas favoritos={perfil.favoritos} leidos={perfil.leidos} />}
          {activeTab === "preferencias" && <TabPreferencias usuario={usuario} />}
          {activeTab === "configuracion" && <TabConfiguracion usuario={usuario} />}
        </div>
      </div>
    </main>
  )
}