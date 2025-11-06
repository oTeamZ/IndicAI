import type { MediaItem } from "./types";

// Constants
const DAILY_LIMIT = 20;

interface ChosenItem {
  id: string;
  timestamp: number;
}

// Client-side only functionality
function isClientSide(): boolean {
  return typeof window !== 'undefined';
}

function getLocalStorage(): Storage | null {
  return isClientSide() ? window.localStorage : null;
}

function getCurrentDate(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function shouldResetDailyCount(): boolean {
  if (!isClientSide()) return false;
  
  const localStorage = getLocalStorage();
  if (!localStorage) return false;
  
  const LAST_RESET_DATE_KEY = "indicai_last_reset_date";
  const lastResetDate = localStorage.getItem(LAST_RESET_DATE_KEY);
  const today = getCurrentDate();
  return lastResetDate !== today;
}

function resetDailyCountIfNeeded(): void {
  if (!isClientSide()) return;
  
  const localStorage = getLocalStorage();
  if (!localStorage) return;
  
  if (shouldResetDailyCount()) {
    const CHOSEN_TODAY_KEY = "indicai_chosen_today";
    const LAST_RESET_DATE_KEY = "indicai_last_reset_date";
    
    localStorage.removeItem(CHOSEN_TODAY_KEY);
    localStorage.setItem(LAST_RESET_DATE_KEY, getCurrentDate());
  }
}

/**
 * Gets the list of chosen items for today (client-side only)
 * On server-side, returns empty array
 */
export function getChosenItemsToday(): ChosenItem[] {
  if (!isClientSide()) {
    // On server-side, return empty array
    return [];
  }
  
  resetDailyCountIfNeeded();
  
  const localStorage = getLocalStorage();
  if (!localStorage) return [];
  
  const CHOSEN_TODAY_KEY = "indicai_chosen_today";
  const chosenItemsStr = localStorage.getItem(CHOSEN_TODAY_KEY);
  if (!chosenItemsStr) {
    return [];
  }
  
  try {
    return JSON.parse(chosenItemsStr);
  } catch (e) {
    console.error("Error parsing chosen items from localStorage", e);
    return [];
  }
}

/**
 * Adds an item to today's chosen list (client-side only)
 * On server-side, returns true (no-op)
 */
export function addChosenItem(id: string): boolean {
  if (!isClientSide()) {
    // On server-side, return true to allow operation
    return true;
  }
  
  resetDailyCountIfNeeded();
  
  const localStorage = getLocalStorage();
  if (!localStorage) return true;
  
  const chosenItems = getChosenItemsToday();
  
  // Check if we've reached the daily limit
  if (chosenItems.length >= DAILY_LIMIT) {
    return false; // Daily limit reached
  }
  
  // Check if item is already chosen today
  const alreadyChosen = chosenItems.some(item => item.id === id);
  if (alreadyChosen) {
    return true; // Item already chosen, but limit not reached
  }
  
  // Add the new item
  const newChosenItem: ChosenItem = {
    id,
    timestamp: Date.now()
  };
  
  const updatedChosenItems = [...chosenItems, newChosenItem];
  const CHOSEN_TODAY_KEY = "indicai_chosen_today";
  localStorage.setItem(CHOSEN_TODAY_KEY, JSON.stringify(updatedChosenItems));
  
  return true;
}

/**
 * Gets remaining choices for today (client-side only)
 * On server-side, returns the full daily limit
 */
export function getRemainingChoices(): number {
  if (!isClientSide()) {
    // On server-side, return full limit to allow operation
    return DAILY_LIMIT;
  }
  
  resetDailyCountIfNeeded();
  const chosenItems = getChosenItemsToday();
  return Math.max(0, DAILY_LIMIT - chosenItems.length);
}

/**
 * Checks if the daily limit has been reached (client-side only)
 * On server-side, returns false
 */
export function isDailyLimitReached(): boolean {
  if (!isClientSide()) {
    // On server-side, return false to allow operation
    return false;
  }
  
  return getRemainingChoices() <= 0;
}

/**
 * Filters out already chosen items from a list
 * On server-side, returns the original list
 */
export function filterOutChosenItems(items: MediaItem[]): MediaItem[] {
  if (!isClientSide()) {
    // On server-side, return all items (no filtering)
    return items;
  }
  
  const chosenItems = getChosenItemsToday();
  const chosenIds = new Set(chosenItems.map(item => item.id));
  
  return items.filter(item => !chosenIds.has(item.id));
}

/**
 * Gets a random selection of unchosen items respecting the daily limit
 * On server-side, returns shuffled selection without filtering
 */
export function getRandomUnchosenSelection(items: MediaItem[], count: number): MediaItem[] {
  if (!isClientSide()) {
    // On server-side, return random selection without daily limit
    const shuffled = [...items].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, items.length));
  }

  // Filter out already chosen items
  const unchosenItems = filterOutChosenItems(items);
  
  // Limit to the number of remaining choices
  const remainingChoices = getRemainingChoices();
  const maxSelectable = Math.min(count, remainingChoices);
  
  // If we can't select any more items today, return empty array
  if (maxSelectable <= 0) {
    return [];
  }
  
  // Randomly shuffle and select
  const shuffled = [...unchosenItems].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, maxSelectable);
}