<template>
  <div class="flex items-center justify-center min-h-screen bg-background">
    <div class="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-md">
      <h1 class="text-2xl font-bold text-center text-primary">Вход</h1>
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="email" class="text-sm font-medium text-text-secondary">Почта</label>
          <input
            v-model="email"
            type="email"
            id="email"
            class="w-full px-3 py-2 mt-1 text-text-primary bg-background border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label for="password" class="text-sm font-medium text-text-secondary">Пароль</label>
          <input
            v-model="password"
            type="password"
            id="password"
            class="w-full px-3 py-2 mt-1 text-text-primary bg-background border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="••••••••"
            required
          />
        </div>
        <div v-if="errorMessage" class="text-red-500 text-sm">
          {{ errorMessage }}
        </div>
        <div>
          <button
            type="submit"
            class="w-full px-4 py-3 font-bold text-white bg-primary rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Войти
          </button>
        </div>
      </form>
      <p class="text-center text-xs text-text-secondary opacity-75 mt-4">
        Продолжая пользоваться приложением, вы соглашаетесь с использованием локального хранилища и файлов cookie для сохранения ваших данных.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';

// Define layout for this page
definePageMeta({
  layout: false, // Do not use the default layout with the sidebar
});

const authStore = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const errorMessage = ref(null);

const handleLogin = async () => {
  try {
    errorMessage.value = null;
    await authStore.login({ email: email.value, password: password.value });
    router.push('/');
  } catch (error) {
    errorMessage.value = error.message;
  }
};
</script>
