
import { useAuthStore } from '~/stores/auth';
import type { UseFetchOptions } from '#app';

// A helper function to define options with Authorization header
function createAuthOptions<T>(options: UseFetchOptions<T> = {}): UseFetchOptions<T> {
  const authStore = useAuthStore();

  // Create a new options object to avoid modifying the original
  const authOptions: UseFetchOptions<T> = { ...options };

  // Ensure headers is an object
  authOptions.headers = { ...authOptions.headers };

  // Directly add the Authorization header if a token exists
  if (authStore.token) {
    authOptions.headers.Authorization = `Bearer ${authStore.token}`;
  }

  // Explicitly set Content-Type and stringify body for POST/PUT/DELETE requests if body is an object
  if (authOptions.body && typeof authOptions.body === 'object' && (authOptions.method === 'POST' || authOptions.method === 'PUT' || authOptions.method === 'DELETE')) {
    authOptions.headers['Content-Type'] = 'application/json';
    authOptions.body = JSON.stringify(authOptions.body);
  }

  return authOptions;
}

/**
 * A wrapper around useFetch that automatically adds the Authorization header.
 * @param url The URL to fetch.
 * @param options The options for useFetch.
 */
export const useAuthFetch = <T>(url: string, options: UseFetchOptions<T> = {}) => {
  return useFetch<T>(url, createAuthOptions(options));
};

/**
 * A wrapper around useLazyFetch that automatically adds the Authorization header.
 * @param url The URL to fetch.
 * @param options The options for useLazyFetch.
 */
export const useLazyAuthFetch = <T>(url: string | (() => string), options: UseFetchOptions<T> = {}) => {
  return useLazyFetch<T>(url, createAuthOptions(options));
};


