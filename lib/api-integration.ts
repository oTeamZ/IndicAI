import type { MediaItem } from "@/lib/types";
import { fetchTmdbRecommendations, searchTmdbContent, fetchTmdbDetails, fetchPopularContent } from "./tmdb-api";
import { getRandomUnchosenSelection } from "./daily-choices";

// Interface para interações do usuário (necessário para atualizar o perfil)
interface UserInteraction {
  itemId: string;
  action: "like" | "dislike" | "superlike" | "skip";
  timestamp: number;
}

/**
 * Interface para o perfil do usuário
 */
interface UserProfile {
  favorite_genres: string[];
  favorite_directors?: string[];
  favorite_actors?: string[];
  preferred_decades?: string[];
  disliked_genres?: string[];
  viewing_history?: UserInteraction[];
}

/**
 * Busca recomendações na API TMDB baseado no perfil do usuário
 */
export async function fetchRecommendationsFromApi(userPreferences: string[]): Promise<MediaItem[]> {
  try {
    // Utiliza a nova integração com TMDB
    const recommendations = await fetchTmdbRecommendations(userPreferences);
    return recommendations;
  } catch (error) {
    console.error("Error fetching recommendations from TMDB API:", error);
    return [];
  }
}

/**
 * Busca itens de mídia por título
 */
export async function searchMediaFromApi(query: string): Promise<MediaItem[]> {
  try {
    // Utiliza a nova integração com TMDB
    const results = await searchTmdbContent(query);
    return results;
  } catch (error) {
    console.error("Error searching media from TMDB API:", error);
    return [];
  }
}

/**
 * Busca detalhes de um item específico
 */
export async function getMediaDetailsFromApi(id: string): Promise<MediaItem | null> {
  try {
    // Determinar se é filme ou série (necessário para chamar o endpoint correto)
    // Por simplicidade, vamos tentar primeiro como filme e depois série
    let details = await fetchTmdbDetails("movie", id);
    
    if (!details) {
      details = await fetchTmdbDetails("tv", id);
    }
    
    return details;
  } catch (error) {
    console.error("Error fetching media details from TMDB API:", error);
    return null;
  }
}

/**
 * Função para converter os dados mockados em um formato similar ao da API
 */
export function convertToApiFormat(mockItems: MediaItem[]): any[] {
  return mockItems.map(item => ({
    id: item.id,
    title: item.title,
    original_title: item.title,
    description: item.description,
    rating: item.rating,
    year: item.year,
    duration: item.duration,
    genres: item.genres,
    poster_url: item.imageUrl,
    backdrop_url: "",
    imdb_id: "",
    director: item.director,
    cast: item.cast,
    source: "mock",
    type: item.type
  }));
}