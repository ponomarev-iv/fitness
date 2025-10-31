<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-3xl font-bold text-primary">Привет, {{ authStore.user?.name || 'Гость' }}!</h1>
    </div>

    <WeekDaySelector :initial-date="selectedDate" @date-selected="(date) => selectedDate = date" :dates-with-workouts="datesWithWorkoutsInWeek" />

    <div class="mt-8">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">Тренировка на&nbsp;<span style="white-space: nowrap;">{{ formattedDate }}</span></h2>
        <button @click="openAddModal" class="w-11 h-11 flex flex-shrink-0 items-center justify-center bg-primary text-white rounded-full shadow-lg hover:bg-opacity-90">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="pendingWorkouts" class="p-8 text-center bg-card rounded-lg">
        <p class="text-text-secondary">Загрузка тренировки...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="!workouts || workouts.length === 0" class="p-8 text-center bg-card rounded-lg">
        <p class="text-text-secondary">Нет упражнений за этот день. Добавьте первое!</p>
      </div>

      <!-- Workout List -->
      <div v-else class="space-y-4">
        <WorkoutCard 
          v-for="workout in workouts" 
          :key="workout.id" 
          :workout="workout" 
          @edit="openEditModal"
          @delete="handleDelete"
        />
      </div>
    </div>

    <WorkoutModal v-model="isModalOpen" :workout-to-edit="workoutToEdit" :date="selectedDate" @save="handleSave" />

  </div>
</template>

<script setup>
import { ref, watch, computed, defineAsyncComponent } from 'vue';
import { useAuthStore } from '~/stores/auth';
import WorkoutCard from '~/components/WorkoutCard.vue';
import WorkoutModal from '~/components/WorkoutModal.vue';
import WeekDaySelector from '~/components/WeekDaySelector.vue';

const authStore = useAuthStore();

definePageMeta({
  requiresAuth: true,
});

const today = new Date();
const currentYear = ref(today.getFullYear());
const currentMonth = ref((today.getMonth() + 1).toString().padStart(2, '0'));
const selectedDate = ref(`${currentYear.value}-${currentMonth.value}-${today.getDate().toString().padStart(2, '0')}`);

const formattedDate = computed(() => {
  const date = new Date(selectedDate.value)
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('ru-RU', options);
});

// Fetch workouts for the selected date
const { data: workouts, pending: pendingWorkouts, error: workoutsError, refresh: refreshWorkouts } = useLazyFetch(() => `/api/workouts?date=${selectedDate.value}`, {
  immediate: false,
  headers: {
    Authorization: `Bearer ${authStore.token}`,
  },
});

// Fetch all workouts for the current month to mark dates in the calendar
const { data: monthWorkouts, pending: pendingMonthWorkouts, error: monthWorkoutsError, refresh: refreshMonthWorkouts } = useLazyFetch(() => `/api/workouts?month=${currentYear.value}-${currentMonth.value}`, {
  immediate: false,
  headers: {
    Authorization: `Bearer ${authStore.token}`,
  },
});

const datesWithWorkoutsInWeek = computed(() => {
  if (!monthWorkouts.value) return [];

  const currentWeekStart = new Date(selectedDate.value);
  currentWeekStart.setDate(currentWeekStart.getDate() - (currentWeekStart.getDay() === 0 ? 6 : currentWeekStart.getDay() - 1)); // Go to Monday
  currentWeekStart.setHours(0, 0, 0, 0);

  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(currentWeekStart);
    d.setDate(currentWeekStart.getDate() + i);
    weekDates.push(`${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`);
  }

  const datesWithWorkouts = monthWorkouts.value
    .filter(workout => workout.hasWorkout)
    .map(workout => workout.date);

  return datesWithWorkouts.filter(date => weekDates.includes(date));
});

const isModalOpen = ref(false);
const workoutToEdit = ref(null);

// Initial data load
refreshWorkouts();
refreshMonthWorkouts();

// Watch for selectedDate changes to refresh workouts for that date and the month
watch(selectedDate, (newDate) => {
  if (newDate) {
    refreshWorkouts();
    // Update currentMonth and currentYear based on newDate for monthWorkouts fetch
    const d = new Date(newDate);
    currentYear.value = d.getFullYear();
    currentMonth.value = (d.getMonth() + 1).toString().padStart(2, '0');
  }
});

// Watch for month/year changes to refresh month workouts
watch([currentYear, currentMonth], () => {
  refreshMonthWorkouts();
});

const openAddModal = () => {
  workoutToEdit.value = null;
  isModalOpen.value = true;
};

const openEditModal = (workout) => {
  workoutToEdit.value = workout;
  isModalOpen.value = true;
};

const handleSave = () => {
  refreshWorkouts(); // Refresh workouts for the selected date
  refreshMonthWorkouts(); // Refresh workouts for the month to update marked dates
};

const handleDelete = async (workoutId) => {
  if (!confirm('Вы уверены, что хотите удалить эту тренировку?')) return;

  await useAuthFetch(`/api/workouts/${workoutId}?date=${selectedDate.value}`,
    {
      method: 'DELETE',
    }
  );
  refreshWorkouts();
  refreshMonthWorkouts();
};

</script>