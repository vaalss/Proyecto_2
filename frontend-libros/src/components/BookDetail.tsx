import { useState, useEffect, useCallback, useRef } from "react";
import { X, CheckCircle, Heart, Star, ThumbsDown } from "lucide-react";
import { Book } from "../types";

interface BookDetailProps {
  book: Book;
  onClose: () => void;
}

const MatchSkeleton = () => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-primary/10 bg-primary/10 animate-pulse" style={{ width: "9rem", height: "1.75rem" }}>
    <span className="block h-2.5 w-full rounded bg-primary/20" />
  </span>
);

const MatchBadge = ({ pct }: { pct: number }) => (
  <span className="inline-flex items-center gap-1.5 font-bold text-primary bg-primary/15 px-3 py-1 rounded-md border border-primary/20 text-sm" style={{ minWidth: "9rem", height: "1.75rem" }}>
    <Star size={13} className="fill-primary shrink-0" /> {pct}% coincidencia
  </span>
);

export default function BookDetail({ book, onClose }: BookDetailProps) {
  const [phase, setPhase] = useState<"enter" | "visible" | "exit">("enter");
  const [read, setRead] = useState(false);
  const [fav, setFav] = useState(false);
  const [notInterested, setNotInterested] = useState(false);
  const [matchPercentage, setMatchPercentage] = useState<number | null>(null);
  
  // ── ESTADO PARA SIMILARES REALES ──
  const [similares, setSimilares] = useState<Book[]>([]);
  const fetchedRef = useRef(false);

  useEffect(() => {
    const fetchEstadoYMatch = async () => {
      const usuarioRaw = localStorage.getItem("usuario");
      if (!usuarioRaw) return;
      const usuario = JSON.parse(usuarioRaw);
      
      try {
        const resEstado = await fetch(`http://localhost:8080/api/usuarios/${usuario.id}/estado/${book.id}`);
        if (resEstado.ok) {
          const data = await resEstado.json();
          setFav(data.esFavorito);
          setRead(data.esLeido);
        }
        
        const resMatch = await fetch(`http://localhost:8080/api/recomendaciones/match/${usuario.id}/${book.id}`);
        setMatchPercentage(resMatch.ok ? await resMatch.json() : 50);
      } catch (err) {
        setMatchPercentage(50);
      }
    };
    fetchEstadoYMatch();
  }, [book.id]);

  // ── EFECTO PARA BUSCAR SIMILARES EN LA DB ──
  useEffect(() => {
    const fetchSimilares = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/recomendaciones/libro/${encodeURIComponent(book.titulo)}`);
        if (res.ok) {
          const data = await res.json();
          const format = data.map((l: any) => ({
            id: l.id,
            titulo: l.titulo,
            autor: l.autor ? l.autor.nombre : "Autor Anónimo",
            urlPortada: l.urlPortada || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400",
            matchPercentage: 70 + Math.floor(Math.random() * 25) 
          }));
          setSimilares(format);
        }
      } catch (err) {
        console.error("Error cargando similares:", err);
      }
    };
    fetchSimilares();
  }, [book.titulo]);

  useEffect(() => {
    const id = requestAnimationFrame(() => setPhase("visible"));
    return () => cancelAnimationFrame(id);
  }, []);

  const handleClose = useCallback(() => {
    if (phase === "exit") return;
    setPhase("exit");
    setTimeout(onClose, 300);
  }, [phase, onClose]);

  const toggleFavorito = async () => {
    const usuarioRaw = localStorage.getItem("usuario");
    if (!usuarioRaw) return;
    const usuario = JSON.parse(usuarioRaw);
    const nuevoEstado = !fav;
    setFav(nuevoEstado); 
    await fetch(`http://localhost:8080/api/usuarios/${usuario.id}/favoritos/${book.id}`, { method: nuevoEstado ? "POST" : "DELETE" });
  };

  const toggleLeido = async () => {
    const usuarioRaw = localStorage.getItem("usuario");
    if (!usuarioRaw) return;
    const usuario = JSON.parse(usuarioRaw);
    const nuevoEstado = !read;
    setRead(nuevoEstado);
    await fetch(`http://localhost:8080/api/usuarios/${usuario.id}/leidos/${book.id}`, { method: nuevoEstado ? "POST" : "DELETE" });
  };

  const isIn = phase === "visible";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6"
      style={{ backgroundColor: isIn ? "rgba(0,0,0,0.85)" : "transparent", transition: "background-color 300ms" }}
      onClick={handleClose}
    >
      <div
        className="relative w-full h-full md:max-w-4xl md:h-[90vh] md:rounded-2xl overflow-y-auto shadow-2xl transform-gpu scrollbar-hide flex flex-col bg-card"
        style={{
          opacity: isIn ? 1 : 0,
          transform: isIn ? "scale(1) translateY(0)" : "scale(0.95) translateY(20px)",
          transition: "300ms cubic-bezier(0.2, 0.9, 0.3, 1)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={handleClose} className="absolute top-4 right-4 md:top-6 md:right-6 z-50 p-2 rounded-full bg-background/50 hover:bg-background/80 border border-border text-foreground transition-all">
          <X size={20} />
        </button>

        {/* ── SECCIÓN 1: CABECERA CON BLUR AISLADO ── */}
        <div className="relative w-full shrink-0 overflow-hidden bg-background">
          <div className="absolute inset-0 z-0 opacity-20 mask-image-b" style={{ backgroundImage: `url(${book.urlPortada})`, backgroundSize: "cover", backgroundPosition: "center", filter: "blur(30px)" }} />
          <div className="absolute inset-0 bg-background/90 z-0" />
          
          <div className="relative z-10 px-6 py-10 md:px-12 grid grid-cols-1 md:grid-cols-[14rem_1fr] gap-8">
            <img src={book.urlPortada} className="w-full rounded-xl shadow-xl aspect-[2/3] object-cover" alt={book.titulo} />
            
            <div className="flex flex-col gap-5 justify-center">
              <h1 className="text-3xl md:text-5xl font-bold leading-tight">{book.titulo}</h1>
              
              <div className="flex flex-wrap items-center gap-3">
                {matchPercentage === null ? <MatchSkeleton /> : matchPercentage >= 70 ? <MatchBadge pct={matchPercentage} /> : null}
                <span className="px-3 py-1 bg-secondary/50 rounded-md text-sm font-medium text-foreground/80">{book.año}</span>
                <span className="px-3 py-1 bg-secondary/50 rounded-md text-sm font-medium text-foreground/80">{book.autor}</span>
                <span className="px-3 py-1 bg-secondary/50 rounded-md text-sm font-medium text-foreground/80">{book.genero}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {book.estilo && <span className="px-3 py-1 text-xs font-bold bg-background rounded-full border border-border"><span className="opacity-50 mr-1">ESTILO:</span>{book.estilo}</span>}
                {book.tematica?.map(t => <span key={t} className="px-3 py-1 text-xs font-medium bg-background rounded-full border border-border"><span className="opacity-50 mr-1">TEMA:</span>{t}</span>)}
              </div>

              <div className="flex flex-wrap gap-3 mt-2">
                <button onClick={toggleFavorito} className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm ${fav ? "bg-primary text-white" : "bg-card border border-border hover:border-primary/50"}`}>
                  <Heart size={16} className={`inline mr-2 ${fav ? "fill-current" : ""}`} /> {fav ? "En favoritos" : "Favoritos"}
                </button>
                <button onClick={toggleLeido} className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm ${read ? "bg-primary/20 text-primary border-primary/40" : "bg-card border border-border hover:border-primary/50"}`}>
                  <CheckCircle size={16} className="inline mr-2" /> {read ? "Leído ✓" : "Marcar leído"}
                </button>
                <button onClick={() => setNotInterested(!notInterested)} className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm ${notInterested ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-card border border-border hover:border-red-500/30"}`}>
                  <ThumbsDown size={16} className="inline mr-2" /> {notInterested ? "Descartado" : "No me interesa"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── SECCIÓN 2 y 3: FONDO SÓLIDO (Corta el blur) ── */}
        <div className="relative z-20 flex-1 bg-card px-6 md:px-12 pt-6 pb-12 border-t border-border">
          
          <div className="mb-10">
            <h2 className="text-xl font-bold mb-4">Sinopsis</h2>
            <p className="text-base text-foreground/80 leading-relaxed max-w-4xl">{book.sinopsis}</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-6">También te podría gustar</h2>
            {similares.length === 0 ? (
              <p className="text-muted-foreground text-sm">No hay recomendaciones similares calculadas aún.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {similares.map((simBook) => (
                  <div key={simBook.id} className="group cursor-pointer relative overflow-hidden rounded-xl border border-border bg-background hover:border-primary/50 transition-colors flex flex-col items-center p-3">
                    <div className="absolute top-2 right-2 bg-background/90 px-2 py-0.5 rounded text-xs font-bold text-primary border border-primary/20 shadow-sm z-10">
                      {simBook.matchPercentage}%
                    </div>
                    <img src={simBook.urlPortada} alt={simBook.titulo} className="w-full aspect-[2/3] object-cover rounded-lg shadow-sm mb-3 group-hover:scale-105 transition-transform" />
                    <p className="text-sm font-semibold text-center leading-tight line-clamp-2">{simBook.titulo}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}