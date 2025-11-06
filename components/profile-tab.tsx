"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Star, X, BarChart3, Share2 } from "lucide-react"
import { mockMediaItems } from "@/lib/mock-data"
import { useState, useEffect } from "react"
import type { MediaItem } from "@/lib/types"

interface ProfileTabProps {
  userPreferences: string[]
}

export function ProfileTab({ userPreferences }: ProfileTabProps) {
  const [stats, setStats] = useState({
    liked: 0,
    superLiked: 0,
    disliked: 0,
    totalSwipes: 0,
  });
  
  const [likedItems, setLikedItems] = useState<MediaItem[]>([]);

  useEffect(() => {
    // Calcular estatísticas com base nas preferências e histórico
    // Esta lógica pode ser expandida para usar dados reais do usuário
    const liked = mockMediaItems.filter(item => item.userRating === "like" || item.userRating === "superlike").length;
    const superLiked = mockMediaItems.filter(item => item.userRating === "superlike").length;
    const disliked = mockMediaItems.filter(item => item.userRating === "dislike").length;
    
    setStats({
      liked,
      superLiked,
      disliked,
      totalSwipes: liked + disliked + mockMediaItems.filter(item => item.userRating === "skip").length,
    });
    
    // Pegar itens favoritos (curtidos ou super curtidos)
    const likedItems = mockMediaItems
      .filter(item => item.userRating === "like" || item.userRating === "superlike")
      .slice(0, 6);
      
    setLikedItems(likedItems);
  }, [userPreferences]);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl font-bold text-white">
            U
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-1">Seu Perfil</h2>
            <p className="text-muted-foreground text-sm">Seu DNA de gosto personalizado</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <Heart className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.liked}</p>
            <p className="text-xs text-muted-foreground">Curtidas</p>
          </Card>
          <Card className="p-4 text-center">
            <Star className="w-6 h-6 text-secondary mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.superLiked}</p>
            <p className="text-xs text-muted-foreground">Super Likes</p>
          </Card>
          <Card className="p-4 text-center">
            <X className="w-6 h-6 text-destructive mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.disliked}</p>
            <p className="text-xs text-muted-foreground">Não Gostei</p>
          </Card>
          <Card className="p-4 text-center">
            <BarChart3 className="w-6 h-6 text-accent mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats.totalSwipes}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </Card>
        </div>
      </div>

      {/* Preferences */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Seus Gostos</h3>
        <div className="flex flex-wrap gap-2">
          {userPreferences.length > 0 ? (
            userPreferences.map((pref) => (
              <Badge key={pref} variant="secondary" className="text-sm">
                {pref}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              Continue avaliando conteúdos para construir seu perfil de gosto
            </p>
          )}
        </div>
      </div>

      {/* Liked Items */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Seus Favoritos</h3>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Compartilhar Lista
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {likedItems.length > 0 ? (
            likedItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="relative aspect-[2/3]">
                  <img
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white text-sm font-semibold line-clamp-2">{item.title}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-white text-xs">{item.rating}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-sm text-muted-foreground col-span-3 text-center py-8">
              Você ainda não tem favoritos. Curta alguns conteúdos para vê-los aqui!
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button variant="outline" className="flex-1 bg-transparent">
          Editar Preferências
        </Button>
        <Button variant="outline" className="flex-1 bg-transparent">
          Ver Histórico Completo
        </Button>
      </div>
    </div>
  )
}
