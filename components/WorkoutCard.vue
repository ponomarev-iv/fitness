<template>
  <div class="bg-card p-4 rounded-lg shadow-md hover:bg-card-alt" @click="isExpanded = !isExpanded">
    <div class="flex justify-between items-start cursor-pointer">
      <div>
        <h3 class="text-lg font-bold text-primary">{{ workout.exercise.name }}</h3>
        <div class="text-sm text-text-secondary flex flex-wrap gap-x-4 gap-y-1">
          <span style="white-space: nowrap;">{{ workout.sets.length }} {{ setsPlural }}</span>
          <span v-if="displayTonnage > 0" class="font-bold" style="white-space: nowrap;">Тоннаж: {{ displayTonnage }} кг</span>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <button @click.stop="emit('edit', workout)" class="text-text-secondary hover:text-primary p-2 z-10">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"></path></svg>
        </button>
        <button @click.stop="emit('delete', workout.id)" class="text-red-500 hover:text-red-400 p-2 z-10">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        </button>
      </div>
    </div>
    <Transition name="slide">
      <div v-if="isExpanded" class="mt-4 overflow-hidden border border-gray-700 rounded-md">
        <div class="grid grid-cols-12 text-sm font-bold text-text-secondary bg-background-alt p-2 border-b border-gray-700">
          <span class="col-span-1">#</span>
          <span class="col-span-5">Повторы</span>
          <span class="col-span-6">Вес</span>
        </div>
        <div v-for="(set, index) in workout.sets" :key="index" class="grid grid-cols-12 items-center text-sm p-2" :class="{'border-b border-gray-700': index < workout.sets.length - 1}">
          <span class="text-text-secondary col-span-1">{{ index + 1 }}.</span>
          <span class="font-medium col-span-5">{{ set.reps }} повт.</span>
          <span v-if="workout.exercise.hasWeight" class="font-medium text-primary col-span-6">{{ set.weight }} кг</span>
        </div>
      </div>
    </Transition>
    <div class="flex justify-center mt-2">
      <svg class="w-6 h-6 text-primary transition-transform duration-300" :class="{ 'rotate-180': isExpanded }" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  workout: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['edit', 'delete']);
const isExpanded = ref(false);

const displayTonnage = computed(() => {
  if (props.workout.tonnage) {
    return props.workout.tonnage;
  }
  // Calculate tonnage from the first exercise's sets
  if (props.workout.exercise && props.workout.exercise.hasWeight) {
    return props.workout.sets.reduce((total, set) => total + (set.reps * set.weight), 0);
  }
  return 0;
});

const setsPlural = computed(() => {
  // Use the sets length from the first exercise
  const n = props.workout.sets.length;
  if (n % 10 === 1 && n % 100 !== 11) {
    return 'подход';
  }
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) {
    return 'подхода';
  }
  return 'подходов';
});

</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: max-height 0.2s ease-in-out;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
}

.slide-enter-to,
.slide-leave-from {
  max-height: 500px; /* Adjusted for potentially taller content */
}
</style>
