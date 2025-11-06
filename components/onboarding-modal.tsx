"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { mockMediaItems } from "@/lib/mock-data"

interface OnboardingModalProps {
  onComplete: (preferences: string[]) => void
}

export function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState(0)
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  // Get 15 popular items for onboarding
  const onboardingItems = mockMediaItems.slice(0, 15)

  const handleItemClick = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId))
    } else {
      setSelectedItems([...selectedItems, itemId])
    }
  }

  const handleComplete = () => {
    // Extract genres from selected items as preferences
    const preferences = onboardingItems.filter((item) => selectedItems.includes(item.id)).flatMap((item) => item.genres)
    const uniquePreferences = Array.from(new Set(preferences))
    onComplete(uniquePreferences)
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Bem-vindo ao indicAI!</h2>
          <p className="text-muted-foreground">
            Selecione pelo menos 5 conteúdos que você gosta para personalizarmos suas recomendações
          </p>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">{selectedItems.length} de 15 selecionados</span>
              <span className="text-muted-foreground">Mínimo: 5</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${(selectedItems.length / 15) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-6">
          {onboardingItems.map((item) => {
            const isSelected = selectedItems.includes(item.id)
            return (
              <div key={item.id} className="relative cursor-pointer group" onClick={() => handleItemClick(item.id)}>
                <div
                  className={`relative aspect-[2/3] rounded-lg overflow-hidden border-2 transition-all ${
                    isSelected
                      ? "border-primary shadow-lg scale-95"
                      : "border-transparent hover:border-muted-foreground/50"
                  }`}
                >
                  <img
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <p className="text-white text-xs font-semibold line-clamp-2">{item.title}</p>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex gap-4">
          <Button variant="outline" className="flex-1 bg-transparent" onClick={() => onComplete([])}>
            Pular
          </Button>
          <Button className="flex-1" onClick={handleComplete} disabled={selectedItems.length < 5}>
            Começar ({selectedItems.length}/5)
          </Button>
        </div>
      </Card>
    </div>
  )
}
