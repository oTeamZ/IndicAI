"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, X, Star, SkipForward, Info } from "lucide-react"
import type { MediaItem } from "@/lib/types"

interface MediaCardProps {
  item: MediaItem
  onSwipe: (direction: "left" | "right" | "up", itemId: string) => void
  onSkip: (itemId: string) => void
  isActive: boolean
  onUpdatePreferences?: (newPreferences: string[]) => void
  currentPreferences?: string[]
}

export function MediaCard({ item, onSwipe, onSkip, isActive, onUpdatePreferences, currentPreferences }: MediaCardProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [showDetails, setShowDetails] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isActive) return
    setIsDragging(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !isActive) return
    setDragOffset({
      x: e.movementX + dragOffset.x,
      y: e.movementY + dragOffset.y,
    })
  }

  const handleSwipeAction = (direction: "left" | "right" | "up", itemId: string) => {
    // Chama o callback original
    onSwipe(direction, itemId);
  };

  const handleMouseUp = () => {
    if (!isDragging || !isActive) return
    setIsDragging(false)

    // Determine swipe direction based on offset
    if (Math.abs(dragOffset.x) > 100) {
      if (dragOffset.x > 0) {
        onSwipe("right", item.id)
      } else {
        onSwipe("left", item.id)
      }
    } else if (dragOffset.y < -100) {
      onSwipe("up", item.id)
    }

    setDragOffset({ x: 0, y: 0 })
  }

  const handleLike = () => {
    handleSwipeAction("right", item.id)
  }

  const handleDislike = () => {
    handleSwipeAction("left", item.id)
  }

  const handleSuperLike = () => {
    handleSwipeAction("up", item.id)
  }

  const handleSkip = () => {
    onSkip(item.id);
  }

  const rotation = dragOffset.x * 0.1
  const opacity = 1 - Math.abs(dragOffset.x) / 300

  return (
    <div
      ref={cardRef}
      className="relative w-full h-full"
      style={{
        transform: `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotate(${rotation}deg)`,
        opacity: opacity,
        transition: isDragging ? "none" : "all 0.3s ease-out",
        cursor: isActive ? "grab" : "default",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <Card className="w-full h-full overflow-hidden bg-card shadow-2xl">
        {/* Image */}
        <div className="relative h-[400px] overflow-hidden">
          <img src={item.imageUrl || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Type Badge */}
          <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
            {item.type === "movie" && "Filme"}
            {item.type === "series" && "Série"}
            {item.type === "book" && "Livro"}
            {item.type === "music" && "Música"}
          </Badge>

          {/* Info Button */}
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
            onClick={() => setShowDetails(!showDetails)}
          >
            <Info className="w-5 h-5" />
          </Button>

          {/* Title and Info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-2xl font-bold mb-2 text-balance">{item.title}</h3>
            <div className="flex items-center gap-3 text-sm mb-2">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                {item.rating}
              </span>
              <span>{item.year}</span>
              {item.duration && <span>{item.duration}</span>}
            </div>
            <div className="flex flex-wrap gap-2">
              {item.genres.slice(0, 3).map((genre) => (
                <Badge key={genre} variant="secondary" className="text-xs">
                  {genre}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className={`p-6 transition-all ${showDetails ? "block" : "hidden"}`}>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{item.description}</p>
          {item.cast && (
            <div className="mb-2">
              <p className="text-xs font-semibold text-foreground mb-1">Elenco:</p>
              <p className="text-xs text-muted-foreground">{item.cast.join(", ")}</p>
            </div>
          )}
          {item.director && (
            <div>
              <p className="text-xs font-semibold text-foreground mb-1">Diretor:</p>
              <p className="text-xs text-muted-foreground">{item.director}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-6 left-0 right-0 px-6">
          <div className="flex items-center justify-center gap-4">
            <Button
              size="icon"
              variant="outline"
              className="w-14 h-14 rounded-full border-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground shadow-lg bg-transparent"
              onClick={handleDislike}
              disabled={!isActive}
            >
              <X className="w-6 h-6" />
            </Button>

            <Button
              size="icon"
              variant="outline"
              className="w-12 h-12 rounded-full border-2 border-muted-foreground text-muted-foreground hover:bg-muted hover:text-foreground shadow-lg bg-transparent"
              onClick={handleSkip}
              disabled={!isActive}
            >
              <SkipForward className="w-5 h-5" />
            </Button>

            <Button
              size="icon"
              variant="outline"
              className="w-14 h-14 rounded-full border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground shadow-lg bg-transparent"
              onClick={handleSuperLike}
              disabled={!isActive}
            >
              <Star className="w-6 h-6" />
            </Button>

            <Button
              size="icon"
              variant="outline"
              className="w-14 h-14 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-lg bg-transparent"
              onClick={handleLike}
              disabled={!isActive}
            >
              <Heart className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Swipe Indicators */}
      {dragOffset.x > 50 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="text-6xl font-bold text-primary rotate-12">GOSTEI</div>
        </div>
      )}
      {dragOffset.x < -50 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="text-6xl font-bold text-destructive -rotate-12">NOPE</div>
        </div>
      )}
      {dragOffset.y < -50 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="text-6xl font-bold text-secondary">AMEI</div>
        </div>
      )}
    </div>
  )
}
