import { NextRequest } from 'next/server';
import { fetchPopularContent } from '@/lib/tmdb-api';
import { getRemainingChoices, isDailyLimitReached } from '@/lib/daily-choices';

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
          data: [],
          count: 0
        }),
        { 
          status: 200, // Still return 200 but with success: false
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Test TMDB API integration
    const content = await fetchPopularContent();
    const remaining = getRemainingChoices();
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "TMDB API integration is working - Titles in Portuguese (Brazil)",
        data: content.slice(0, 5), // Return first 5 items as sample
        count: content.length,
        remainingChoices: remaining,
        sampleItem: content[0] || null
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