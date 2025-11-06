import { NextRequest } from 'next/server';
import { getGeminiPersonalizedRecommendations } from '@/lib/gemini-ai';
import { fetchPopularContent } from '@/lib/tmdb-api';
import { getRemainingChoices, isDailyLimitReached } from '@/lib/daily-choices';

// Mock user interaction data for testing
const mockUserHistory = [
  { itemId: "58841", action: "like" as const, timestamp: Date.now() - 10000 },
  { itemId: "1241982", action: "superlike" as const, timestamp: Date.now() - 20000 },
  { itemId: "71790", action: "dislike" as const, timestamp: Date.now() - 30000 },
];

export async function GET(request: NextRequest) {
  try {
    // Check if daily limit is reached
    if (isDailyLimitReached()) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Limite diário atingido",
          error: "Limite diário de 20 escolhas atingido. Volte amanhã.",
          remainingChoices: 0,
          tmdbContentCount: 0,
          geminiRecommendationsCount: 0
        }),
        { 
          status: 200, // Still return 200 but with success: false
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // First fetch content from TMDB
    const tmdbContent = await fetchPopularContent();
    
    // Then test Gemini integration
    const geminiRecommendations = await getGeminiPersonalizedRecommendations(
      ["Crime", "Drama", "Ação"], // Mock user preferences
      mockUserHistory,
      tmdbContent
    );
    
    const remaining = getRemainingChoices();
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "TMDB and Gemini integration working - Titles in Portuguese (Brazil)",
        tmdbContentCount: tmdbContent.length,
        geminiRecommendationsCount: geminiRecommendations.length,
        remainingChoices: remaining,
        sampleTmdbContent: tmdbContent.slice(0, 2),
        sampleGeminiRecommendations: geminiRecommendations.slice(0, 2)
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error in test API:', error);
    return new Response(
      JSON.stringify({ success: false, error: (error as Error).message }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}