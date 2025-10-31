import { useAuthStore } from '~/stores/auth';

export default defineNuxtPlugin((nuxtApp) => {
  // Initialize the auth store
  const authStore = useAuthStore();
  authStore.init();

  // Create a global fetch interceptor
  const ofetch = $fetch.create({
    onRequest({ request, options }) {
      const authStore = useAuthStore();
      const token = authStore.token;

      if (token) {
        options.headers = options.headers || {};
        options.headers.Authorization = `Bearer ${token}`;
      }
    },
    onResponseError({ request, response, options }) {
      if (response.status === 401) {
        const authStore = useAuthStore();
        authStore.logout();
        // Optionally, redirect to login page
        // navigateTo('/login');
      }
    }
  });

  // Make the interceptor available globally
  nuxtApp.provide('ofetch', ofetch);
});
