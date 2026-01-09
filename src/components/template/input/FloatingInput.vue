<template>
  <div class="floating-field" ref="fieldRef">
    <div class="field-container" @click="handleContainerClick">
      <!-- Placeholder Label (비어있을 때만 표시) -->
      <div v-show="!hasValue && !isFocused" class="placeholder-label" :class="placeholderClasses">
        {{ placeholder }}
        <span v-if="showRequired" class="required-mark">*</span>
      </div>

      <!-- Floating Label (입력 시 위로 이동) -->
      <label :for="fieldId" class="floating-label" :class="floatingLabelClasses">
        {{ label }}
        <span v-if="showRequired" class="required-mark">*</span>
      </label>

      <!-- Input Frame (실제 입력 영역) -->
      <div class="input-frame" :class="frameClasses">
        <slot />
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="showError && errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

interface Props {
  label: string
  placeholder?: string
  fieldId?: string
  showRequired?: boolean
  isDisabled?: boolean
  showError?: boolean
  errorMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  fieldId: `field-${Math.random().toString(36).substr(2, 9)}`,
  showRequired: false,
  isDisabled: false,
  showError: false,
  errorMessage: ''
})

interface EventListenerEntry {
  element: Element
  type: string
  handler: (event: Event) => void
}

const fieldRef = ref<HTMLElement | null>(null)
const hasValue = ref(false)
const isFocused = ref(false)
const eventListeners = ref<EventListenerEntry[]>([])

// Placeholder 클래스
const placeholderClasses = computed(() => ({
  'is-disabled': props.isDisabled
}))

// Floating Label 클래스
const floatingLabelClasses = computed(() => ({
  'is-visible': hasValue.value || isFocused.value,
  'is-error': props.showError,
  'is-disabled': props.isDisabled
}))

// Frame 클래스
const frameClasses = computed(() => ({
  'is-focused': isFocused.value,
  'is-error': props.showError,
  'is-disabled': props.isDisabled,
  'has-content': hasValue.value || isFocused.value
}))

onMounted(() => {
  nextTick(() => {
    setupInputs()
  })
})

onBeforeUnmount(() => {
  eventListeners.value.forEach(({ element, type, handler }) => {
    element.removeEventListener(type, handler)
  })
})

function setupInputs() {
  if (!fieldRef.value) return

  const inputs = fieldRef.value.querySelectorAll('input, textarea, select')

  // 기존 리스너 제거
  eventListeners.value.forEach(({ element, type, handler }) => {
    element.removeEventListener(type, handler)
  })
  eventListeners.value = []

  inputs.forEach((input) => {
    // 초기 값 체크
    checkAllValues()

    // 이벤트 핸들러 생성
    const focusHandler = () => handleFocus()
    const blurHandler = () => handleBlur()
    const inputHandler = () => handleInput()
    const changeHandler = () => handleInput()

    // 이벤트 리스너 등록
    input.addEventListener('focus', focusHandler)
    input.addEventListener('blur', blurHandler)
    input.addEventListener('input', inputHandler)
    input.addEventListener('change', changeHandler)

    // 리스너 추적
    eventListeners.value.push(
      { element: input, type: 'focus', handler: focusHandler },
      { element: input, type: 'blur', handler: blurHandler },
      { element: input, type: 'input', handler: inputHandler },
      { element: input, type: 'change', handler: changeHandler }
    )
  })
}

function handleFocus() {
  isFocused.value = true
}

function handleBlur() {
  isFocused.value = false
  checkAllValues()
}

function handleInput() {
  checkAllValues()
}

function checkAllValues() {
  if (!fieldRef.value) return

  const inputs = fieldRef.value.querySelectorAll('input, textarea, select')
  const hasAnyValue = Array.from(inputs).some((input) => {
    const value = (input as HTMLInputElement).value.trim()
    return value !== ''
  })

  hasValue.value = hasAnyValue
}

function handleContainerClick(event: MouseEvent) {
  if (props.isDisabled) return

  // 버튼이나 다른 interactive 요소 클릭은 무시
  const target = event.target as HTMLElement
  if (target.tagName === 'BUTTON' || target.closest('button')) {
    return
  }

  // input이 이미 포커스되어 있으면 무시
  if (isFocused.value) return

  // 첫 번째 input에 포커스
  nextTick(() => {
    if (!fieldRef.value) return

    const inputs = fieldRef.value.querySelectorAll(
      'input:not([readonly]):not([disabled]), textarea:not([readonly]):not([disabled]), select:not([disabled])'
    )
    if (inputs.length > 0) {
      const firstInput = inputs[0] as HTMLInputElement
      firstInput.focus()
    }
  })
}

// props 변경 시 상태 업데이트
watch(
  () => props.isDisabled,
  () => {
    if (props.isDisabled) {
      isFocused.value = false
    }
  }
)
</script>
