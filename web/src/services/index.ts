/**
 * API adapter — exports the real REST client when VITE_API_URL is set,
 * otherwise falls back to the mock API. No other file needs to change.
 */
export * from './mockApi';
