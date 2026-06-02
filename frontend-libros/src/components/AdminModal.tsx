import { useState, useEffect } from "react"
import { X, Plus, Trash2, Book as BookIcon } from "lucide-react"
import { Book } from "../types"

export default function AdminModal({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<"agregar" | "eliminar">("agregar")
  const [libros, setLibros] = useState<Book[]>([])
  
  // Estado para el formulario
  const [formData, setFormData] = useState({ titulo: "", autor: "", genero: "", sinopsis: "", año: "", urlPortada: "" })

  // Cargar libros para la pestaña de eliminar
  useEffect(() => {
    if (tab === "eliminar") {
      fetch("http://localhost:8080/api/libros")
        .then(res => res.json())
        .then(data => setLibros(data))
        .catch(err => console.error(err))
    }
  }, [tab])

  const handleAgregar = async (e: React.FormEvent) => {
    e.preventDefault()
    // Armamos el objeto como lo espera tu backend (con las relaciones básicas)
    const payload = {
      titulo: formData.titulo,
      sinopsis: formData.sinopsis,
      año: parseInt(formData.año) || 2026,
      urlPortada: formData.urlPortada,
      autor: { nombre: formData.autor },
      generos: [{ nombre: formData.genero }]
    }

    try {
      const res = await fetch("http://localhost:8080/api/libros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        alert("¡Libro agregado con éxito!")
        setFormData({ titulo: "", autor: "", genero: "", sinopsis: "", año: "", urlPortada: "" })
      }
    } catch (error) {
      alert("Error al agregar el libro.")
    }
  }

  const handleEliminar = async (id: number | string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este libro de la base de datos?")) return

    try {
      const res = await fetch(`http://localhost:8080/api/libros/${id}`, { method: "DELETE" })
      if (res.ok) {
        setLibros(libros.filter(l => l.id !== id))
      }
    } catch (error) {
      alert("Error al eliminar.")
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Cabecera */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-background">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BookIcon className="text-primary" /> Administrar Catálogo
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors"><X size={20} /></button>
        </div>

        {/* Pestañas */}
        <div className="flex border-b border-border bg-background/50">
          <button onClick={() => setTab("agregar")} className={`flex-1 py-3 font-semibold text-sm transition-colors ${tab === "agregar" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"}`}>
            Agregar Libro
          </button>
          <button onClick={() => setTab("eliminar")} className={`flex-1 py-3 font-semibold text-sm transition-colors ${tab === "eliminar" ? "border-b-2 border-red-500 text-red-500" : "text-muted-foreground hover:text-foreground"}`}>
            Eliminar Libro
          </button>
        </div>

        {/* Contenido (Scrollable) */}
        <div className="p-6 overflow-y-auto bg-card">
          {tab === "agregar" ? (
            <form onSubmit={handleAgregar} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-bold text-muted-foreground mb-1 block">Título</label><input required className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm" value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} /></div>
                <div><label className="text-xs font-bold text-muted-foreground mb-1 block">Autor</label><input required className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm" value={formData.autor} onChange={e => setFormData({...formData, autor: e.target.value})} /></div>
                <div><label className="text-xs font-bold text-muted-foreground mb-1 block">Género</label><input required className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm" value={formData.genero} onChange={e => setFormData({...formData, genero: e.target.value})} /></div>
                <div><label className="text-xs font-bold text-muted-foreground mb-1 block">Año</label><input type="number" required className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm" value={formData.año} onChange={e => setFormData({...formData, año: e.target.value})} /></div>
              </div>
              <div><label className="text-xs font-bold text-muted-foreground mb-1 block">URL de la Portada (Imagen)</label><input required placeholder="https://..." className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm" value={formData.urlPortada} onChange={e => setFormData({...formData, urlPortada: e.target.value})} /></div>
              <div><label className="text-xs font-bold text-muted-foreground mb-1 block">Sinopsis</label><textarea required rows={4} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm resize-none" value={formData.sinopsis} onChange={e => setFormData({...formData, sinopsis: e.target.value})} /></div>
              <button type="submit" className="mt-2 w-full bg-primary text-white font-bold py-3 rounded-md hover:bg-primary/90 flex items-center justify-center gap-2"><Plus size={18}/> Guardar en Base de Datos</button>
            </form>
          ) : (
            <div className="flex flex-col gap-3">
              {libros.map(l => (
                <div key={l.id} className="flex items-center justify-between bg-background border border-border p-3 rounded-lg">
                  <div>
                    <p className="font-bold text-sm">{l.titulo}</p>
                    <p className="text-xs text-muted-foreground">{l.autor || "Autor Anónimo"}</p>
                  </div>
                  <button onClick={() => handleEliminar(l.id)} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-md transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              {libros.length === 0 && <p className="text-center text-muted-foreground py-8">Cargando catálogo...</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}