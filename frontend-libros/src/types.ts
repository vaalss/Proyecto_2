export interface Book {
  id: number
  titulo: string
  autor: string
  sinopsis: string
  genero: string
  estilo?: string
  tematica: string[]
  urlPortada: string
  año: number
  matchPercentage?: number
}