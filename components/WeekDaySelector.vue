<template>
  <div class="flex items-center bg-card p-2 py-4 rounded-lg overflow-x-auto" ref="weekDaysContainer">
    <button
      v-for="day in weekDays"
      :key="day.dateString"
      @click="selectDay(day.dateString)"
      :disabled="day.isFuture"
      :class="[
        'flex flex-col items-center p-2 py-3 rounded-md font-medium relative min-w-[64px] transition-transform duration-300',
        day.isSelected ? 'bg-primary text-white scale-125 shadow-lg' : 'text-text-secondary hover:bg-background',
        day.isFuture ? 'opacity-50 cursor-not-allowed' : '',
      ]"
      :ref="el => { if (day.isSelected) selectedDayRef = el }"
    >
      <span class="text-xl">{{ day.shortName }}</span>
      <span class="text-xs">{{ day.dayOfMonth }}</span>
      <div v-if="day.hasWorkout" class="w-2 h-2 rounded-full bg-primary absolute bottom-1"></div>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue';

const props = defineProps({
  initialDate: { type: String, required: true }, // YYYY-MM-DD
  datesWithWorkouts: { type: Array, default: () => [] }, // Array of YYYY-MM-DD strings
});

const emit = defineEmits(['date-selected']);

const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']; // Sunday is 0

const today = new Date();
today.setHours(0, 0, 0, 0); // Normalize today to start of day

const selectedDateInternal = ref(props.initialDate);
const weekDaysContainer = ref(null);
const selectedDayRef = ref(null);

const weekDays = computed(() => {
  // Parse date as local time to avoid timezone issues with `new Date(YYYY-MM-DD)`
  const [year, month, day] = selectedDateInternal.value.split('-').map(s => parseInt(s, 10));
  const centerDate = new Date(year, month - 1, day);

  const startOfWeek = new Date(centerDate);
  startOfWeek.setDate(startOfWeek.getDate() - (startOfWeek.getDay() === 0 ? 6 : startOfWeek.getDay() - 1)); // Go to Monday

  const days = [];
  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(startOfWeek);
    currentDay.setDate(startOfWeek.getDate() + i);

    const dateString = [
      currentDay.getFullYear(),
      (currentDay.getMonth() + 1).toString().padStart(2, '0'),
      currentDay.getDate().toString().padStart(2, '0')
    ].join('-');

    days.push({
      dateString,
      dayOfMonth: currentDay.getDate(),
      shortName: dayNames[currentDay.getDay()],
      isFuture: currentDay > today,
      isSelected: dateString === selectedDateInternal.value,
      hasWorkout: props.datesWithWorkouts.includes(dateString),
    });
  }
  return days;
});

const selectDay = (dateString) => {
  selectedDateInternal.value = dateString;
  emit('date-selected', dateString);
};

// Watch for external changes to initialDate prop
watch(() => props.initialDate, (newDate) => {
  if (selectedDateInternal.value !== newDate) {
    selectedDateInternal.value = newDate;
  }
});

// Emit initial selected date
// emit('date-selected', selectedDateInternal.value); // Removed to prevent double fetch

const scrollToActiveDay = () => {
  if (selectedDayRef.value && weekDaysContainer.value) {
    selectedDayRef.value.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }
};

onMounted(() => {
  nextTick(scrollToActiveDay);
});

watch(selectedDateInternal, () => {
  nextTick(scrollToActiveDay);
});
</script>

<style scoped>
.overflow-x-auto {
  -webkit-overflow-scrolling: touch;
}
</style>
