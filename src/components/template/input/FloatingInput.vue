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

<style scoped lang="scss">
.floating-field {
  position: relative;
  margin-bottom: 20px;
}

.field-container {
  position: relative;
  cursor: pointer;

  &:has(.input-frame.is-disabled) {
    cursor: not-allowed;
  }
}

.placeholder-label {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #666666;
  font-size: 15px;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: opacity 0.2s ease;
  pointer-events: none;

  &.is-disabled {
    color: #dddddd;
  }
}

.floating-label {
  position: absolute;
  left: 12px;
  top: -10px;
  color: #21adad;
  font-size: 12px;
  font-weight: 600;
  background: white;
  padding: 0 4px;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: 0;
  transform: translateY(4px);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;

  &.is-visible {
    opacity: 1;
    transform: translateY(0);
  }

  &.is-error {
    color: #ef4444;
  }

  &.is-disabled {
    color: #9ca3af;
  }
}

.required-mark {
  color: #ef4444;
  font-size: 14px;
  font-style: normal;
}

.input-frame {
  position: relative;
  height: 64px;
  border: 1px solid #bbbbbb;
  border-radius: 8px;
  background: white;
  transition: all 0.2s ease;
  padding: 12px;

  // 직접 나열된 요소들을 위한 flex 레이아웃
  display: flex;
  align-items: center;

  // 내용이 없을 때는 투명하게
  &:not(.has-content) {
    :deep(*) {
      opacity: 0 !important;
    }
  }

  // 내용이 있거나 포커스 상태일 때는 보이게
  &.has-content {
    :deep(*) {
      opacity: 1 !important;
    }

    // has-content일 때만 input placeholder 보이기
    :deep(input),
    :deep(textarea),
    :deep(select) {
      &::placeholder {
        color: #999999 !important;
      }
    }
  }

  &.is-focused {
    outline: 5px solid #33cccc66;
    border-color: #21adad;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  &.is-error {
    border-color: #ef4444;

    &.is-focused {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
  }

  &.is-disabled {
    background: #f7f7f7;
    cursor: not-allowed;
  }
}

// slot 내부 input 스타일 초기화
:deep(input),
:deep(textarea),
:deep(select) {
  border: none;
  outline: none;
  background: transparent;
  font-size: 15px;
  color: #1a1a1a;
  padding: 0;
  margin: 0;
  transition: opacity 0.2s ease;

  // 기본적으로 placeholder는 투명 (FloatingInput의 placeholder만 보이게)
  &::placeholder {
    color: transparent;
  }

  &:disabled {
    color: #999999;
    cursor: not-allowed;
  }
}

// 직접 자식 input (나란히 배치용)
:deep(> input),
:deep(> textarea),
:deep(> select) {
  flex: 0 1 auto;

  // width가 지정되지 않은 경우에만 flex: 1로 공간 채우기
  &:not([style*='width']) {
    flex: 1 1 auto;
    min-width: 0;
  }
}

// 직접 자식 구분자 (span, p 등)
:deep(> span),
:deep(> p) {
  flex-shrink: 0;
  opacity: 1 !important;
}

:deep(textarea) {
  resize: vertical;
  min-height: 60px;
  width: 100%;
}

// 여러 input이 있을 때의 레이아웃 (wrapper div 사용)
:deep(.input-group) {
  display: flex;
  gap: 5px;
  align-items: center;
  transition: opacity 0.2s ease;
  width: 100%;

  input {
    flex: 1;
    min-width: 0;
  }
}

:deep(.input-with-button) {
  display: flex;
  gap: 8px;
  align-items: center;
  transition: opacity 0.2s ease;
  width: 100%;

  input {
    flex: 1;
    min-width: 0;
    font-size: 14px;
  }

  button {
    flex-shrink: 0;
    padding: 8px 12px;
    background: #f3f4f6;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    opacity: 1 !important;

    &:hover {
      background: #e5e7eb;
    }

    &:active {
      background: #d1d5db;
    }
  }
}

:deep(.input-addon) {
  display: flex;
  align-items: center;
  gap: 8px;
  transition: opacity 0.2s ease;
  width: 100%;

  .addon-text {
    color: #666666;
    font-size: 14px;
    white-space: nowrap;
    opacity: 1 !important;
  }

  input {
    flex: 1;
    min-width: 0;
  }
}

.error-message {
  position: absolute;
  bottom: 5px;
  right: 10px;
  font-size: 12px;
  color: #ef4444;
  padding-left: 4px;
}
</style>
