import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  const requiresAuth = to.meta.requiresAuth;

  // If the route requires authentication and the user is not logged in
  if (requiresAuth && !authStore.isAuthenticated) {
    // Redirect to the register page
    return navigateTo('/register');
  }

  // If the user is logged in and tries to access login or register pages
  if (authStore.isAuthenticated && (to.path === '/login' || to.path === '/register')) {
    // Redirect to the home page
    return navigateTo('/');
  }
});
