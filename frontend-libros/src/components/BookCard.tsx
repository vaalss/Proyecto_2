import { useState } from "react"
import { BookOpen } from "lucide-react"
import { Book } from "../types"

export default function BookCard({ book, dismissable = false, onDismiss, onClick }: { book: Book; dismissable?: boolean; onDismiss?: (id: number) => void; onClick?: () => void }) {
  const [imgError, setImgError] = useState(false)

  return (
    // Agregamos el onClick aquí en el div principal
    <div className="group relative w-full cursor-pointer" onClick={onClick}>
      <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-muted transition-transform duration-300 ease-out group-hover:scale-110 group-hover:z-10 group-hover:shadow-2xl group-hover:shadow-border">
        {!imgError ? (
          <img src={book.urlPortada} alt={`Portada de ${book.titulo}`} className="w-full h-full object-cover" onError={() => setImgError(true)} />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-secondary p-3">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
            <span className="text-xs text-muted-foreground text-center leading-tight">{book.titulo}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-muted via-muted/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 gap-1.5">
          <p className="text-foreground text-xs font-semibold leading-tight line-clamp-2">{book.titulo}</p>
          <p className="text-foreground/75 text-[11px] leading-tight">{book.autor}</p>
          <div className="flex flex-wrap gap-1 mt-0.5">
            <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-sm font-semibold">{book.genero}</span>
          </div>
        </div>
      </div>
    </div>
  )
}