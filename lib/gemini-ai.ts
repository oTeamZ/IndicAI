import type { MediaItem } from "./types";

// Interface for user interaction data
interface UserInteraction {
  itemId: string;
  action: "like" | "dislike" | "superlike" | "skip";
  timestamp: number;
}

/**
 * Interface for user profile data
 */
interface UserProfile {
  favoriteGenres: string[];
  viewingHistory: UserInteraction[];
  preferredLanguages?: string[];
  preferredDecades?: string[];
  dislikedGenres?: string[];
}

/**
 * Get personalized recommendations using Gemini AI
 * This function sends user preferences and history to Gemini,
 * which then suggests movies/series based on the user's profile
 */
export async function getGeminiPersonalizedRecommendations(
  userPreferences: string[],
  userHistory: UserInteraction[],
  tmdbRecommendations: MediaItem[]
): Promise<MediaItem[]> {
  try {
    // First, check if Gemini API key is available
    const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      console.warn("Gemini API key not found, falling back to TMDB recommendations");
      return tmdbRecommendations;
    }

    // Prepare user profile for Gemini
    const userProfile: UserProfile = {
      favoriteGenres: userPreferences,
      viewingHistory: userHistory.slice(-20), // Use last 20 interactions
      preferredDecades: getPreferredDecades(userHistory),
    };

    // Create a prompt for Gemini to suggest personalized recommendations
    const prompt = createGeminiRecommendationPrompt(userProfile, tmdbRecommendations);

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Extract the recommended content from Gemini's response
    const geminiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // Parse Gemini's response to get recommended item IDs
    const recommendedIds = parseGeminiResponse(geminiResponse, tmdbRecommendations);
    
    // Filter and sort TMDB recommendations based on Gemini's suggestions
    return recommendedIds
      .map(id => tmdbRecommendations.find(item => item.id === id))
      .filter((item): item is MediaItem => item !== undefined)
      .slice(0, 10); // Limit to 10 items
  } catch (error) {
    console.error("Error with Gemini recommendations:", error);
    // Fall back to regular TMDB recommendations
    return tmdbRecommendations;
  }
}

/**
 * Create a prompt for Gemini to generate personalized recommendations
 */
function createGeminiRecommendationPrompt(userProfile: UserProfile, tmdbRecommendations: MediaItem[]): string {
  // Get user's liked item genres from history
  const likedGenres = userProfile.viewingHistory
    .filter(item => item.action === "like" || item.action === "superlike")
    .map(item => {
      const tmdbItem = tmdbRecommendations.find(tm => tm.id === item.itemId);
      return tmdbItem ? tmdbItem.genres : [];
    })
    .flat();

  // Get commonly liked genres
  const genreCounts: Record<string, number> = {};
  likedGenres.forEach(genre => {
    genreCounts[genre] = (genreCounts[genre] || 0) + 1;
  });
  
  const topGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([genre]) => genre);

  // Format preferences for the prompt
  const preferences = {
    favoriteGenres: userProfile.favoriteGenres,
    topLikedGenres: topGenres,
    preferredDecades: userProfile.preferredDecades || [],
    recentActivity: userProfile.viewingHistory.slice(-10).map(item => ({
      itemId: item.itemId,
      action: item.action
    }))
  };

  return `
Você é um especialista em recomendação de filmes e séries altamente personalizado. 
Sua tarefa é sugerir conteúdos com base no perfil do usuário e seus gostos.

PERFIL DO USUÁRIO:
- Gêneros favoritos: ${preferences.favoriteGenres.join(", ")}
- Gêneros mais curtidos recentemente: ${preferences.topLikedGenres.join(", ")}
- Décadas preferidas: ${preferences.preferredDecades.join(", ")}

ATIVIDADE RECENTE (últimos 10):
${preferences.recentActivity.map(item => `- ID ${item.itemId}: ${item.action}`).join("\n")}

LISTA DE CONTEÚDOS DISPONÍVEIS (com ID, título e gêneros):
${tmdbRecommendations.slice(0, 20).map(item => 
  `- ID: ${item.id}, Título: ${item.title}, Gêneros: ${item.genres.join(", ")}`
).join("\n")}

INSTRUÇÕES:
1. Analise os padrões dos gostos do usuário com base na atividade recente e preferências
2. Identifique quais itens da lista combinam melhor com os gostos e preferências do usuário
3. Retorne apenas os IDs dos 10 itens que mais provavelmente seriam apreciados pelo usuário
4. Priorize itens que compartilhem gêneros com o histórico de likes do usuário
5. Considere também a diversidade para manter o perfil de recomendações interessante

FORMATO DE RESPOSTA:
Apenas uma lista com os IDs dos itens recomendados, um por linha, sem explicações adicionais:

`;
}

/**
 * Parse Gemini's response to extract recommended item IDs
 */
function parseGeminiResponse(response: string, availableItems: MediaItem[]): string[] {
  try {
    // Extract IDs from the response (they should be in the format of numbers)
    const idMatches = response.match(/\b\d+\b/g) || [];
    
    // Filter to only include IDs that are actually available in the TMDB results
    const validIds = idMatches.filter(id => 
      availableItems.some(item => item.id === id)
    );
    
    // Return unique IDs, limited to 10
    return [...new Set(validIds)].slice(0, 10);
  } catch (error) {
    console.error("Error parsing Gemini response:", error);
    // If parsing fails, return a random selection of the available items
    return availableItems
      .sort(() => 0.5 - Math.random())
      .slice(0, 10)
      .map(item => item.id);
  }
}

/**
 * Extract preferred decades from user history
 */
function getPreferredDecades(userHistory: UserInteraction[]): string[] {
  // This would require additional logic to get actual release years of items
  // For now, we'll return an empty array
  return [];
}