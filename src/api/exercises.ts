const BASE_URL = 'https://api.exerciseapi.dev/v1';
const API_KEY = import.meta.env.VITE_EXERCISE_API_KEY;
const CACHE_TTL = 24 * 60 * 60 * 1000;

export interface Exercise {
  id: string;
  name: string;
  category: string;
  level: string;
  primaryMuscles: string[];
  secondaryMuscles?: string[];
  equipment?: string;
  instructions?: string[];
  overview?: string;
  images?: string[];
  videos?: { url: string; aspectRatio: string }[];
}

export interface MuscleGroup {
  displayGroup: string;
  muscles: string[];
}

export async function getMuscles() {
  return fetchWithCache<{ data: MuscleGroup[] }>('/muscles');
}

interface CacheEntry<T> {
  timestamp: number;
  data: T;
}

async function fetchWithCache<T>(endpoint: string): Promise<T> {
  const cacheKey = `exercise_api_cache:${endpoint}`;

  const cachedRaw = localStorage.getItem(cacheKey);
  if (cachedRaw) {
    try {
      const cached: CacheEntry<T> = JSON.parse(cachedRaw);
      const isFresh = Date.now() - cached.timestamp < CACHE_TTL;
      if (isFresh) {
        return cached.data;
      }
    } catch {
      localStorage.removeItem(cacheKey);
    }
  }

  if (!API_KEY) {
    throw new Error('VITE_EXERCISE_API_KEY was not found in the .env file.');
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Error API (${response.status}): ${response.statusText}`);
  }

  const data: T = await response.json();

  try {
    const entry: CacheEntry<T> = { timestamp: Date.now(), data };
    localStorage.setItem(cacheKey, JSON.stringify(entry));
  } catch {
    // Ignore localStorage quota errors
  }

  return data;
}

export async function getExercises(params?: Record<string, string>) {
  const query = params ? `?${new URLSearchParams(params).toString()}` : '';
  return fetchWithCache<{ data: Exercise[] } | Exercise[]>(`/exercises${query}`);
}

export async function getExerciseById(id: string) {
  return fetchWithCache<Exercise>(`/exercises/${id}`);
}
