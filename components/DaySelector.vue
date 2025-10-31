<template>
  <div class="flex space-x-2 p-2 bg-card rounded-lg overflow-x-auto">
    <button
      v-for="(day, index) in days"
      :key="index"
      @click="selectDay(index)"
      :class="[
        'px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap',
        selectedDayIndex === index
          ? 'bg-primary text-white'
          : 'text-text-secondary hover:bg-background',
      ]"
    >
      {{ day.short }}
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const emit = defineEmits(['update:modelValue']);

const days = [
  { short: 'Пн', long: 'mon' },
  { short: 'Вт', long: 'tue' },
  { short: 'Ср', long: 'wed' },
  { short: 'Чт', long: 'thu' },
  { short: 'Пт', long: 'fri' },
  { short: 'Сб', long: 'sat' },
  { short: 'Вс', long: 'sun' },
];
const selectedDayIndex = ref(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1); // Adjust for Sunday being 0

const selectDay = (index) => {
  selectedDayIndex.value = index;
  emit('update:modelValue', days[index].long);
};

// Emit the initial day on mount
onMounted(() => {
  emit('update:modelValue', days[selectedDayIndex.value].long);
});
</script>

<style scoped>
/* Improve scrolling on touch devices */
.overflow-x-auto {
  -webkit-overflow-scrolling: touch;
}
</style>
