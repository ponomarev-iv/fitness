<template>
  <div class="space-y-8">
    <h1 class="text-3xl font-bold text-primary">Ваш профиль</h1>
    <div class="w-full max-w-2xl p-8 space-y-6 bg-card rounded-lg">
      <form @submit.prevent="handleSaveProfile" class="space-y-6">
        <div>
          <label for="name" class="text-sm font-medium text-text-secondary">Имя</label>
          <input
            type="text"
            id="name"
            class="w-full px-3 py-2 mt-1 text-text-primary bg-background border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            v-model="name"
          />
        </div>
        <div>
          <label for="email" class="text-sm font-medium text-text-secondary">Почта</label>
          <input
            type="email"
            id="email"
            class="w-full px-3 py-2 mt-1 text-text-primary bg-background border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            :value="authStore.user?.email"
            disabled
          />
        </div>
        <div>
          <label for="password" class="text-sm font-medium text-text-secondary">Новый пароль</label>
          <input
            type="password"
            id="password"
            class="w-full px-3 py-2 mt-1 text-text-primary bg-background border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Оставьте пустым, чтобы не менять"
          />
        </div>
        <div class="flex justify-end space-x-4">
           <button
            @click="handleLogout"
            type="button"
            class="px-4 py-3 font-bold text-white bg-red-600 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Выйти
          </button>
          <button
            type="submit"
            class="px-4 py-3 font-bold text-white bg-primary rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Сохранить
          </button>
        </div>      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthFetch } from '~/composables/useAuthFetch';
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';

definePageMeta({
  requiresAuth: true,
});

const authStore = useAuthStore();
const router = useRouter();

const name = ref(authStore.user?.name || '');

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

const handleSaveProfile = async () => {
  try {
    const response = await useAuthFetch('/api/auth/profile', {
      method: 'PUT',
      body: { name: name.value },
    });

    if (response.error.value) {
      throw new Error(response.error.value.data.message || 'Ошибка при сохранении профиля');
    }

    authStore.user.name = name.value;
    alert('Профиль успешно обновлен!');
  } catch (error) {
    alert(error.message);
  }
};
</script>
