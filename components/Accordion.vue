<template>
  <div class="bg-card-alt rounded-lg">
    <button @click="toggle" class="w-full flex justify-between items-center py-2 px-3 text-lg text-white">
      <span>{{ title }}</span>
      <svg :class="{ 'transform rotate-180': isOpen }" class="w-6 h-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
    </button>
    <div :class="{ 'max-h-0': !isOpen, 'max-h-screen': isOpen }" class="overflow-hidden transition-all duration-300 ease-in-out">
      <div class="py-2 px-0">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
});

const isOpen = ref(false);

const toggle = () => {
  isOpen.value = !isOpen.value;
};
</script>
