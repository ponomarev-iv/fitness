<template>
  <teleport to="body">
    <div v-if="modelValue" class="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-card rounded-lg p-6 w-full sm:max-w-sm sm:mx-4">
        <h2 class="text-xl font-bold text-primary mb-4">{{ title }}</h2>
        <p class="text-text-secondary mb-6">{{ message }}</p>
        <div class="flex justify-end space-x-4">
          <button @click="cancel" class="px-4 py-2 rounded-md text-text-secondary">Отмена</button>
          <button @click="confirm" class="px-4 py-2 font-bold text-white bg-red-500 rounded-md">Удалить</button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
  title: { type: String, default: 'Подтверждение' },
  message: { type: String, required: true },
});

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel']);

const confirm = () => {
  emit('confirm');
  emit('update:modelValue', false);
};

const cancel = () => {
  emit('cancel');
  emit('update:modelValue', false);
};
</script>
