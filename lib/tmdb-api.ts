import type { MediaItem } from "./types";
import { getRandomUnchosenSelection, isDailyLimitReached } from "./daily-choices";

// TMDB API configuration
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || "1e6189fc9aa3a94fff0fc7073ffea01a";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const TMDB_DEFAULT_LANGUAGE = "pt-BR"; // Portuguese (Brazil)

// Types for TMDB responses
interface TmdbMovieOrSeries {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  genre_ids: number[];
  runtime?: number;
  episode_run_time?: number[];
  number_of_seasons?: number;
  number_of_episodes?: number;
}

interface TmdbGenre {
  id: number;
  name: string;
}

interface TmdbResponse {
  page: number;
  results: TmdbMovieOrSeries[];
  total_pages: number;
  total_results: number;
}

// Genre mapping from TMDB genre IDs to strings
const genreMap: Record<number, string> = {
  28: "Ação",
  12: "Aventura",
  16: "Animação",
  35: "Comédia",
  80: "Crime",
  99: "Documentário",
  18: "Drama",
  10751: "Família",
  14: "Fantasia",
  36: "História",
  27: "Horror",
  10402: "Música",
  9648: "Mistério",
  10749: "Romance",
  878: "Ficção Científica",
  10770: "Cinema TV",
  53: "Thriller",
  10752: "Guerra",
  37: "Faroeste",
  10759: "Ação & Aventura",
  10762: "Kids",
  10763: "News",
  10764: "Reality",
  10765: "Sci-Fi & Fantasy",
  10766: "Soap",
  10767: "Talk",
  10768: "War & Politics"
};

async function fetchFromTmdb(endpoint: string, params: Record<string, string> = {}) {
  const queryParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    language: TMDB_DEFAULT_LANGUAGE,
    ...params
  });
  
  const url = `${TMDB_BASE_URL}${endpoint}?${queryParams}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`TMDB API request failed: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Fetches popular movies and series from TMDB
 */
export async function fetchPopularContent(): Promise<MediaItem[]> {
  // Only check daily limit on client side
  if (typeof window !== 'undefined' && isDailyLimitReached()) {
    console.log("Daily limit reached, returning empty array");
    return [];
  }
  
  try {
    // Fetch popular movies and series
    const [moviesResponse, seriesResponse] = await Promise.all([
      fetchFromTmdb("/movie/popular", { page: String(Math.floor(Math.random() * 5) + 1) }),
      fetchFromTmdb("/tv/popular", { page: String(Math.floor(Math.random() * 5) + 1) })
    ]);

    const movies: TmdbMovieOrSeries[] = moviesResponse.results;
    const series: TmdbMovieOrSeries[] = seriesResponse.results;

    // Convert to MediaItem format
    const allItems = [
      ...movies.map(tmdbItemToMediaItem),
      ...series.map(tmdbItemToMediaItem)
    ];

    // Select random unchosen items respecting daily limit (only on client)
    return getRandomUnchosenSelection(allItems, 20);
  } catch (error) {
    console.error("Error fetching popular content from TMDB:", error);
    return [];
  }
}

/**
 * Fetches recommendations from TMDB based on user preferences
 */
