import { useState, useEffect, useCallback } from "react";
import {
  X,
  CheckCircle,
  Heart,
  Star,
  Calendar,
  User,
  Tag,
  ThumbsDown
} from "lucide-react";
import { Book } from "../types";

interface BookDetailProps {
  book: Book;
  onClose: () => void;
}

const SIMILAR_BOOKS = [
  { id: 991, title: "A Man Called Ove", match: 94, coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&q=80" },
  { id: 992, title: "The House in the Cerulean Sea", match: 91, coverUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&q=80" },
  { id: 993, title: "Eleanor Oliphant is Completely Fine", match: 89, coverUrl: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=300&q=80" },
];

const ANIMATION_DURATION = 300;

export default function BookDetail({ book, onClose }: BookDetailProps) {
  const [phase, setPhase] = useState<"enter" | "visible" | "exit">("enter");
  const [read, setRead] = useState(false);
  const [fav, setFav] = useState(false);
  const [notInterested, setNotInterested] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setPhase("visible"));
    return () => cancelAnimationFrame(id);
  }, []);

  const handleClose = useCallback(() => {
    if (phase === "exit") return;
    setPhase("exit");
    setTimeout(() => onClose(), ANIMATION_DURATION);
  }, [phase, onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose]);

  const isIn = phase === "visible";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-0 md:p-6"
      style={{
        transition: `background-color ${ANIMATION_DURATION}ms ease-out`,
        backgroundColor: isIn ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0)",
      }}
      onClick={handleClose}
    >
      <div
        className="relative w-full h-full md:w-full md:max-w-6xl md:h-[90vh] md:rounded-2xl overflow-hidden overflow-y-auto bg-card shadow-2xl transform-gpu [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        style={{
          transition: `opacity ${ANIMATION_DURATION}ms ease-out, transform ${ANIMATION_DURATION}ms cubic-bezier(0.2, 0.9, 0.3, 1)`,
          opacity: isIn ? 1 : 0,
          transform: isIn ? "scale(1) translateY(0) translateZ(0)" : "scale(0.95) translateY(20px) translateZ(0)",
          willChange: "transform, opacity"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fondo Inmersivo */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 scale-105 pointer-events-none transform-gpu"
          style={{
            backgroundImage: `url(${book.urlPortada})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(24px) brightness(0.35)",
            willChange: "transform"
          }}
        />
        <div className="absolute inset-0 bg-background/80 z-0 pointer-events-none" />

        {/* Botón Cerrar */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 z-50 flex items-center justify-center w-10 h-10 rounded-full bg-background/30 backdrop-blur-md text-foreground border border-border/50 hover:bg-background/50 hover:scale-110 active:scale-90 transition-all duration-200"
        >
          <X size={20} />
        </button>

        {/* Layout de Contenido */}
        <div className="relative z-10 px-6 py-10 md:px-12 lg:px-16 min-h-full flex flex-col">
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12 w-full mx-auto items-start">
            
            {/* Portada */}
            <div className="w-48 md:w-64 shrink-0 mx-auto md:mx-0 z-20">
              <img
                src={book.urlPortada}
                alt={`Portada de ${book.titulo}`}
                className="w-full object-cover rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.6)] ring-1 ring-border/20 transition-transform hover:scale-[1.02] duration-300"
              />
            </div>

            {/* Información */}
            <div className="flex flex-col flex-1 min-w-0 pt-2">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground text-balance mb-4">
                {book.titulo}
              </h1>

              {/* Metadatos */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-foreground/80 mb-5">
                <span className="flex items-center gap-1.5 font-bold text-primary bg-primary/15 px-3 py-1 rounded-md border border-primary/20">
                  <Star size={14} className="fill-primary" />
                  98% de coincidencia
                </span>
                <span className="flex items-center gap-1.5 bg-background/40 backdrop-blur-sm px-3 py-1 rounded-md border border-border/30">
                  <Calendar size={14} className="text-muted-foreground" />
                  {book.año}
                </span>
                <span className="flex items-center gap-1.5 bg-background/40 backdrop-blur-sm px-3 py-1 rounded-md border border-border/30">
                  <User size={14} className="text-muted-foreground" />
                  {book.autor}
                </span>
                <span className="flex items-center gap-1.5 bg-background/40 backdrop-blur-sm px-3 py-1 rounded-md border border-border/30">
                  <Tag size={14} className="text-muted-foreground" />
                  {book.genero}
                </span>
              </div>

              {/* Clasificación */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {book.estilo && (
                  <span className="flex items-center text-xs font-bold px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground border border-border/50 shadow-sm">
                    <span className="text-[10px] uppercase tracking-wider opacity-70 mr-1.5 font-semibold">Estilo:</span>
                    {book.estilo}
                  </span>
                )}
                {book.tematica && book.tematica.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center text-xs font-semibold px-3 py-1.5 rounded-md bg-background/30 backdrop-blur-md text-foreground/90 border border-border/30"
                  >
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground mr-1.5 font-bold">Temática:</span>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Botones */}
              <div className="flex flex-row flex-wrap items-center gap-3 mb-8 justify-start">
                <button
                  onClick={() => setFav((v) => !v)}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95 shadow-md ${
                    fav ? "bg-primary text-primary-foreground border border-primary/50 shadow-primary/30" : "bg-background/50 backdrop-blur-md text-foreground border border-border/50 hover:bg-background/70 hover:border-primary/50"
                  }`}
                >
                  <Heart size={16} className={fav ? "fill-current" : ""} />
                  {fav ? "En favoritos" : "Favoritos"}
                </button>

                <button
                  onClick={() => setRead((v) => !v)}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95 shadow-md ${
                    read ? "bg-primary/20 backdrop-blur-md text-primary border border-primary/40" : "bg-background/50 backdrop-blur-md text-foreground border border-border/50 hover:bg-background/70"
                  }`}
                >
                  <CheckCircle size={16} className={read ? "text-primary" : "text-muted-foreground"} />
                  {read ? "Leído" : "Leído"}
                </button>

                <button
                  onClick={() => setNotInterested((v) => !v)}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95 shadow-md ${
                    notInterested ? "bg-red-500/15 backdrop-blur-md text-red-500 border border-red-500/30" : "bg-background/20 backdrop-blur-md text-muted-foreground border border-transparent hover:bg-background/40 hover:border-border/50"
                  }`}
                >
                  <ThumbsDown size={16} className={notInterested ? "fill-current" : ""} />
                  {notInterested ? "Descartado" : "No me interesa"}
                </button>
              </div>

              <p className="text-foreground/90 leading-relaxed text-base md:text-lg text-pretty max-w-3xl">
                {book.sinopsis}
              </p>
            </div>
          </div>

          {/* Títulos similares */}
          <div className="w-full relative z-10 mt-16">
            <h2 className="text-xl font-bold text-foreground mb-6 tracking-wide drop-shadow-md">Títulos similares</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory will-change-scroll">
              {SIMILAR_BOOKS.map((simBook) => (
                <button
                  key={simBook.id}
                  className="group relative flex-shrink-0 w-32 md:w-36 rounded-xl overflow-hidden border border-border/20 bg-background/40 backdrop-blur-sm hover:border-primary/50 transform-gpu transition-all duration-200 hover:-translate-y-1 hover:shadow-xl snap-start text-left"
                >
                  <img
                    src={simBook.coverUrl}
                    alt={`Portada de ${simBook.title}`}
                    className="w-full h-48 md:h-52 object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-2 right-2 text-[10px] font-bold text-primary bg-background/70 backdrop-blur-md border border-primary/20 px-2 py-1 rounded-md shadow-sm">
                    {simBook.match}%
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-sm font-semibold text-white leading-snug line-clamp-2">
                      {simBook.title}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}