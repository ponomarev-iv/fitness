<template>
  <div class="fixed z-40 bottom-0 left-0 right-0 bg-card border-t border-gray-800">
    <nav class="flex justify-around items-center h-16">
      <NuxtLink to="/" class="flex flex-col items-center justify-center text-text-secondary hover:text-primary">
        <!-- Home Icon -->
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
        <span class="text-xs">Главная</span>
      </NuxtLink>
      <NuxtLink to="/history" class="flex flex-col items-center justify-center text-text-secondary hover:text-primary">
        <!-- History Icon (e.g., Calendar) -->
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        <span class="text-xs">История</span>
      </NuxtLink>
      <NuxtLink to="/profile" class="flex flex-col items-center justify-center text-text-secondary hover:text-primary">
        <!-- Profile Icon -->
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
        <span class="text-xs">Профиль</span>
      </NuxtLink>
    </nav>
  </div>
</template>

<style>
/* Add a class to NuxtLink when it is active */
.router-link-exact-active {
  color: #FF8A00; /* primary color */
}
</style>
