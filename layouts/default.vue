<template>
  <div class="bg-background text-text-primary min-h-screen">
    <div v-if="!isAuthPage" class="fixed top-0 left-0 w-screen h-screen z-0">
      <div class="absolute top-0 left-0 w-full h-full bg-black bg-opacity-80"></div>
      <img :src="currentImage" class="w-full h-full object-cover" />
    </div>
    <div class="relative z-10">
      <!-- Main Content -->
      <main class="p-4 pb-20">
        <slot />
      </main>

      <!-- Bottom Navigation Bar -->
      <BottomNavBar class="fixed bottom-0 left-0 w-full" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import BottomNavBar from '~/components/BottomNavBar.vue';

const route = useRoute();
const isAuthPage = computed(() => route.name === 'login' || route.name === 'register');

const images = [
  '/backgrounds/gym1.jpg',
  '/backgrounds/gym2.jpg',
  '/backgrounds/gym3.jpg',
  '/backgrounds/gym4.jpg',
  '/backgrounds/gym5.jpg',
  '/backgrounds/gym6.jpg',
  '/backgrounds/gym7.jpg',
  '/backgrounds/gym8.jpg',
  '/backgrounds/gym9.jpg',
  '/backgrounds/gym10.jpg',
];

const currentImage = ref('');
let intervalId = null;

const changeImage = () => {
  const randomIndex = Math.floor(Math.random() * images.length);
  currentImage.value = images[randomIndex];
};

onMounted(() => {
  if (!isAuthPage.value) {
    changeImage();
    intervalId = setInterval(changeImage, 60000); // Change image every minute
  }
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<style>
  /* Global styles can remain here */
</style>
