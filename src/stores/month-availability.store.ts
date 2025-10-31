import { map } from "nanostores";
import { shared } from "@it-astro:request-nanostores";

// Pure type imports only - no runtime imports that could cause bundling issues
export interface DateAvailability {
  date: string;
  availableSlots: number;
  totalSlots: number;
  level: "high" | "medium" | "low" | "none";
}

export interface MonthData {
  availability: Record<string, DateAvailability>;
  unavailableDates: string[];
}

export interface MonthAvailabilityCache {
  [monthKey: string]: MonthData;
}

export interface MonthAvailabilityState {
  cache: MonthAvailabilityCache;
  currentMonth: Date;
  isLoading: boolean;
  lastUpdated: number;
}

// Create shared nanostore that works across SSR and client
export const $monthAvailabilityStore = shared(
  "monthAvailability",
  map<MonthAvailabilityState>({
    cache: {},
    currentMonth: new Date(),
    isLoading: false,
    lastUpdated: Date.now(),
  })
);

/**
 * Generate a cache key for a given month
 */
export function getMonthKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}`;
}

/**
 * Check if month data exists in cache
 */
export function hasMonthInCache(date: Date): boolean {
  const state = $monthAvailabilityStore.get();
  const monthKey = getMonthKey(date);
  return monthKey in state.cache;
}

/**
 * Get month data from cache
 */
export function getMonthFromCache(date: Date): MonthData | null {
  const state = $monthAvailabilityStore.get();
  const monthKey = getMonthKey(date);
  return state.cache[monthKey] || null;
}

/**
 * Set month data in cache
 */
export function setMonthInCache(date: Date, data: MonthData): void {
  const state = $monthAvailabilityStore.get();
  const monthKey = getMonthKey(date);

  $monthAvailabilityStore.set({
    ...state,
    cache: {
      ...state.cache,
      [monthKey]: data,
    },
    lastUpdated: Date.now(),
  });
}

/**
 * Set current month for navigation
 */
export function setCurrentMonth(date: Date): void {
  const state = $monthAvailabilityStore.get();
  $monthAvailabilityStore.set({
    ...state,
    currentMonth: date,
  });
}

/**
 * Set loading state
 */
export function setLoadingState(isLoading: boolean): void {
  const state = $monthAvailabilityStore.get();
  $monthAvailabilityStore.set({
    ...state,
    isLoading,
  });
}

/**
 * Initialize store with server-side data for current month
 */
export function initializeWithServerData(currentMonth: Date, data: MonthData): void {
  const monthKey = getMonthKey(currentMonth);

  $monthAvailabilityStore.set({
    cache: {
      [monthKey]: data,
    },
    currentMonth,
    isLoading: false,
    lastUpdated: Date.now(),
  });
}

/**
 * Clear month data from cache (for refresh)
 */
export function clearMonthFromCache(date: Date): void {
  const state = $monthAvailabilityStore.get();
  const monthKey = getMonthKey(date);
  const { [monthKey]: removed, ...restCache } = state.cache;

  $monthAvailabilityStore.set({
    ...state,
    cache: restCache,
  });
}

/**
 * Clear entire cache
 */
export function clearCache(): void {
  const state = $monthAvailabilityStore.get();
  $monthAvailabilityStore.set({
    ...state,
    cache: {},
    lastUpdated: Date.now(),
  });
}