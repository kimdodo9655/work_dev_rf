<template>
  <button
    @click.stop="handleClick"
    :class="['cell-button', `btn-${variant}`, { 'btn-disabled': disabled }]"
    :disabled="disabled"
    :type="type"
  >
    <span v-if="icon" class="btn-icon">{{ icon }}</span>
    <span v-if="label">{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  label?: string
  icon?: string
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  disabled: false,
  type: 'button'
})

const emit = defineEmits<{
  click: []
}>()

const handleClick = (): void => {
  if (!props.disabled) {
    emit('click')
  }
}
</script>

<style scoped>
.cell-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s;
  white-space: nowrap;
}

.cell-button:not(.btn-disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cell-button:not(.btn-disabled):active {
  transform: translateY(0);
}

.btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-icon {
  font-size: 14px;
}

/* 색상 변형 */
.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:not(.btn-disabled):hover {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-secondary:not(.btn-disabled):hover {
  background-color: #4b5563;
}

.btn-success {
  background-color: #10b981;
  color: white;
}

.btn-success:not(.btn-disabled):hover {
  background-color: #059669;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
}

.btn-danger:not(.btn-disabled):hover {
  background-color: #dc2626;
}

.btn-warning {
  background-color: #f59e0b;
  color: white;
}

.btn-warning:not(.btn-disabled):hover {
  background-color: #d97706;
}

.btn-info {
  background-color: #3b82f6;
  color: white;
}

.btn-info:not(.btn-disabled):hover {
  background-color: #2563eb;
}
</style>
