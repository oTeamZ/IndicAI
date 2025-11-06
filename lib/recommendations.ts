import type { MediaItem } from "./types";
import { fetchTmdbRecommendations, searchTmdbContent, fetchTmdbDetails, fetchPopularContent } from "./tmdb-api";
import { getGeminiPersonalizedRecommendations } from "./gemini-ai";

// Import user interaction type
interface UserInteraction {
  itemId: string;
  action: "like" | "dislike" | "superlike" | "skip";
  timestamp: number;
}

/**
 * Função principal para obter recomendações personalizadas
 * Combina TMDB API com IA Gemini para recomendações personalizadas
 */
export async function getPersonalizedRecommendations(
  userPreferences: string[],
  userHistory: UserInteraction[] = []
): Promise<MediaItem[]> {
  try {
    // Primeiro, busca conteúdo da API TMDB baseado nas preferências do usuário
    let tmdbRecommendations = await fetchTmdbRecommendations(userPreferences);
    
    // Se não encontrar recomendações com gêneros específicos, busca conteúdo popular
    if (tmdbRecommendations.length === 0) {
      tmdbRecommendations = await fetchPopularContent();
    }
    
    // Se ainda não tiver conteúdo, usa fallback para dados mockados
    if (tmdbRecommendations.length === 0) {
      const { mockMediaItems } = await import('./mock-data');
      // Use apenas items that haven't been chosen today
      const { getRandomUnchosenSelection } = await import('./daily-choices');
      return getRandomUnchosenSelection(mockMediaItems, 10);
    }
    
    // Usa Gemini para personalizar ainda mais as recomendações com base no histórico do usuário
    const geminiRecommendations = await getGeminiPersonalizedRecommendations(
      userPreferences,
      userHistory,
      tmdbRecommendations
    );
    
    // Se Gemini não retornar recomendações, usa as do TMDB
    const finalRecommendations = geminiRecommendations.length > 0 ? geminiRecommendations : tmdbRecommendations;
    
    // Apply daily limit and selection
    const { getRandomUnchosenSelection } = await import('./daily-choices');
    return getRandomUnchosenSelection(finalRecommendations, 10);
  } catch (error) {
    console.error("Error in getPersonalizedRecommendations:", error);
    
    // Fallback para dados mockados em caso de erro
    const { mockMediaItems } = await import('./mock-data');
    const { getRandomUnchosenSelection } = await import('./daily-choices');
    return getRandomUnchosenSelection(mockMediaItems, 10);
  }
}

/**
 * Função para buscar itens de mídia
 */
export async function searchMedia(query: string): Promise<MediaItem[]> {
  try {
    // Busca conteúdo da API TMDB
    const apiResults = await searchTmdbContent(query);
    
    // Se a API não retornar resultados, faz fallback para busca nos dados mockados
    if (apiResults.length === 0) {
      const { mockMediaItems } = await import('./mock-data');
      const mockResults = mockMediaItems.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase())
      );
      
      // Apply daily limit to mock results
      const { getRandomUnchosenSelection } = await import('./daily-choices');
      return getRandomUnchosenSelection(mockResults, 10);
    }
    
    // Apply daily limit to API results
    const { getRandomUnchosenSelection } = await import('./daily-choices');
    return getRandomUnchosenSelection(apiResults, 10);
  } catch (error) {
    console.error("Error in searchMedia:", error);
    
    // Fallback para dados mockados em caso de erro
    const { mockMediaItems } = await import('./mock-data');
    const filteredResults = mockMediaItems.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase())
    );
    const { getRandomUnchosenSelection } = await import('./daily-choices');
    return getRandomUnchosenSelection(filteredResults, 10);
  }
}

/**
 * Função para obter detalhes de um item específico
 */
export async function getMediaDetails(id: string): Promise<MediaItem | null> {
  try {
    // Tenta buscar da API TMDB primeiro
    // Need to determine if it's a movie or TV show to call the right endpoint
    // For now, we'll need to try both or have type information passed in
    // As a fallback, we can search by ID in TMDB and determine type
    
    // Since we don't have the type, let's try to get the details from TMDB
    // by attempting to fetch as both movie and TV show
    let details: MediaItem | null = null;
    
    // Try both movie and TV endpoints to find the content
    try {
      details = await fetchTmdbDetails("movie", id);
      if (!details) {
        details = await fetchTmdbDetails("tv", id);
      }
    } catch (error) {
      console.error("Error fetching from TMDB:", error);
    }
    
    if (details) {
      return details;
    }
    
    // Se a API TMDB não retornar resultados, faz fallback para os dados mockados
    const { mockMediaItems } = await import('./mock-data');
    const mockResult = mockMediaItems.find(item => item.id === id);
    
    return mockResult || null;
  } catch (error) {
    console.error("Error in getMediaDetails:", error);
    
    // Fallback para dados mockados em caso de erro
    const { mockMediaItems } = await import('./mock-data');
    return mockMediaItems.find(item => item.id === id) || null;
  }
}

/**
 * Atualiza o perfil do usuário com base nas interações para melhorar recomendações futuras
 */
export function updateUserProfile(
  currentPreferences: string[],
  interaction: { 
    itemId: string; 
    action: "like" | "dislike" | "superlike" | "skip" 
  },
  allMediaItems: MediaItem[] = [] // Pass all available media items to get genre information
): string[] {
  // Find the item in the available media items to get its genres
  const item = allMediaItems.find(m => m.id === interaction.itemId);
  
  let newPreferences = [...currentPreferences];
  
  // Atualiza as preferências baseado na ação e no item curtido
  if (interaction.action === "like" || interaction.action === "superlike") {
    // Adiciona os gêneros do item curtido às preferências
    if (item) {
      for (const genre of item.genres) {
        if (!newPreferences.includes(genre)) {
          newPreferences.push(genre);
        }
      }
    }
  } else if (interaction.action === "dislike") {
    // Pode-se implementar lógica para remover gêneros descurtidos
    // Por enquanto, não fazemos nada
  }
  
  // Remove duplicatas
  newPreferences = [...new Set(newPreferences)];
  
  // Limitar a 15 preferências para não sobrecarregar o sistema
  return newPreferences.slice(0, 15);
}