"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Flame, Star } from "lucide-react"
import { useState, useEffect } from "react"
import { getPersonalizedRecommendations } from "@/lib/recommendations"
import type { MediaItem } from "@/lib/types"

export function SuperStarTab() {
  const [trendingItems, setTrendingItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrendingItems = async () => {
      setLoading(true);
      try {
        // Busca recomendações para obter itens populares
        // Poderia ser expandido para uma chamada específica para itens populares
        const recommendations = await getPersonalizedRecommendations([]);
        // Ordenar por rating para mostrar os mais populares
        const sortedItems = [...recommendations].sort((a, b) => b.rating - a.rating).slice(0, 10);
        setTrendingItems(sortedItems);
      } catch (err) {
        console.error("Error fetching trending items:", err);
        // Fallback para dados mockados
        const { mockMediaItems } = await import("@/lib/mock-data");
        const fallbackItems = [...mockMediaItems].sort((a, b) => b.rating - a.rating).slice(0, 10);
        setTrendingItems(fallbackItems);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingItems();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Flame className="w-8 h-8 text-primary" />
            <h2 className="text-2xl font-bold">SuperStar</h2>
          </div>
          <p className="text-muted-foreground text-sm">Carregando conteúdos em alta...</p>
        </div>
        <div className="flex items-center justify-center min-h-[40vh]">
          <p className="text-muted-foreground">Carregando tendências...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Flame className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-bold">SuperStar</h2>
        </div>
        <p className="text-muted-foreground text-sm">Os conteúdos mais populares e em alta no momento</p>
      </div>

      <div className="space-y-4">
        {trendingItems.map((item, index) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="flex gap-4 p-4">
              {/* Ranking Number */}
              <div className="flex items-center justify-center w-12 flex-shrink-0">
                <span className="text-4xl font-bold text-primary/20">{index + 1}</span>
              </div>

              {/* Image */}
              <div className="relative w-20 h-28 flex-shrink-0 rounded-lg overflow-hidden">
                <img
                  src={item.imageUrl || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {index < 3 && (
                  <div className="absolute top-1 right-1">
                    <TrendingUp className="w-4 h-4 text-primary" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold leading-tight line-clamp-2">{item.title}</h3>
                  <Badge variant="secondary" className="text-xs flex-shrink-0">
                    {item.type === "movie" && "Filme"}
                    {item.type === "series" && "Série"}
                    {item.type === "book" && "Livro"}
                    {item.type === "music" && "Música"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {item.rating}
                  </span>
                  <span>•</span>
                  <span>{item.year}</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.genres.slice(0, 3).map((genre) => (
                    <Badge key={genre} variant="outline" className="text-xs">
                      {genre}
                    </Badge>
                  ))}
                </div>
                <Button size="sm" variant="outline" className="h-8 text-xs bg-transparent">
                  Ver Detalhes
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
