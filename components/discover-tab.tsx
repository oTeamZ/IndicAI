"use client"

import { useState, useEffect } from "react"
import { MediaCard } from "@/components/media-card"
import { getPersonalizedRecommendations, updateUserProfile } from "@/lib/recommendations"
import { addChosenItem, getRemainingChoices, isDailyLimitReached, getRandomUnchosenSelection } from "@/lib/daily-choices"
import type { MediaItem } from "@/lib/types"

interface DiscoverTabProps {
  userPreferences: string[]
  onUpdatePreferences?: (newPreferences: string[]) => void
  addInteraction?: (interaction: { itemId: string; action: "like" | "dislike" | "superlike" | "skip"; timestamp: number }) => void
}

export function DiscoverTab({ userPreferences, onUpdatePreferences, addInteraction }: DiscoverTabProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);
      
      // Check if daily limit is reached before loading anything
      if (isDailyLimitReached()) {
        setError("Limite diário de 20 escolhas atingido. Volte amanhã para continuar descobrindo!");
        setItems([]);
        setLoading(false);
        return;
      }
      
      try {
        // Busca novas recomendações baseadas nas preferências do usuário
        const recommendations = await getPersonalizedRecommendations(userPreferences);
        // If no recommendations due to daily limit, show the message
        if (recommendations.length === 0) {
          setError("Limite diário de 20 escolhas atingido. Volte amanhã para continuar descobrindo!");
          setItems([]);
        } else {
          // Filtra itens que ainda não foram avaliados
          const filteredItems = recommendations.filter((item) => !item.userRating);
          setItems(filteredItems);
        }
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError("Erro ao carregar recomendações. Mostrando conteúdo padrão.");
        // Fallback para dados mockados se houver erro
        const { mockMediaItems } = await import("@/lib/mock-data");
        const fallbackItems = mockMediaItems.filter((item) => !item.userRating);
        // Also apply daily limit to fallback items
        const filteredFallbackItems = getRandomUnchosenSelection(fallbackItems, 20);
        setItems(filteredFallbackItems);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userPreferences]);

  const handleSwipe = async (direction: "left" | "right" | "up", itemId: string) => {
    // Determine the interaction based on the swipe direction
    let action: "like" | "dislike" | "superlike" | "skip" = "like";
    if (direction === "left") {
      action = "dislike";
    } else if (direction === "up") {
      action = "superlike";
    } else {
      action = "like"; // right swipe
    }

    // Add interaction to user history
    addInteraction({
      itemId,
      action,
      timestamp: Date.now()
    });

    // Register the item as chosen for the daily limit
    const added = addChosenItem(itemId);
    
    // Update preferences based on the interaction
    const newPreferences = updateUserProfile(userPreferences, { itemId, action }, items);
    if (onUpdatePreferences) {
      onUpdatePreferences(newPreferences);
    }

    // Move to next card
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // Check if we've reached the daily limit
      if (isDailyLimitReached()) {
        setError("Limite diário de 20 escolhas atingido. Volte amanhã para continuar descobrindo!");
        return;
      }
      
      // Fetch new recommendations if we've reached the end
      setLoading(true);
      try {
        const newRecommendations = await getPersonalizedRecommendations(newPreferences);
        // If no new recommendations due to daily limit, show the message
        if (newRecommendations.length === 0) {
          setError("Limite diário de 20 escolhas atingido. Volte amanhã para continuar descobrindo!");
          setItems([]);
        } else {
          setItems(newRecommendations);
          setCurrentIndex(0);
        }
      } catch (err) {
        console.error("Error refreshing recommendations:", err);
        setError("Erro ao atualizar recomendações.");
        // Fallback to mock data if API fails
        try {
          const { mockMediaItems } = await import("@/lib/mock-data");
          const fallbackItems = getRandomUnchosenSelection(mockMediaItems, 20);
          if (fallbackItems.length > 0) {
            setItems(fallbackItems);
            setCurrentIndex(0);
          } else {
            setError("Limite diário de 20 escolhas atingido. Volte amanhã para continuar descobrindo!");
            setItems([]);
          }
        } catch (fallbackErr) {
          console.error("Error loading fallback data:", fallbackErr);
        }
      } finally {
        setLoading(false);
      }
    }
  }

  const handleSkip = async (itemId: string) => {
    // Add skip interaction to user history
    addInteraction({
      itemId,
      action: "skip",
      timestamp: Date.now()
    });

    // Register the item as chosen (for tracking purposes, even if skipped)
    addChosenItem(itemId);

    // Move to next card without rating
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // Check if we've reached the daily limit
      if (isDailyLimitReached()) {
        setError("Limite diário de 20 escolhas atingido. Volte amanhã para continuar descobrindo!");
        return;
      }
      
      // Fetch new recommendations if we've reached the end
      setLoading(true);
      try {
        const newRecommendations = await getPersonalizedRecommendations(userPreferences);
        // If no new recommendations due to daily limit, show the message
        if (newRecommendations.length === 0) {
          setError("Limite diário de 20 escolhas atingido. Volte amanhã para continuar descobrindo!");
          setItems([]);
        } else {
          setItems(newRecommendations);
          setCurrentIndex(0);
        }
      } catch (err) {
        console.error("Error refreshing recommendations:", err);
        setError("Erro ao atualizar recomendações.");
        // Fallback to mock data if API fails
        try {
          const { mockMediaItems } = await import("@/lib/mock-data");
          const fallbackItems = getRandomUnchosenSelection(mockMediaItems, 20);
          if (fallbackItems.length > 0) {
            setItems(fallbackItems);
            setCurrentIndex(0);
          } else {
            setError("Limite diário de 20 escolhas atingido. Volte amanhã para continuar descobrindo!");
            setItems([]);
          }
        } catch (fallbackErr) {
          console.error("Error loading fallback data:", fallbackErr);
        }
      } finally {
        setLoading(false);
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-muted-foreground">Carregando recomendações personalizadas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-muted-foreground">Nenhum conteúdo disponível no momento. Tente ajustar suas preferências.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Descubra Novos Conteúdos</h2>
        <p className="text-muted-foreground text-sm">Deslize para a direita se gostar, esquerda se não gostar</p>
      </div>

      <div className="relative h-[600px]">
        {items.slice(currentIndex, currentIndex + 3).map((item, index) => (
          <div
            key={item.id}
            className="absolute inset-0"
            style={{
              zIndex: 3 - index,
              transform: `scale(${1 - index * 0.05}) translateY(${index * 10}px)`,
              opacity: index === 0 ? 1 : 0.5,
            }}
          >
            <MediaCard 
              item={item} 
              onSwipe={handleSwipe} 
              onSkip={handleSkip} 
              isActive={index === 0}
              currentPreferences={userPreferences}
            />
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">{items.length - currentIndex} itens restantes</p>
      </div>
    </div>
  )
}
