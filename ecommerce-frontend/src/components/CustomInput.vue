<template>
  <div class="w-full">
    <label :for="inputId" class="text-sm font-medium text-gray-700 mb-2">
      {{ label }}
    </label>
    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';

defineProps({
  label: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'text'
  },
  modelValue: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    default: ''
  }
});

const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`);

defineEmits(['update:modelValue']);
</script>
