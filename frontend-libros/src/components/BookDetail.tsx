import { useState, useEffect, useCallback, useRef } from "react";
import {
  X,
  CheckCircle,
  Heart,
  Star,
  ThumbsDown,
} from "lucide-react";
import { Book } from "../types";

interface BookDetailProps {
  book: Book;
  onClose: () => void;
}

// ─── Componentes de UI optimizados ──────────────────────────────────────────

const MatchSkeleton = () => (
  <span
    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-primary/10 bg-primary/10 animate-pulse"
    style={{ width: "9rem", height: "1.75rem" }}
  >
    <span className="block h-2.5 w-full rounded bg-primary/20" />
  </span>
);

const MatchBadge = ({ pct }: { pct: number }) => (
  <span
    className="inline-flex items-center gap-1.5 font-bold text-primary bg-primary/15 px-3 py-1 rounded-md border border-primary/20 text-sm"
    style={{ minWidth: "9rem", height: "1.75rem" }}
  >
    <Star size={13} className="fill-primary shrink-0" />
    {pct}% coincidencia
  </span>
);

// Libros estáticos recuperados para la interfaz visual
const SIMILAR_BOOKS = [
  { id: 991, title: "El nombre del viento", match: 94, coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&q=80" },
  { id: 992, title: "1984 - George Orwell", match: 91, coverUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&q=80" },
  { id: 993, title: "Fahrenheit 451", match: 89, coverUrl: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=300&q=80" },
];

export default function BookDetail({ book, onClose }: BookDetailProps) {
  const [phase, setPhase] = useState<"enter" | "visible" | "exit">("enter");
  const [read, setRead] = useState(false);
  const [fav, setFav] = useState(false);
  const [notInterested, setNotInterested] = useState(false);
  const [matchPercentage, setMatchPercentage] = useState<number | null>(null);
  
  const fetchedRef = useRef(false);

  // ── Sincronizar estado de botones con el backend ──────────────────────────
  useEffect(() => {
    const fetchEstado = async () => {
      const usuarioRaw = localStorage.getItem("usuario");
      if (!usuarioRaw) return;
      const usuario = JSON.parse(usuarioRaw);
      
      try {
        const res = await fetch(`http://localhost:8080/api/usuarios/${usuario.id}/estado/${book.id}`);
        if (res.ok) {
          const data = await res.json();
          setFav(data.esFavorito);
          setRead(data.esLeido);
        }
      } catch (err) {
        console.error("Error al cargar estado de interacción:", err);
      }
    };
    fetchEstado();
  }, [book.id]);

  // Animación de entrada
  useEffect(() => {
    const id = requestAnimationFrame(() => setPhase("visible"));
    return () => cancelAnimationFrame(id);
  }, []);

  // Fetch del match
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchMatch = async () => {
      const usuarioRaw = localStorage.getItem("usuario");
      if (!usuarioRaw) return;
      const usuarioId = JSON.parse(usuarioRaw)?.id;
      if (!usuarioId || !book.id) return;

      try {
        const res = await fetch(`http://localhost:8080/api/recomendaciones/match/${usuarioId}/${book.id}`);
        if (res.ok) {
          const val = await res.json();
          setMatchPercentage(val);
        } else {
          setMatchPercentage(50);
        }
      } catch {
        setMatchPercentage(50);
      }
    };
    fetchMatch();
  }, [book.id]);

  const handleClose = useCallback(() => {
    if (phase === "exit") return;
    setPhase("exit");
    setTimeout(onClose, 300);
  }, [phase, onClose]);

  // ── Funciones para persistir cambios en Backend ──────────────────────────
  const toggleFavorito = async () => {
    const usuarioRaw = localStorage.getItem("usuario");
    if (!usuarioRaw) return;
    const usuario = JSON.parse(usuarioRaw);
    
    const nuevoEstado = !fav;
    setFav(nuevoEstado); 

    const method = nuevoEstado ? "POST" : "DELETE";
    await fetch(`http://localhost:8080/api/usuarios/${usuario.id}/favoritos/${book.id}`, {
      method: method
    });
  };

  const toggleLeido = async () => {
    const usuarioRaw = localStorage.getItem("usuario");
    if (!usuarioRaw) return;
    const usuario = JSON.parse(usuarioRaw);

    const nuevoEstado = !read;
    setRead(nuevoEstado);

    const method = nuevoEstado ? "POST" : "DELETE";
    await fetch(`http://localhost:8080/api/usuarios/${usuario.id}/leidos/${book.id}`, {
      method: method
    });
  };

  const isIn = phase === "visible";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6"
      style={{ backgroundColor: isIn ? "rgba(0,0,0,0.85)" : "transparent", transition: "background-color 300ms" }}
      onClick={handleClose}
    >
      <div
        className="relative w-full h-full md:max-w-4xl md:h-[90vh] md:rounded-2xl overflow-y-auto bg-card shadow-2xl transform-gpu scrollbar-hide"
        style={{
          opacity: isIn ? 1 : 0,
          transform: isIn ? "scale(1) translateY(0)" : "scale(0.95) translateY(20px)",
          transition: "300ms cubic-bezier(0.2, 0.9, 0.3, 1)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fondo difuminado para la cabecera */}
        <div className="absolute top-0 left-0 w-full h-[400px] z-0 opacity-20 mask-image-b" style={{ backgroundImage: `url(${book.urlPortada})`, backgroundSize: "cover", backgroundPosition: "center", filter: "blur(30px)" }} />
        <div className="absolute inset-0 bg-background/90 z-0" />

        <button onClick={handleClose} className="absolute top-4 right-4 md:top-6 md:right-6 z-50 p-2 rounded-full bg-background/50 hover:bg-background/80 border border-border text-foreground transition-all">
          <X size={20} />
        </button>

        <div className="relative z-10 px-6 py-10 md:px-12 min-h-full flex flex-col gap-10">
          
          {/* ── PARTE 1: HEADER (Título a Botones) ── */}
          <div className="grid grid-cols-1 md:grid-cols-[14rem_1fr] gap-8">
            <img src={book.urlPortada} className="w-full rounded-xl shadow-xl aspect-[2/3] object-cover" alt={book.titulo} />
            
            <div className="flex flex-col gap-5 justify-center">
              <h1 className="text-3xl md:text-5xl font-bold leading-tight">{book.titulo}</h1>
              
              <div className="flex flex-wrap items-center gap-3">
                {matchPercentage === null ? (
                  <MatchSkeleton />
                ) : matchPercentage >= 70 ? (
                  <MatchBadge pct={matchPercentage} />
                ) : null}
                
                <span className="px-3 py-1 bg-secondary/50 rounded-md text-sm font-medium text-foreground/80">{book.año}</span>
                <span className="px-3 py-1 bg-secondary/50 rounded-md text-sm font-medium text-foreground/80">{book.autor}</span>
                <span className="px-3 py-1 bg-secondary/50 rounded-md text-sm font-medium text-foreground/80">{book.genero}</span>
              </div>

              {/* Temáticas y estilos */}
              <div className="flex flex-wrap gap-2">
                {book.estilo && (
                  <span className="px-3 py-1 text-xs font-bold bg-background rounded-full border border-border">
                    <span className="opacity-50 mr-1">ESTILO:</span>{book.estilo}
                  </span>
                )}
                {book.tematica?.map(t => (
                  <span key={t} className="px-3 py-1 text-xs font-medium bg-background rounded-full border border-border">
                    <span className="opacity-50 mr-1">TEMA:</span>{t}
                  </span>
                ))}
              </div>

              {/* Botones de Acción */}
              <div className="flex flex-wrap gap-3 mt-2">
                <button 
                  onClick={toggleFavorito} 
                  className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm ${fav ? "bg-primary text-white" : "bg-card border border-border hover:border-primary/50"}`}
                >
                  <Heart size={16} className={`inline mr-2 ${fav ? "fill-current" : ""}`} /> 
                  {fav ? "En favoritos" : "Favoritos"}
                </button>

                <button 
                  onClick={toggleLeido} 
                  className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm ${read ? "bg-primary/20 text-primary border-primary/40" : "bg-card border border-border hover:border-primary/50"}`}
                >
                  <CheckCircle size={16} className="inline mr-2" /> 
                  {read ? "Leído ✓" : "Marcar leído"}
                </button>

                <button 
                  onClick={() => setNotInterested(!notInterested)} 
                  className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm ${notInterested ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-card border border-border hover:border-red-500/30"}`}
                >
                  <ThumbsDown size={16} className="inline mr-2" /> 
                  {notInterested ? "Descartado" : "No me interesa"}
                </button>
              </div>
            </div>
          </div>

          {/* ── PARTE 2: SINOPSIS ── */}
          <div className="border-t border-border pt-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
               Sinopsis
            </h2>
            <p className="text-base text-foreground/80 leading-relaxed max-w-4xl">
              {book.sinopsis}
            </p>
          </div>

          {/* ── PARTE 3: SIMILARES ── */}
          <div className="border-t border-border pt-8 pb-4">
            <h2 className="text-xl font-bold mb-6">También te podría gustar</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {SIMILAR_BOOKS.map((simBook) => (
                <div key={simBook.id} className="group cursor-pointer relative overflow-hidden rounded-xl border border-border bg-card hover:border-primary/50 transition-colors flex flex-col items-center p-3">
                  <div className="absolute top-2 right-2 bg-background/90 px-2 py-0.5 rounded text-xs font-bold text-primary border border-primary/20 shadow-sm z-10">
                    {simBook.match}%
                  </div>
                  <img src={simBook.coverUrl} alt={simBook.title} className="w-full h-32 object-cover rounded-lg shadow-sm mb-3 group-hover:scale-105 transition-transform" />
                  <p className="text-sm font-semibold text-center leading-tight line-clamp-2">{simBook.title}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}