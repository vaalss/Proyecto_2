import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { BookOpen, Heart, Star, Settings, Bookmark, ShieldAlert, Edit2 } from "lucide-react"
import Navbar from "../components/Navbar"

export default function MiCuenta() {
  const [usuario, setUsuario] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<"listas" | "preferencias" | "configuracion">("listas")
  const navigate = useNavigate()

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario")
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado))
    } else {
      // Si no hay sesión, lo mandamos al login
      navigate("/")
    }
  }, [navigate])

  if (!usuario) return null

  // Iniciales para el Avatar
  const iniciales = usuario.nombre 
    ? usuario.nombre.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase() 
    : "U"

  return (
    <main className="min-h-screen bg-background text-foreground pb-20">
      <Navbar />

      <div className="pt-28 px-6 md:px-12 max-w-6xl mx-auto space-y-8">
        
        {/* ─── HEADER DEL PERFIL ─── */}
        <section className="relative overflow-hidden rounded-3xl bg-card border border-border shadow-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-50 pointer-events-none" />
          
          <div className="relative shrink-0">
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-primary to-orange-400 p-1 shadow-xl group-hover:scale-105 transition-transform duration-500">
              <div className="w-full h-full bg-card rounded-full flex items-center justify-center text-4xl font-black text-primary">
                {iniciales}
              </div>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left z-10">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">{usuario.nombre}</h1>
            <p className="text-lg text-muted-foreground mb-4">{usuario.email}</p>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20">
              <Star size={14} className="fill-primary" /> Miembro desde 2026
            </span>
          </div>
          
          <button className="z-10 flex items-center gap-2 px-6 py-3 bg-background border border-border hover:border-primary/50 hover:bg-secondary transition-all rounded-xl font-semibold text-sm shadow-sm">
            <Edit2 size={16} /> Editar Perfil
          </button>
        </section>

        {/* ─── DASHBOARD DE ESTADÍSTICAS ─── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-2xl p-6 flex items-center gap-5 shadow-lg hover:border-primary/30 transition-colors">
            <div className="p-4 bg-blue-500/10 text-blue-500 rounded-xl"><BookOpen size={28} /></div>
            <div>
              <p className="text-3xl font-black leading-none">14</p>
              <p className="text-sm font-medium text-muted-foreground mt-1">Libros Leídos</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 flex items-center gap-5 shadow-lg hover:border-primary/30 transition-colors">
            <div className="p-4 bg-red-500/10 text-red-500 rounded-xl"><Heart size={28} /></div>
            <div>
              <p className="text-3xl font-black leading-none">8</p>
              <p className="text-sm font-medium text-muted-foreground mt-1">En Favoritos</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 flex items-center gap-5 shadow-lg hover:border-primary/30 transition-colors">
            <div className="p-4 bg-yellow-500/10 text-yellow-500 rounded-xl"><Star size={28} /></div>
            <div>
              <p className="text-3xl font-black leading-none">85%</p>
              <p className="text-sm font-medium text-muted-foreground mt-1">Afinidad Promedio</p>
            </div>
          </div>
        </section>

        {/* ─── CONTENIDO PRINCIPAL (SISTEMA DE PESTAÑAS) ─── */}
        <section className="bg-card border border-border rounded-3xl shadow-xl overflow-hidden min-h-[400px]">
          
          {/* Navegación de Pestañas */}
          <div className="flex overflow-x-auto border-b border-border bg-background/50 backdrop-blur-md px-6 hide-scrollbar">
            <button onClick={() => setActiveTab("listas")} className={`flex items-center gap-2 px-6 py-5 font-bold text-sm whitespace-nowrap transition-colors border-b-2 ${activeTab === "listas" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              <Bookmark size={18} /> Mis Listas
            </button>
            <button onClick={() => setActiveTab("preferencias")} className={`flex items-center gap-2 px-6 py-5 font-bold text-sm whitespace-nowrap transition-colors border-b-2 ${activeTab === "preferencias" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              <Star size={18} /> Preferencias
            </button>
            <button onClick={() => setActiveTab("configuracion")} className={`flex items-center gap-2 px-6 py-5 font-bold text-sm whitespace-nowrap transition-colors border-b-2 ${activeTab === "configuracion" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              <Settings size={18} /> Configuración
            </button>
          </div>

          {/* Contenido Dinámico */}
          <div className="p-8 md:p-10">
            
            {/* PESTAÑA 1: LISTAS */}
            {activeTab === "listas" && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Heart className="text-red-500" size={20}/> Favoritos</h3>
                  <div className="p-12 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-center">
                    <BookOpen size={40} className="text-muted-foreground mb-4 opacity-50" />
                    <p className="font-semibold">Aún no hay libros cargados aquí.</p>
                    <p className="text-sm text-muted-foreground">Explora el catálogo y añade tus favoritos.</p>
                  </div>
                </div>
              </div>
            )}

            {/* PESTAÑA 2: PREFERENCIAS */}
            {activeTab === "preferencias" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
                <h3 className="text-xl font-bold mb-6">Tus Géneros Favoritos</h3>
                <div className="flex flex-wrap gap-3">
                  {["Ciencia Ficción", "Fantasía Epica", "Ciberseguridad", "Misterio", "Desarrollo Personal", "Clásicos"].map(tag => (
                    <button key={tag} className="px-5 py-2.5 rounded-full bg-secondary border border-border text-sm font-semibold hover:border-primary hover:text-primary transition-colors">
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* PESTAÑA 3: CONFIGURACIÓN */}
            {activeTab === "configuracion" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl space-y-8">
                
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Datos de la Cuenta</h3>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Nombre completo</label>
                    <input type="text" defaultValue={usuario.nombre} className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:border-primary outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Correo electrónico</label>
                    <input type="email" disabled defaultValue={usuario.email} className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 text-sm text-muted-foreground cursor-not-allowed" />
                  </div>
                  <button className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors">Guardar Cambios</button>
                </div>

                <div className="h-px bg-border my-8" />

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-red-500 flex items-center gap-2"><ShieldAlert size={20} /> Zona de Peligro</h3>
                  <p className="text-sm text-muted-foreground">Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, asegúrate.</p>
                  <button className="px-6 py-3 bg-red-500/10 text-red-500 border border-red-500/20 font-bold rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                    Eliminar mi cuenta
                  </button>
                </div>

              </div>
            )}

          </div>
        </section>

      </div>
    </main>
  )
}