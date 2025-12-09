<template>
  <select
    :value="modelValue"
    @change="handleChange"
    @click.stop
    class="cell-select"
    :disabled="disabled"
    :aria-label="placeholder || 'Select option'"
  >
    <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
    <option v-for="option in options" :key="option.value" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>

<script setup lang="ts">
export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

interface Props {
  modelValue: string | number | null
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  change: [value: string | number]
}>()

const handleChange = (event: Event): void => {
  const target = event.target as HTMLSelectElement
  const value = target.value
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<style scoped>
.cell-select {
  width: 100%;
  max-width: 200px;
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background-color: white;
  font-size: 13px;
  color: #111827;
  cursor: pointer;
  transition: all 0.2s;
}

.cell-select:hover:not(:disabled) {
  border-color: #9ca3af;
}

.cell-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.cell-select:disabled {
  background-color: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}

.cell-select option {
  padding: 8px;
}
</style>
