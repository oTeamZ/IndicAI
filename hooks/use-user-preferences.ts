import { useState, useEffect } from 'react';

const USER_PREFERENCES_KEY = 'indicai_user_preferences';
const USER_HISTORY_KEY = 'indicai_user_history';

interface UserInteraction {
  itemId: string;
  action: 'like' | 'dislike' | 'superlike' | 'skip';
  timestamp: number;
}

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<string[]>([]);
  const [history, setHistory] = useState<UserInteraction[]>([]);

  // Carrega preferências do localStorage ao iniciar
  useEffect(() => {
    const savedPreferences = localStorage.getItem(USER_PREFERENCES_KEY);
    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences));
      } catch (e) {
        console.error('Error loading preferences from localStorage', e);
      }
    }

    const savedHistory = localStorage.getItem(USER_HISTORY_KEY);
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error loading history from localStorage', e);
      }
    }
  }, []);

  // Salva preferências no localStorage quando mudam
  useEffect(() => {
    localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(preferences));
  }, [preferences]);

  // Salva histórico no localStorage quando muda
  useEffect(() => {
    localStorage.setItem(USER_HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const updatePreferences = (newPreferences: string[]) => {
    // Remove duplicatas e limita a 15 preferências
    const uniquePrefs = [...new Set(newPreferences)].slice(0, 15);
    setPreferences(uniquePrefs);
  };

  const addInteraction = (interaction: UserInteraction) => {
    setHistory(prev => {
      // Limita o histórico a 1000 interações
      const newHistory = [interaction, ...prev].slice(0, 1000);
      return newHistory;
    });
  };

  const getUserStats = () => {
    const likes = history.filter(h => h.action === 'like' || h.action === 'superlike').length;
    const dislikes = history.filter(h => h.action === 'dislike').length;
    const skips = history.filter(h => h.action === 'skip').length;
    
    return {
      likes,
      dislikes,
      skips,
      totalInteractions: likes + dislikes + skips,
      likeRatio: likes > 0 ? likes / (likes + dislikes) : 0
    };
  };

  return {
    preferences,
    history,
    updatePreferences,
    addInteraction,
    getUserStats
  };
}