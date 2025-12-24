<template>
  <div class="form-search-input">
    <div class="input-wrapper" @click="toggleInput">
      <label v-if="label" :for="inputId">{{ label }}</label>
      <input
        :id="inputId"
        ref="inputRef"
        type="search"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        @input="handleInput"
        @keyup.enter="handleSearch"
        @focus="handleFocus"
        @blur="handleBlur"
        @click.stop
      />
      <i
        v-if="modelValue && showClearButton"
        class="fi fi-rr-cross-small clear-btn"
        @click.stop="handleClear"
      ></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, useId } from 'vue'

interface Props {
  modelValue?: string
  label?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  showClearButton?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'search', value: string): void
  (e: 'clear'): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: '',
  placeholder: '검색어를 입력하세요',
  disabled: false,
  readonly: false,
  showClearButton: true
})

const emit = defineEmits<Emits>()

// Refs
const inputRef = ref<HTMLInputElement>()
const inputId = useId() // Vue 3.5+ 권장 방식

// Methods
function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

function handleSearch() {
  if (props.disabled || props.readonly) return
  emit('search', props.modelValue)
}

function handleClear(event: MouseEvent) {
  event.stopPropagation() // 명시적 처리
  if (props.disabled || props.readonly) return

  emit('update:modelValue', '')
  emit('clear')
  inputRef.value?.focus()
}

function handleFocus(event: FocusEvent) {
  emit('focus', event)
}

function handleBlur(event: FocusEvent) {
  emit('blur', event)
}

function toggleInput(event: MouseEvent) {
  // disabled/readonly 체크 추가
  if (props.disabled || props.readonly) return

  // label이나 wrapper 영역 클릭 시에만 토글
  if ((event.target as HTMLElement).tagName === 'INPUT') return

  if (document.activeElement === inputRef.value) {
    inputRef.value?.blur()
  } else {
    inputRef.value?.focus()
  }
}

// Expose
defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
  element: inputRef // input element 자체도 노출하면 유용
})
</script>
