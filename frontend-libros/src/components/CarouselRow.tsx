import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Book } from "../types"
import BookCard from "./BookCard"

export default function CarouselRow({ titulo, books, dismissable = false }: { titulo: string; books: Book[]; dismissable?: boolean }) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [items, setItems] = useState<Book[]>(books)
  const [removingIds, setRemovingIds] = useState<number[]>([])
  const [offset, setOffset] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => { setItems(books) }, [books])

  const getMaxOffset = () => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return 0
    const paddingLeft = parseFloat(getComputedStyle(viewport).paddingLeft) || 0
    const paddingRight = parseFloat(getComputedStyle(viewport).paddingRight) || 0
    return Math.max(0, track.scrollWidth - viewport.clientWidth + paddingLeft + paddingRight)
  }

  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateButtons = (currentOffset: number) => {
    const max = getMaxOffset()
    setCanScrollLeft(currentOffset > 0)
    setCanScrollRight(currentOffset < max - 4)
  }

  useEffect(() => { updateButtons(offset) }, [offset, items.length])

  const scroll = (dir: "left" | "right") => {
    if (isAnimating || !viewportRef.current) return
    const step = viewportRef.current.clientWidth * 0.75
    const next = dir === "right" ? Math.min(offset + step, getMaxOffset()) : Math.max(offset - step, 0)
    setIsAnimating(true)
    setOffset(next)
    setTimeout(() => setIsAnimating(false), 420)
  }

  const handleDismiss = (id: number) => {
    setRemovingIds((prev) => [...prev, id])
    setTimeout(() => {
      setItems((prev) => prev.filter((b) => b.id !== id))
      setRemovingIds((prev) => prev.filter((x) => x !== id))
      setOffset((prev) => Math.min(prev, getMaxOffset()))
    }, 320)
  }

  useEffect(() => {
    const onResize = () => setOffset((prev) => Math.min(prev, getMaxOffset()))
    window.addEventListener("resize", onResize)
    requestAnimationFrame(onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  if (items.length === 0) return null

  return (
    <div className="mb-10">
      <h2 className="px-6 md:px-12 text-sm md:text-base font-semibold text-foreground mb-4 tracking-wide">{titulo}</h2>
      <div className="relative group/row">
        {canScrollLeft && (
          <button onClick={() => scroll("left")} className="absolute left-0 top-0 bottom-0 z-20 w-12 flex items-center justify-center bg-gradient-to-r from-background to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity">
            <ChevronLeft className="h-7 w-7 text-foreground drop-shadow" />
          </button>
        )}
        <div ref={viewportRef} className="overflow-hidden px-6 md:px-12 pb-2">
          <div ref={trackRef} className="flex gap-3" style={{ transform: `translateX(-${offset}px)`, transition: "transform 420ms cubic-bezier(0.4, 0, 0.2, 1)", willChange: "transform" }}>
            {items.map((book) => (
              <div key={book.id} className={`flex-shrink-0 transition-all duration-300 ease-out ${removingIds.includes(book.id) ? "w-0 opacity-0 scale-75 -translate-y-3 overflow-hidden -mr-3" : "w-32 md:w-40"}`}>
                <BookCard book={book} dismissable={dismissable} onDismiss={handleDismiss} />
              </div>
            ))}
          </div>
        </div>
        {canScrollRight && (
          <button onClick={() => scroll("right")} className="absolute right-0 top-0 bottom-0 z-20 w-12 flex items-center justify-center bg-gradient-to-l from-background to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity">
            <ChevronRight className="h-7 w-7 text-foreground drop-shadow" />
          </button>
        )}
      </div>
    </div>
  )
}