import { useState, useEffect, useCallback, useRef } from "react";
import {
  X,
  CheckCircle,
  Heart,
  Star,
  Calendar,
  User,
  Tag,
  ThumbsDown,
  Loader2,
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

const SIMILAR_BOOKS = [
  { id: 991, title: "A Man Called Ove", match: 94, coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&q=80" },
  { id: 992, title: "The House in the Cerulean Sea", match: 91, coverUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&q=80" },
  { id: 993, title: "Eleanor Oliphant is Completely Fine", match: 89, coverUrl: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=300&q=80" },
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
          // Actualizamos los estados con la respuesta real de Neo4j
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

  // ── Funciones para persistir cambios en Backend ──────────────────────────
  const toggleFavorito = async () => {
    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
    if (!usuario.id) return;
    
    const nuevoEstado = !fav;
    setFav(nuevoEstado); // Feedback visual inmediato

    const method = nuevoEstado ? "POST" : "DELETE";
    await fetch(`http://localhost:8080/api/usuarios/${usuario.id}/favoritos/${book.id}`, {
      method: method
    });
  };

  const toggleLeido = async () => {
    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
    if (!usuario.id) return;

    const nuevoEstado = !read;
    setRead(nuevoEstado);

    const method = nuevoEstado ? "POST" : "DELETE";
    await fetch(`http://localhost:8080/api/usuarios/${usuario.id}/leidos/${book.id}`, {
      method: method
    });
  };

  const handleClose = useCallback(() => {
    if (phase === "exit") return;
    setPhase("exit");
    setTimeout(onClose, 300);
  }, [phase, onClose]);

  const isIn = phase === "visible";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6"
      style={{ backgroundColor: isIn ? "rgba(0,0,0,0.85)" : "transparent", transition: "background-color 300ms" }}
      onClick={handleClose}
    >
      <div
        className="relative w-full h-full md:max-w-6xl md:h-[90vh] md:rounded-2xl overflow-y-auto bg-card shadow-2xl transform-gpu"
        style={{
          opacity: isIn ? 1 : 0,
          transform: isIn ? "scale(1) translateY(0)" : "scale(0.95) translateY(20px)",
          transition: "300ms cubic-bezier(0.2, 0.9, 0.3, 1)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fondo */}
        <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: `url(${book.urlPortada})`, backgroundSize: "cover", backgroundPosition: "center", filter: "blur(20px)" }} />
        <div className="absolute inset-0 bg-background/80 z-0" />

        <button onClick={handleClose} className="absolute top-4 right-4 md:top-6 md:right-6 z-50 p-2 rounded-full bg-background/40 hover:bg-background/60 text-white">
          <X size={20} />
        </button>

        <div className="relative z-10 px-6 py-10 md:px-12 lg:px-16 min-h-full">
          <div className="grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-8">
            <img src={book.urlPortada} className="w-full rounded-xl shadow-2xl" alt={book.titulo} />
            
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl md:text-5xl font-bold">{book.titulo}</h1>
              
              {/* 2. Metadatos */}
              <div className="flex flex-wrap gap-2">
                {/* Lógica: 
                    1. Si está cargando (null) -> Mostramos skeleton. 
                    2. Si ya cargó y es >= 70 -> Mostramos el Badge. 
                    3. Si ya cargó y es < 70 -> Mostramos null (nada). 
                */}
                {matchPercentage === null ? (
                  <MatchSkeleton />
                ) : matchPercentage >= 70 ? (
                  <MatchBadge pct={matchPercentage} />
                ) : null}
                
                <span className="px-3 py-1 bg-background/40 rounded border border-border text-foreground/80">{book.año}</span>
                <span className="px-3 py-1 bg-background/40 rounded border border-border text-foreground/80">{book.autor}</span>
                <span className="px-3 py-1 bg-background/40 rounded border border-border text-foreground/80">{book.genero}</span>
              </div>

              {/* Clasificación Distinguida */}
              <div className="flex flex-wrap gap-2">
                {book.estilo && (
                  <span className="px-3 py-1 text-xs font-bold bg-secondary rounded border border-border">
                    <span className="opacity-60 uppercase mr-1">Estilo:</span>{book.estilo}
                  </span>
                )}
                {book.tematica?.map(t => (
                  <span key={t} className="px-3 py-1 text-xs font-semibold bg-background/30 rounded border border-border">
                    <span className="opacity-60 uppercase mr-1">Temática:</span>{t}
                  </span>
                ))}
              </div>

              {/* Botones */}
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={toggleFavorito} 
                  className={`px-4 py-2 rounded-lg font-bold text-sm ${fav ? "bg-primary text-white" : "bg-card border"}`}
                >
                  <Heart size={16} className={`inline mr-2 ${fav ? "fill-current" : ""}`} /> 
                  {fav ? "En favoritos" : "Favoritos"}
                </button>

                <button 
                  onClick={toggleLeido} 
                  className={`px-4 py-2 rounded-lg font-bold text-sm ${read ? "bg-primary/20 text-primary border border-primary/40" : "bg-card border"}`}
                >
                  <CheckCircle size={16} className="inline mr-2" /> 
                  {read ? "Leído ✓" : "Marcar leído"}
                </button>

                {/* El botón de 'No me interesa' sigue igual */}
                <button onClick={() => setNotInterested(!notInterested)} className={`px-4 py-2 rounded-lg font-bold text-sm ${notInterested ? "bg-red-500/20 text-red-500" : "bg-card border"}`}>
                  <ThumbsDown size={16} className="inline mr-2" /> {notInterested ? "Descartado" : "No me interesa"}
                </button>
              </div>

              <p className="text-base text-foreground/80 leading-relaxed">{book.sinopsis}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}