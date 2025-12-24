<template>
  <div class="custom-select" ref="selectRef">
    <div
      class="select-trigger"
      :class="{ 'is-open': isOpen, 'is-disabled': disabled }"
      @click="toggleDropdown"
    >
      <span class="select-value" :class="{ placeholder: !selectedLabel }">
        {{ selectedLabel || placeholder }}
      </span>

      <i class="fi fi-rr-angle-small-down" :class="{ 'is-open': isOpen }"></i>
    </div>

    <Transition name="dropdown">
      <div v-if="isOpen" class="select-dropdown">
        <div class="select-options">
          <div
            v-for="option in options"
            :key="option.value"
            class="select-option"
            :class="{ 'is-selected': option.value === modelValue }"
            @click="selectOption(option)"
          >
            <span class="option-label">{{ option.label }}</span>

            <i v-if="option.value === modelValue" class="fi fi-rr-check-circle"></i>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

interface Props {
  modelValue: string | number | null
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '선택해주세요',
  disabled: false
})

const emit = defineEmits<Emits>()

const isOpen = ref(false)
const selectRef = ref<HTMLElement | null>(null)

const selectedLabel = computed(() => {
  const selected = props.options.find((opt) => opt.value === props.modelValue)
  return selected?.label || ''
})

const toggleDropdown = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
}

const selectOption = (option: SelectOption) => {
  if (option.disabled) return
  emit('update:modelValue', option.value)
  emit('change', option.value)
  isOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped lang="scss">
.custom-select {
  position: relative;
  width: 100%;
}

.select-trigger {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px 0 20px;
  background: #ffffff;
  border: 1px solid #dddddd;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;

  i {
    display: flex;
  }

  &:hover:not(.is-disabled) {
    border-color: #33cccc;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  }

  &.is-open {
    border-color: #33cccc;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  }

  &.is-disabled {
    background: #f9fafb;
    cursor: not-allowed;
    opacity: 0.6;
  }
}

.select-value {
  font-size: 14px;
  color: #111827;

  &.placeholder {
    color: #999999;
    font-weight: 400;
  }
}

.select-arrow {
  color: #999999;
  transition: transform 0.2s ease;
  flex-shrink: 0;

  &.is-open {
    transform: rotate(180deg);
  }
}

.select-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: #ffffff;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow: hidden;
}

.select-options {
  max-height: 280px;
  overflow-y: auto;
  padding: 6px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;

    &:hover {
      background: #9ca3af;
    }
  }

  i {
    display: flex;
  }
}

.select-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #f3f4f6;
  }

  &.is-selected {
    background: #ebf7f8;
    color: #21adad;
    font-weight: 600;

    &:hover {
      background: #e5f2f4;
    }
  }

  &.is-disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}

.option-label {
  font-size: 14px;
}

.option-check {
  color: #21adad;
  flex-shrink: 0;
}

// 드롭다운 애니메이션
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
