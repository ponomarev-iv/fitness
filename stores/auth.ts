import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    user: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    init() {
      if (process.client) {
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('authUser');
        if (storedToken && storedUser) {
          this.token = storedToken;
          this.user = JSON.parse(storedUser);
        }
      }
    },
    async login(credentials) {
      try {
        const response = await $fetch('/api/auth/login', {
          method: 'POST',
          body: credentials,
        });
        this.token = response.token;
        this.user = response.user;
        if (process.client) {
          localStorage.setItem('authToken', this.token);
          localStorage.setItem('authUser', JSON.stringify(this.user));
        }
      } catch (error) {
        console.error('Login failed:', error);
        // Optionally, handle the error in the UI
      }
    },
    async register(credentials) {
      try {
        const response = await $fetch('/api/auth/register', {
          method: 'POST',
          body: credentials,
        });
        this.token = response.token;
        this.user = response.user;
        if (process.client) {
          localStorage.setItem('authToken', this.token);
          localStorage.setItem('authUser', JSON.stringify(this.user));
        }
      } catch (error) {
        console.error('Registration failed:', error);
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      if (process.client) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      }
    },
    updateUser(newUser) {
      this.user = newUser;
      if (process.client) {
        localStorage.setItem('authUser', JSON.stringify(this.user));
      }
    },
  },
});
