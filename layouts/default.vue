<template>
  <div class="bg-background text-text-primary min-h-screen">
    <!-- Main Content -->
    <main class="p-4 pb-20">
      <slot />
    </main>

    <!-- Bottom Navigation Bar -->
    <BottomNavBar />
  </div>
</template>

<script setup>
import BottomNavBar from '~/components/BottomNavBar.vue';
</script>

<style>
  /* Global styles can remain here */
</style>
