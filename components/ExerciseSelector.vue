1<template>
  <div class="space-y-4">
    <input 
      type="text" 
      v-model="searchTerm"
      placeholder="Поиск упражнения..."
      class="w-full px-3 py-2 text-text-primary bg-background border border-gray-700 rounded-md"
    />
    
    <div v-if="pending" class="text-center text-text-secondary">Загрузка...</div>
    
    <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-64 overflow-y-auto">
      <div 
        v-for="exercise in filteredExercises" 
        :key="exercise.id" 
        @click="selectExercise(exercise)"
        class="bg-card-alt p-2 rounded-lg text-center cursor-pointer border-2 border-transparent hover:border-primary relative group"
      >
        <img :src="exercise.image" :alt="exercise.name" class="w-full h-24 object-cover rounded-md mb-2">
        <p class="text-sm font-medium">{{ exercise.name }}</p>
        <button @click.stop="deleteExercise(exercise.id)" class="absolute top-1 right-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      <!-- "Add New Exercise" button card -->
      <div
        v-if="!isAddingNewExercise"
        @click="startAddExercise"
        class="bg-card-alt p-2 rounded-lg text-center cursor-pointer border-2 border-transparent hover:border-primary flex flex-col items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-primary mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <p class="text-sm font-medium text-primary">Новое упражнение</p>
      </div>

      <!-- Add New Exercise Input Card -->
      <div
        v-if="isAddingNewExercise"
        class="bg-card-alt p-2 rounded-lg text-center border-2 border-primary relative"
      >
        <div class="w-full h-24 flex items-center justify-center bg-background rounded-md mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <input
          type="text" 
          v-model="newExerciseName"
          placeholder="Название..."
          class="w-full px-1 py-1 text-text-primary bg-background border border-gray-700 rounded-md text-sm text-center"
          ref="newExerciseInput"
          @keyup.enter="addExercise"
        />
        <div class="flex justify-between mt-2">
          <button @click="cancelAddExercise" class="p-1 rounded-md text-text-secondary hover:bg-background">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <button @click="addExercise" class="p-1 rounded-md text-primary hover:bg-background">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';

const emit = defineEmits(['select']);

const searchTerm = ref('');
const newExerciseName = ref('');
const isAddingNewExercise = ref(false);
const newExerciseInput = ref(null);

// Fetch exercises
const { data: exercises, pending, refresh: refreshExercises } = await useFetch('/api/exercises');

const filteredExercises = computed(() => {
  if (!exercises.value) return [];
  if (!searchTerm.value) return exercises.value;
  return exercises.value.filter(ex => 
    ex.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

const selectExercise = (exercise) => {
  emit('select', exercise);
};

const startAddExercise = () => {
  isAddingNewExercise.value = true;
  nextTick(() => {
    newExerciseInput.value.focus();
  });
};

const cancelAddExercise = () => {
  isAddingNewExercise.value = false;
  newExerciseName.value = '';
};

const addExercise = async () => {
  if (!newExerciseName.value.trim()) return;
  await useFetch('/api/exercises', {
    method: 'POST',
    body: { name: newExerciseName.value, hasWeight: true, defaultWeight: 0 },
  });
  newExerciseName.value = '';
  isAddingNewExercise.value = false;
  refreshExercises();
};

const deleteExercise = async (id) => {
  if (!confirm('Вы уверены, что хотите удалить это упражнение?')) return;
  await useFetch(`/api/exercises/${id}`, {
    method: 'DELETE',
  });
  refreshExercises();
};
</script>
