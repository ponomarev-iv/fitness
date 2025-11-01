<template>
  <div class="bg-card p-4 rounded-lg shadow-md">
    <div class="flex justify-between items-center mb-4">
      <button @click="goToPreviousMonth" class="w-8 h-8 flex items-center justify-center rounded-full bg-card-alt text-white shadow-md hover:bg-card-alt-light">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h3 class="text-lg font-bold">{{ currentMonthName }} {{ currentYear }}</h3>
      <button @click="goToNextMonth" class="w-8 h-8 flex items-center justify-center rounded-full bg-card-alt text-white shadow-md hover:bg-card-alt-light" :style="{ visibility: nextMonthIsFuture ? 'hidden' : 'visible' }">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <div class="grid grid-cols-7 text-center text-sm font-medium text-text-secondary mb-2">
      <span v-for="dayName in dayNames" :key="dayName">{{ dayName }}</span>
    </div>

    <div class="grid grid-cols-7 gap-1">
      <div 
        v-for="(day, index) in calendarDays" 
        :key="index"
        :class="[
          'p-2 py-3 rounded-md text-center text-sm relative',
          day.isCurrentMonth ? 'text-text-primary' : 'text-text-secondary opacity-50',
          day.isToday ? 'bg-primary text-white' : '',
          day.isDisabled ? 'opacity-50 cursor-not-allowed' : (day.date ? 'cursor-pointer hover:bg-background' : ''),
          day.date === selectedDate ? 'bg-blue-600 text-white' : '',
        ]"
        @click="day.date && !day.isDisabled && selectDay(day.date)"
      >
        {{ day.dayOfMonth }}
        <div v-if="day.hasWorkout" class="w-2 h-2 rounded-full bg-primary absolute bottom-1 left-1/2 -translate-x-1/2"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

const props = defineProps({
  initialDate: { type: String, default: () => {
    const today = new Date();
    return `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
  } }, // YYYY-MM-DD
  markedDates: { type: Array, default: () => [] }, // Array of YYYY-MM-DD strings
  disableFuture: { type: Boolean, default: false },
  datesWithWorkouts: { type: Array, default: () => [] }, // New prop
});

const emit = defineEmits(['date-selected', 'month-changed']);

const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const monthNames = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

const today = new Date();
today.setHours(0, 0, 0, 0);
const todayString = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

const currentYear = ref(new Date(props.initialDate).getFullYear());
const currentMonth = ref(new Date(props.initialDate).getMonth()); // 0-11
const selectedDate = ref(props.initialDate);

const currentMonthName = computed(() => monthNames[currentMonth.value]);

const daysInMonth = computed(() => new Date(currentYear.value, currentMonth.value + 1, 0).getDate());
const firstDayOfMonth = computed(() => {
  const day = new Date(currentYear.value, currentMonth.value, 1).getDay();
  return day === 0 ? 6 : day - 1; // Adjust to make Monday (0) the first day
});

const calendarDays = computed(() => {
  const days = [];
  // Add empty days for the start of the month
  for (let i = 0; i < firstDayOfMonth.value; i++) {
    days.push({ date: null, dayOfMonth: '', isCurrentMonth: false });
  }
  // Add days of the current month
  for (let i = 1; i <= daysInMonth.value; i++) {
    const date = `${currentYear.value}-${(currentMonth.value + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
    const dateObj = new Date(currentYear.value, currentMonth.value, i);
    days.push({
      date,
      dayOfMonth: i,
      isCurrentMonth: true,
      isToday: date === todayString,
      isMarked: props.markedDates.includes(date),
      hasWorkout: props.datesWithWorkouts.includes(date),
      isDisabled: props.disableFuture && dateObj > today,
    });
  }
  // Add empty days for the end of the month to fill the last week
  while (days.length % 7 !== 0) {
    days.push({ date: null, dayOfMonth: '', isCurrentMonth: false });
  }
  return days;
});

const nextMonthIsFuture = computed(() => {
  if (!props.disableFuture) return false;
  const nextMonth = new Date(currentYear.value, currentMonth.value + 1, 1);
  return nextMonth > today;
});

const goToPreviousMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
  emit('month-changed', `${currentYear.value}-${(currentMonth.value + 1).toString().padStart(2, '0')}`);
};

const goToNextMonth = () => {
  if (nextMonthIsFuture.value) return;
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
  emit('month-changed', `${currentYear.value}-${(currentMonth.value + 1).toString().padStart(2, '0')}`);
};

const selectDay = (date) => {
  selectedDate.value = date;
  emit('date-selected', date);
};

// Emit initial selected date
watch(() => props.initialDate, (newDate) => {
  selectedDate.value = newDate;
  emit('date-selected', newDate);
}, { immediate: true });

// Emit month changed when component mounts
onMounted(() => {
  emit('month-changed', `${currentYear.value}-${(currentMonth.value + 1).toString().padStart(2, '0')}`);
});
</script>