export async function fetchTmdbRecommendations(genres: string[]): Promise<MediaItem[]> {
  // Only check daily limit on client side
  if (typeof window !== 'undefined' && isDailyLimitReached()) {
    console.log("Daily limit reached, returning empty array");
    return [];
  }
  
  try {
    // First, fetch all genres to map genre names to IDs
    const genreResponse = await fetchFromTmdb("/genre/movie/list");
    const movieGenres: TmdbGenre[] = genreResponse.genres;
    
    // Also get TV genres
    const tvGenreResponse = await fetchFromTmdb("/genre/tv/list");
    const tvGenres: TmdbGenre[] = tvGenreResponse.genres;
    
    // Combine both genre lists
    const allGenres = [...movieGenres, ...tvGenres];
    
    // Find genre IDs that match user preferences
    const userSelectedGenreIds: number[] = [];
    
    genres.forEach(pref => {
      const matchingGenre = allGenres.find(g => 
        g.name.toLowerCase() === pref.toLowerCase() || 
        g.name.toLowerCase().includes(pref.toLowerCase()) ||
        pref.toLowerCase().includes(g.name.toLowerCase())
      );
      
      if (matchingGenre && !userSelectedGenreIds.includes(matchingGenre.id)) {
        userSelectedGenreIds.push(matchingGenre.id);
      }
    });

    // Fetch content based on selected genre IDs
    let allRecommendations: MediaItem[] = [];
    
    if (userSelectedGenreIds.length > 0) {
      // Get movies by genre
      const genreIdsParam = userSelectedGenreIds.join(",");
      const movieResponse = await fetchFromTmdb("/discover/movie", {
        with_genres: genreIdsParam,
        sort_by: "popularity.desc",
        page: "1"
      });
      
      // Get series by genre
      const seriesResponse = await fetchFromTmdb("/discover/tv", {
        with_genres: genreIdsParam,
        sort_by: "popularity.desc",
        page: "1"
      });
      
      const movieResults: TmdbMovieOrSeries[] = movieResponse.results;
      const seriesResults: TmdbMovieOrSeries[] = seriesResponse.results;
      
      allRecommendations = [
        ...movieResults.map(tmdbItemToMediaItem),
        ...seriesResults.map(tmdbItemToMediaItem)
      ];
    } else {
      // If no specific genres match, get popular content
      allRecommendations = await fetchPopularContent();
    }

    // Select random unchosen items respecting daily limit (only on client)
    return getRandomUnchosenSelection(allRecommendations, 20);
  } catch (error) {
    console.error("Error fetching recommendations from TMDB:", error);
    return [];
  }
}

/**
 * Search for media by query
 */
export async function searchTmdbContent(query: string): Promise<MediaItem[]> {
  // Only check daily limit on client side
  if (typeof window !== 'undefined' && isDailyLimitReached()) {
    console.log("Daily limit reached, returning empty array");
    return [];
  }
  
  try {
    const [movieResponse, seriesResponse] = await Promise.all([
      fetchFromTmdb("/search/movie", { query }),
      fetchFromTmdb("/search/tv", { query })
    ]);

    const movies: TmdbMovieOrSeries[] = movieResponse.results;
    const series: TmdbMovieOrSeries[] = seriesResponse.results;

    const allSearchResults = [
      ...movies.map(tmdbItemToMediaItem),
      ...series.map(tmdbItemToMediaItem)
    ];

    // Select random unchosen items respecting daily limit (only on client)
    return getRandomUnchosenSelection(allSearchResults, 20);
  } catch (error) {
    console.error("Error searching TMDB:", error);
    return [];
  }
}

/**
 * Fetch details for a specific media item
 */
export async function fetchTmdbDetails(mediaType: "movie" | "tv", id: string): Promise<MediaItem | null> {
  try {
    const response = await fetchFromTmdb(`/${mediaType}/${id}`);
    return tmdbItemToMediaItem(response);
  } catch (error) {
    console.error("Error fetching TMDB details:", error);
    return null;
  }
}

/**
 * Maps TMDB item to our MediaItem format
 */
function tmdbItemToMediaItem(item: TmdbMovieOrSeries): MediaItem {
  const isMovie = !!item.title;
  
  // Map genre IDs to names
  const genres = item.genre_ids
    .map(id => genreMap[id])
    .filter(Boolean) as string[];
  
  // Determine year from release/air date
  const year = item.release_date 
    ? parseInt(item.release_date.split("-")[0]) 
    : item.first_air_date 
      ? parseInt(item.first_air_date.split("-")[0]) 
      : 0;

  return {
    id: String(item.id),
    type: isMovie ? "movie" : "series",
    title: item.title || item.name || "Título não disponível",
    description: item.overview || "Descrição não disponível",
    imageUrl: item.poster_path ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}` : "/placeholder-poster.jpg",
    rating: item.vote_average,
    year,
    genres,
    duration: item.runtime 
      ? `${item.runtime} min` 
      : item.episode_run_time && item.episode_run_time.length > 0 
        ? `${item.episode_run_time[0]} min/ep.` 
        : "",
    cast: undefined, // Would need additional API call to get cast details
    director: undefined, // Would need additional API call to get director
  };
}