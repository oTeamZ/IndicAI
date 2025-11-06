"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Play, Plus } from "lucide-react"
import { getPersonalizedRecommendations } from "@/lib/recommendations"
import { useState, useEffect } from "react"
import type { MediaItem } from "@/lib/types"

interface RecommendationsTabProps {
  userPreferences: string[]
  onUpdatePreferences?: (newPreferences: string[]) => void
}

export function RecommendationsTab({ userPreferences, onUpdatePreferences }: RecommendationsTabProps) {
  const [recommendations, setRecommendations] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiRecommendations = await getPersonalizedRecommendations(userPreferences);
        setRecommendations(apiRecommendations.slice(0, 10));
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError("Erro ao carregar recomendações. Mostrando conteúdo padrão.");
        // Fallback para dados mockados se houver erro
        const { mockMediaItems } = await import("@/lib/mock-data");
        const fallbackRecommendations = mockMediaItems
          .filter((item) => userPreferences.some((pref) => item.genres.includes(pref)))
          .slice(0, 10);
        setRecommendations(fallbackRecommendations);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userPreferences]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Recomendações Para Você</h2>
          <p className="text-muted-foreground text-sm">Baseado no seu perfil de gosto personalizado</p>
        </div>
        <div className="flex items-center justify-center min-h-[40vh]">
          <p className="text-muted-foreground">Carregando recomendações personalizadas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Recomendações Para Você</h2>
          <p className="text-muted-foreground text-sm">Baseado no seu perfil de gosto personalizado</p>
        </div>
        <div className="flex items-center justify-center min-h-[40vh]">
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Recomendações Para Você</h2>
        <p className="text-muted-foreground text-sm">Baseado no seu perfil de gosto personalizado</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="flex gap-4 p-4">
              <div className="relative w-24 h-36 flex-shrink-0 rounded-lg overflow-hidden">
                <img
                  src={item.imageUrl || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-sm leading-tight line-clamp-2">{item.title}</h3>
                  <Badge variant="secondary" className="text-xs flex-shrink-0">
                    {item.type === "movie" && "Filme"}
                    {item.type === "series" && "Série"}
                    {item.type === "book" && "Livro"}
                    {item.type === "music" && "Música"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    {item.rating}
                  </span>
                  <span>•</span>
                  <span>{item.year}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{item.description}</p>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 h-8 text-xs">
                    <Play className="w-3 h-3 mr-1" />
                    Ver Mais
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 px-3 bg-transparent">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {recommendations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Continue avaliando conteúdos para receber recomendações personalizadas!
          </p>
        </div>
      )}
    </div>
  )
}
