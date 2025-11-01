<template>
  <teleport to="body">
    <div v-if="modelValue" class="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-card rounded-lg p-6 w-full sm:max-w-md sm:mx-4 relative">
        <button @click.prevent="closeModal" class="absolute top-4 right-4 text-text-secondary hover:text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 class="text-xl font-bold text-primary mb-4 max-w-[80%]">{{ isEditing ? `Редактирую: ${workoutToEdit.exercise.name}` : (selectedExercise ? `Упражнение: ${selectedExercise.name}` : 'Добавить Упражнение') }}</h2>

        <!-- Step 1: Select Exercise (only for new workouts) -->
        <div v-if="!selectedExercise">
          <Suspense>
            <ExerciseSelector @select="handleExerciseSelect" />
            <template #fallback><div>Загрузка упражнений...</div></template>
          </Suspense>
          <div class="flex justify-end mt-6">
            <button @click.prevent="closeModal" class="px-4 py-2 rounded-md text-text-secondary">Отмена</button>
          </div>
        </div>

        <!-- Step 2: Add/Edit Sets -->
        <div v-else>
          <Accordion v-if="exerciseHistory && exerciseHistory.length > 0" title="Прошлые результаты" class="mb-4 mx-[-0.75rem]">
            <ul class="space-y-2">
              <li v-for="(item, index) in exerciseHistory" :key="index" class="text-sm text-text-secondary flex justify-between items-center px-3">
                <span class="font-bold text-white">{{ new Date(item.date).toLocaleDateString() }}:</span>
                <div class="flex flex-nowrap overflow-x-auto custom-scrollbar">
                  <span v-for="(set, i) in item.sets" :key="i" class="ml-2 px-2 py-1 bg-background rounded-md text-xs flex-shrink-0">
                    {{ set.reps }}x{{ set.weight }}кг
                  </span>
                </div>
              </li>
            </ul>
          </Accordion>

          <form @submit.prevent="saveWorkout">
            <div class="space-y-4">
              <div v-if="sets.length > 0" class="flex items-center space-x-2 mb-2 text-text-secondary text-sm font-medium mx-[-10px]">
                <span class="w-6 hidden xs:block">#</span>
                <span class="w-20">Повторы</span>
                <span class="min-w-0 flex-1">Вес</span>
                <span class="w-8"></span> <!-- For the delete button -->
              </div>
              <div v-for="(set, index) in sets" :key="index" class="flex items-center space-x-2 mx-[-10px]">
                <span class="text-text-secondary w-6 hidden xs:block">{{ index + 1 }}.</span>
                <select v-model.number="set.reps" class="w-20 px-3 py-2 text-text-primary bg-background border border-gray-700 rounded-md" required>
                  <option disabled :value="null">Повторения</option>
                  <option v-for="rep in repOptions" :key="rep" :value="rep">{{ rep }}</option>
                </select>
                <div v-if="selectedExercise.hasWeight" class="min-w-0 flex-1">
                  <WeightInput v-model="set.weight" />
                </div>
                <button @click.prevent="removeSet(index)" class="text-red-500 p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
              <button @click.prevent="addSet" class="text-sm text-primary">+ Добавить подход</button>
            </div>

            <div class="mt-4 pt-4 border-t border-gray-700">
              <div v-if="liveTonnage > 0" class="text-right text-text-secondary">
                Общий тоннаж: <span class="font-bold text-primary">{{ liveTonnage }} кг</span>
              </div>
            </div>

            <div class="flex justify-between items-center mt-6">
              <button v-if="!isEditing" @click.prevent="selectedExercise = null" class="px-4 py-2 rounded-md text-text-secondary">Назад</button>
              <div :class="{ 'w-full text-right': isEditing }">
                <button @click.prevent="closeModal" class="px-4 py-2 rounded-md text-text-secondary">Отмена</button>
                <button type="submit" class="px-4 py-3 font-bold text-white bg-primary rounded-md ml-2">Сохранить</button>
              </div>
            </div>
          </form>
        </div>

      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, watch, computed, defineAsyncComponent } from 'vue';
const ExerciseSelector = defineAsyncComponent(() => import('./ExerciseSelector.vue'));
import Accordion from './Accordion.vue';
import { useAuthFetch } from '~/composables/useAuthFetch';
import WeightInput from './WeightInput.vue';
import { useAuthStore } from '~/stores/auth'; // Import useAuthStore

const props = defineProps({ 
  modelValue: Boolean,
  workoutToEdit: { type: Object, default: null },
  date: { type: String, required: true },
});
const emit = defineEmits(['update:modelValue', 'save']);

