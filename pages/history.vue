<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-3xl font-bold text-primary">История тренировок</h1>
      <p class="text-text-secondary">Просмотр и редактирование прошлых тренировок.</p>
    </div>

    <div style="max-width: 400px; margin: 40px 0 20px;">
      <Calendar 
        :initial-date="selectedDate" 
        :marked-dates="markedDates" 
        @date-selected="handleDateSelected" 
        @month-changed="handleMonthChanged"
        :disable-future="true"
        :dates-with-workouts="markedDates"
      />
    </div>

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
        <p class="text-text-secondary">Загрузка упражнения...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="!workouts || workouts.length === 0" class="p-8 text-center bg-card rounded-lg">
        <p class="text-text-secondary">Нет записей за этот день. Добавьте первую!</p>
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

    <ConfirmationModal 
      v-model="showConfirmationModal"
      title="Удалить тренировку?"
      message="Вы уверены, что хотите удалить эту тренировку? Это действие нельзя будет отменить."
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useAuthFetch } from '~/composables/useAuthFetch';
import WorkoutCard from '~/components/WorkoutCard.vue';
import WorkoutModal from '~/components/WorkoutModal.vue';
import Calendar from '~/components/Calendar.vue';
import ConfirmationModal from '~/components/ConfirmationModal.vue';

const authStore = useAuthStore();

definePageMeta({
  requiresAuth: true,
});

const today = new Date();
const currentYear = ref(today.getFullYear());
const currentMonth = ref((today.getMonth() + 1).toString().padStart(2, '0'));
const selectedDate = ref(`${currentYear.value}-${currentMonth.value}-${today.getDate().toString().padStart(2, '0')}`);

const formattedDate = computed(() => {
  const date = new Date(selectedDate.value);
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

const markedDates = computed(() => {
  if (!monthWorkouts.value) return [];
  return monthWorkouts.value
    .filter(workout => workout.hasWorkout)
    .map(workout => workout.date);
});

const isModalOpen = ref(false);
const workoutToEdit = ref(null);
const showConfirmationModal = ref(false);
const workoutToDelete = ref(null);

// Refresh workouts for the selected date when it changes
watch(selectedDate, (newDate) => {
  if (newDate) refreshWorkouts();
});

// Refresh month workouts when month/year changes
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

const handleDelete = (workoutId) => {
  workoutToDelete.value = workoutId;
  showConfirmationModal.value = true;
};

const confirmDelete = async () => {
  await useAuthFetch(`/api/workouts/${workoutToDelete.value}?date=${selectedDate.value}`,
    {
      method: 'DELETE',
    }
  );
  refreshWorkouts();
  refreshMonthWorkouts();
  workoutToDelete.value = null;
};

const handleDateSelected = (date) => {
  selectedDate.value = date;
};

const handleMonthChanged = (monthString) => {
  const [year, month] = monthString.split('-');
  currentYear.value = parseInt(year);
  currentMonth.value = month;
};

// Initial data load
refreshWorkouts();
refreshMonthWorkouts();

</script>
