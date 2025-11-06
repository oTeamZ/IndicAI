export type MediaType = "movie" | "series" | "book" | "music"

export interface MediaItem {
  id: string
  type: MediaType
  title: string
  description: string
  imageUrl: string
  rating: number
  year: number
  genres: string[]
  duration?: string
  cast?: string[]
  director?: string
  author?: string
  artist?: string
  userRating?: "like" | "dislike" | "superlike" | "skip"
}
