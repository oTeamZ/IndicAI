"use client"

import { useState } from "react"
import { DiscoverTab } from "@/components/discover-tab"
import { RecommendationsTab } from "@/components/recommendations-tab"
import { SuperStarTab } from "@/components/superstar-tab"
import { ProfileTab } from "@/components/profile-tab"
import { OnboardingModal } from "@/components/onboarding-modal"
import { Sparkles, TrendingUp, User, Flame } from "lucide-react"
import { useUserPreferences } from "@/hooks/use-user-preferences"

type Tab = "discover" | "recommendations" | "superstar" | "profile"

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("discover")
  const [showOnboarding, setShowOnboarding] = useState(true)
  const { preferences: userPreferences, updatePreferences, addInteraction } = useUserPreferences();

  const handleOnboardingComplete = (preferences: string[]) => {
    updatePreferences(preferences)
    setShowOnboarding(false)
  }

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-2">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C10.9 2 10 2.9 10 4C10 5.1 10.9 6 12 6C13.1 6 14 5.1 14 4C14 2.9 13.1 2 12 2Z" fill="currentColor"/>
                <path d="M12 8C10.34 8 9 9.34 9 11V13H15V11C15 9.34 13.66 8 12 8Z" fill="currentColor"/>
                <path d="M12 14C10.9 14 10 14.9 10 16V18H14V16C14 14.9 13.1 14 12 14Z" fill="currentColor"/>
                <path d="M8 16H6V18H8V20H10V18H12V16H10V14H8V16Z" fill="currentColor"/>
                <path d="M18 16H16V18H18V20H20V18H22V16H20V14H18V16Z" fill="currentColor"/>
                <path d="M12 20H14V22H12V24H10V22H8V20H12Z" fill="currentColor"/>
              </svg>
              indicAI
            </h1>
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {activeTab === "discover" && <DiscoverTab userPreferences={userPreferences} onUpdatePreferences={updatePreferences} addInteraction={addInteraction} />}
        {activeTab === "recommendations" && <RecommendationsTab userPreferences={userPreferences} onUpdatePreferences={updatePreferences} />}
        {activeTab === "superstar" && <SuperStarTab />}
        {activeTab === "profile" && <ProfileTab userPreferences={userPreferences} />}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <button
              onClick={() => setActiveTab("discover")}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                activeTab === "discover" ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Flame className="w-6 h-6" />
              <span className="text-xs font-medium">Descobrir</span>
            </button>
            <button
              onClick={() => setActiveTab("recommendations")}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                activeTab === "recommendations"
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sparkles className="w-6 h-6" />
              <span className="text-xs font-medium">Para Você</span>
            </button>
            <button
              onClick={() => setActiveTab("superstar")}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                activeTab === "superstar" ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <TrendingUp className="w-6 h-6" />
              <span className="text-xs font-medium">SuperStar</span>
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                activeTab === "profile" ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className="w-6 h-6" />
              <span className="text-xs font-medium">Perfil</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Onboarding Modal */}
      {showOnboarding && <OnboardingModal onComplete={handleOnboardingComplete} />}
    </main>
  )
}