const selectedExercise = ref(null);
const sets = ref([]);
const repOptions = Array.from({ length: 30 }, (_, i) => i + 1);

const isEditing = computed(() => !!props.workoutToEdit);

const authStore = useAuthStore(); // Get auth store instance

const { data: lastWorkoutData, refresh: refreshLastWorkout } = useLazyFetch(() => {
  if (!selectedExercise.value?.id || isEditing.value) return null; // Don't fetch if no exercise selected or in edit mode
  return `/api/workouts/last?exerciseId=${selectedExercise.value.id}`;
}, {
  immediate: false, // Control fetching manually
  headers: {
    Authorization: `Bearer ${authStore.token}`,
  },
});

const exerciseHistory = ref(null);

const { data: exerciseHistoryData, refresh: refreshExerciseHistory } = useLazyFetch(() => {
  if (!selectedExercise.value?.id || isEditing.value) return null;
  return `/api/exercises/${selectedExercise.value.id}/history`;
}, {
  immediate: false,
  headers: {
    Authorization: `Bearer ${authStore.token}`,
  },
  watch: [() => selectedExercise.value],
  onResponse({ response }) {
    exerciseHistory.value = response._data;
  },
});

const liveTonnage = computed(() => {
  if (!selectedExercise.value || !selectedExercise.value.hasWeight) return 0;
  return sets.value.reduce((total, set) => {
    const reps = set.reps || 0;
    const weight = set.weight || 0;
    return total + (reps * weight);
  }, 0);
});

const handleExerciseSelect = async (exercise) => {
  selectedExercise.value = exercise;
  await refreshExerciseHistory();

  let initialWeight = exercise.hasWeight ? (exercise.defaultWeight || 0) : 0;

  if (!isEditing.value && exercise.hasWeight) {
    await refreshLastWorkout();
    if (lastWorkoutData.value && lastWorkoutData.value.exercises.length > 0) {
        const lastSet = lastWorkoutData.value.exercises[0].sets[lastWorkoutData.value.exercises[0].sets.length - 1];
        if (lastSet) initialWeight = lastSet.weight;
    }
  }
  sets.value = [{ reps: 10, weight: initialWeight }];
};

const addSet = () => {
  let newWeight = 0;
  if (selectedExercise.value?.hasWeight) {
    // Prioritize weight from last workout if available
    if (lastWorkoutData.value && lastWorkoutData.value.exercises.length > 0) {
      const lastSetInLastWorkout = lastWorkoutData.value.exercises[0].sets[lastWorkoutData.value.exercises[0].sets.length - 1];
      if (lastSetInLastWorkout) {
        newWeight = lastSetInLastWorkout.weight;
      } else if (sets.value.length > 0) { // Fallback to last set in current modal
        newWeight = sets.value[sets.value.length - 1].weight;
      }
    } else if (sets.value.length > 0) { // Fallback to last set in current modal
      newWeight = sets.value[sets.value.length - 1].weight;
    }
  }
  sets.value.push({ reps: 10, weight: newWeight });
};

const removeSet = (index) => { sets.value.splice(index, 1); };
const closeModal = () => { emit('update:modelValue', false); };

const saveWorkout = async () => {
  
  const payload = {
    date: props.date,
    exercises: [{
      exerciseId: selectedExercise.value.id,
      sets: sets.value.map(s => ({
        reps: s.reps,
        weight: selectedExercise.value.hasWeight ? s.weight : 0,
      })),
    }],
    userId: authStore.user.id,
  };

  if (isEditing.value) {
    await useAuthFetch(`/api/workouts/${props.workoutToEdit.id}`, {
      method: 'PUT',
      body: payload,
    });
  } else {
    await useAuthFetch('/api/workouts', {
      method: 'POST',
      body: payload,
    });
  }
  
  emit('save');
  closeModal();
};

watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    document.body.classList.add('overflow-hidden');
    if (props.workoutToEdit) {
      selectedExercise.value = { ...props.workoutToEdit.exercise };
      sets.value = JSON.parse(JSON.stringify(props.workoutToEdit.sets));
    } else {
      // Reset for new workout
      selectedExercise.value = null;
      sets.value = [];
      lastWorkoutData.value = null; // Clear last workout data too
      exerciseHistory.value = null;
    }
  }
  else {
    document.body.classList.remove('overflow-hidden');
    setTimeout(() => {
      selectedExercise.value = null;
      sets.value = [];
      exerciseHistory.value = null;
    }, 200);
  }
});
</script>
