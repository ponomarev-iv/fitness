<template>
  <div class="flex items-center space-x-2">
    <div class="flex items-center bg-background border border-gray-700 rounded-md">
      <button @click.prevent="decrement" class="px-3 py-2 text-lg text-primary">-</button>
      <input 
        type="number" 
        :value="modelValue" 
        @input="onInput" 
        class="w-16 text-center bg-transparent focus:outline-none"
        placeholder="Вес"
      />
      <button @click.prevent="increment" class="px-3 py-2 text-lg text-primary">+</button>
    </div>
    <div class="relative w-8 h-8 flex-shrink-0"> <!-- Container for select and icon -->
      <select v-model.number="step" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" aria-label="Шаг изменения веса">
        <option v-for="val in stepOptions" :key="val" :value="val">{{ val }} кг</option>
      </select>
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({ modelValue: Number });
const emit = defineEmits(['update:modelValue']);

const step = ref(2.5);
const stepOptions = [2.5, 5, 7.5, 10];

const increment = () => {
  const currentValue = props.modelValue || 0;
  emit('update:modelValue', currentValue + step.value);
};

const decrement = () => {
  const currentValue = props.modelValue || 0;
  const newValue = currentValue - step.value;
  emit('update:modelValue', newValue > 0 ? newValue : 0);
};

const onInput = (event) => {
  emit('update:modelValue', parseFloat(event.target.value) || 0);
};
</script>

<style scoped>
/* Hide number input arrows */
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
input[type=number] {
  -moz-appearance: textfield;
}

/* Hide default select arrow */
select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: none;
}
</style>
