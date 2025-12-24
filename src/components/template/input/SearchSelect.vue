<template>
  <div ref="selectRef" class="form-select">
    <div class="input-wrapper" @click="toggleDropdown">
      <label v-if="label" :for="inputId">{{ label }}</label>
      <input
        :id="inputId"
        ref="inputRef"
        type="text"
        :value="displayValue"
        :placeholder="placeholder"
        :disabled="disabled"
        readonly
      />
      <i class="fi fi-rr-caret-down"></i>
    </div>

    <div v-show="isOpen" class="select-dropdown">
      <div class="dropdown">
        <div
          v-for="option in options"
          :key="option.value"
          class="dropdown-item"
          :class="{ selected: isSelected(option.value) }"
          @click="selectOption(option)"
        >
          <p>{{ option.label }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

interface Option {
  label: string
  value: string | number
}

interface Props {
  modelValue?: string | number | null
  options: Option[]
  label?: string
  placeholder?: string
  disabled?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string | number | null): void
  (e: 'change', value: string | number | null): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  label: '',
  placeholder: '선택해주세요',
  disabled: false
})

const emit = defineEmits<Emits>()

// Refs
const selectRef = ref<HTMLDivElement>()
const inputRef = ref<HTMLInputElement>()
const isOpen = ref(false)
const selectId = `select-${Math.random().toString(36).substr(2, 9)}`
const inputId = `input-${Math.random().toString(36).substr(2, 9)}`

// Computed
const displayValue = computed(() => {
  if (props.modelValue !== null && props.modelValue !== undefined) {
    const selected = props.options.find((option) => option.value === props.modelValue)
    return selected ? selected.label : ''
  }
  return ''
})

// Methods
function isSelected(value: string | number): boolean {
  return props.modelValue === value
}

function openDropdown() {
  if (props.disabled) return

  document.dispatchEvent(new CustomEvent('select-open', { detail: { selectId } }))
  isOpen.value = true
  inputRef.value?.focus()
}

function closeDropdown() {
  isOpen.value = false
  inputRef.value?.blur()
}

function toggleDropdown() {
  if (props.disabled) return

  if (isOpen.value) {
    closeDropdown()
  } else {
    openDropdown()
  }
}

function selectOption(option: Option) {
  if (props.disabled) return

  emit('update:modelValue', option.value)
  emit('change', option.value)
  closeDropdown()
}

function handleClickOutside(e: Event) {
  if (isOpen.value && selectRef.value && !selectRef.value.contains(e.target as Node)) {
    closeDropdown()
  }
}

function handleOtherSelectOpen(e: Event) {
  const customEvent = e as CustomEvent<{ selectId: string }>
  if (isOpen.value && customEvent.detail.selectId !== selectId) {
    closeDropdown()
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('select-open', handleOtherSelectOpen)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('select-open', handleOtherSelectOpen)
})

// Expose
defineExpose({
  open: openDropdown,
  close: closeDropdown,
  toggle: toggleDropdown
})
</script>
