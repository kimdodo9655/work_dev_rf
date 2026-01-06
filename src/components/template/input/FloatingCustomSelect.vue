<template>
  <div class="floating-custom-select" ref="fieldRef">
    <div class="field-container" @click="handleContainerClick">
      <!-- Placeholder Label (비어있을 때만 표시) -->
      <div v-show="!hasValue && !isFocused" class="placeholder-label" :class="placeholderClasses">
        {{ placeholder }}
        <span v-if="showRequired" class="required-mark">*</span>
      </div>

      <!-- Floating Label (선택 시 위로 이동) -->
      <label :for="fieldId" class="floating-label" :class="floatingLabelClasses">
        {{ label }}
        <span v-if="showRequired" class="required-mark">*</span>
      </label>

      <!-- Select Frame -->
      <div class="input-frame" :class="frameClasses">
        <div
          ref="selectRef"
          class="custom-select"
          :class="{ 'is-disabled': isDisabled, 'is-open': isOpen }"
        >
          <div
            class="select-trigger"
            :tabindex="isDisabled ? -1 : 0"
            @click.stop="toggleDropdown"
            @keydown.enter.prevent="toggleDropdown"
            @keydown.space.prevent="toggleDropdown"
            @keydown.escape="closeDropdown"
            @keydown.down.prevent="navigateOptions(1)"
            @keydown.up.prevent="navigateOptions(-1)"
          >
            <span class="selected-value" :class="{ 'is-placeholder': !hasValue }">
              {{ displayValue }}
            </span>
            <span class="arrow" :class="{ 'is-open': isOpen }">
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path
                  d="M1 1.5L6 6.5L11 1.5"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
          </div>

          <Transition name="dropdown">
            <div v-show="isOpen" class="dropdown-menu" :style="dropdownStyle">
              <div class="options-wrapper" @scroll="handleScroll">
                <!-- 일반 옵션들 -->
                <div
                  v-for="(option, index) in normalizedOptions"
                  :key="getOptionValue(option)"
                  class="option-item"
                  :class="{
                    'is-selected': isSelected(option),
                    'is-highlighted': highlightedIndex === index
                  }"
                  :tabindex="0"
                  @click.stop="selectOption(option)"
                  @mouseenter="highlightedIndex = index"
                  @focus="highlightedIndex = index"
                  @keydown.enter.prevent="selectOption(option)"
                >
                  <span class="option-label">{{ getOptionLabel(option) }}</span>
                  <span v-if="isSelected(option)" class="check-icon">✓</span>
                </div>

                <!-- 직접입력 옵션 -->
                <div
                  v-if="allowCustomInput"
                  class="option-item custom-input-option"
                  :class="{
                    'is-highlighted': highlightedIndex === normalizedOptions.length,
                    'is-active': shouldShowCustomInputCheck
                  }"
                  :tabindex="0"
                  @click.stop="activateCustomInput"
                  @mouseenter="highlightedIndex = normalizedOptions.length"
                  @focus="highlightedIndex = normalizedOptions.length"
                  @keydown.enter.prevent="activateCustomInput"
                >
                  <span class="option-label">직접입력</span>
                  <span v-if="shouldShowCustomInputCheck" class="check-icon">✓</span>
                </div>

                <!-- 직접입력 필드 -->
                <div
                  v-if="allowCustomInput && isCustomInputMode"
                  class="custom-input-wrapper"
                  @click.stop
                >
                  <input
                    ref="customInputRef"
                    v-model="internalInputText"
                    type="text"
                    class="custom-input-field"
                    :placeholder="customInputPlaceholder"
                    @keydown.enter.prevent="confirmCustomInput"
                    @keydown.escape="cancelCustomInput"
                  />
                  <div class="custom-input-actions">
                    <button class="btn-cancel" @click="cancelCustomInput">취소</button>
                    <button class="btn-confirm" @click="confirmCustomInput">확인</button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
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

interface Option {
  label: string
  value: string | number
  disabled?: boolean
  [key: string]: any
}

interface Props {
  label: string
  placeholder?: string
  fieldId?: string
  modelValue?: string | number | null
  options: Option[] | string[] | number[]
  showRequired?: boolean
  isDisabled?: boolean
  showError?: boolean
  errorMessage?: string
  labelKey?: string
  valueKey?: string
  allowCustomInput?: boolean
  customInputPlaceholder?: string
  customInputValue?: string | null // 직접입력 선택 시 modelValue에 설정할 값
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  fieldId: `field-${Math.random().toString(36).substr(2, 9)}`,
  modelValue: null,
  showRequired: false,
  isDisabled: false,
  showError: false,
  errorMessage: '',
  labelKey: 'label',
  valueKey: 'value',
  allowCustomInput: false,
  customInputPlaceholder: '직접 입력하세요',
  customInputValue: null
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null]
  change: [value: string | number | null]
  'update:customText': [value: string | null]
  blur: []
}>()

// 고유 ID 생성
const selectId = `select-${Math.random().toString(36).substr(2, 9)}`

const fieldRef = ref<HTMLElement | null>(null)
const selectRef = ref<HTMLElement | null>(null)
const customInputRef = ref<HTMLInputElement | null>(null)
const isOpen = ref(false)
const isFocused = ref(false)
const highlightedIndex = ref(-1)
const dropdownStyle = ref<Record<string, string>>({})
const isCustomInputMode = ref(false)
const internalInputText = ref('') // ⭐ 변수명 변경: customInputValue → internalInputText

// ... 기존 computed들 동일 ...

// 옵션 정규화
const normalizedOptions = computed<Option[]>(() => {
  return props.options.map((option) => {
    if (typeof option === 'string' || typeof option === 'number') {
      return {
        label: String(option),
        value: option
      }
    }
    return option as Option
  })
})

const hasValue = computed(() => {
  return props.modelValue !== null && props.modelValue !== undefined && props.modelValue !== ''
})

const isValueInOptions = computed(() => {
  return normalizedOptions.value.some((option) => getOptionValue(option) === props.modelValue)
})

const isCustomInputSelected = computed(() => {
  if (props.customInputValue !== null) {
    return props.modelValue === props.customInputValue
  }
  return hasValue.value && !isValueInOptions.value
})

const shouldShowCustomInputCheck = computed(() => {
  return isCustomInputMode.value || isCustomInputSelected.value
})

const displayValue = computed(() => {
  if (!hasValue.value) {
    return props.placeholder
  }

  if (isCustomInputSelected.value) {
    return '직접입력'
  }

  const selected = normalizedOptions.value.find(
    (option) => getOptionValue(option) === props.modelValue
  )

  if (selected) {
    return getOptionLabel(selected)
  }

  if (props.allowCustomInput && !isValueInOptions.value) {
    return String(props.modelValue)
  }

  return props.placeholder
})

const placeholderClasses = computed(() => ({
  'is-disabled': props.isDisabled
}))

const floatingLabelClasses = computed(() => ({
  'is-visible': hasValue.value || isFocused.value,
  'is-error': props.showError,
  'is-disabled': props.isDisabled
}))

const frameClasses = computed(() => ({
  'is-focused': isFocused.value,
  'is-error': props.showError,
  'is-disabled': props.isDisabled,
  'has-content': hasValue.value || isFocused.value
}))

function getOptionValue(option: Option): string | number {
  return option[props.valueKey]
}

function getOptionLabel(option: Option): string {
  return String(option[props.labelKey])
}

function isSelected(option: Option): boolean {
  return getOptionValue(option) === props.modelValue && !isCustomInputMode.value
}

function toggleDropdown() {
  if (props.isDisabled) return

  if (isOpen.value) {
    closeDropdown()
  } else {
    openDropdown()
  }
}

function openDropdown() {
  if (props.isDisabled) return

  document.dispatchEvent(new CustomEvent('select-open', { detail: { selectId } }))

  isOpen.value = true
  isFocused.value = true

  nextTick(() => {
    calculateDropdownPosition()

    if (props.modelValue !== null && isValueInOptions.value) {
      const selectedIndex = normalizedOptions.value.findIndex(
        (option) => getOptionValue(option) === props.modelValue
      )
      if (selectedIndex !== -1) {
        highlightedIndex.value = selectedIndex
        scrollToOption(selectedIndex)
      }
    } else if (isCustomInputSelected.value) {
      highlightedIndex.value = normalizedOptions.value.length
    }
  })
}

function closeDropdown() {
  isOpen.value = false
  isFocused.value = false
  highlightedIndex.value = -1
  isCustomInputMode.value = false
  internalInputText.value = '' // ⭐ 변경
  emit('blur')
}

function selectOption(option: Option) {
  if (option.disabled) return

  const value = getOptionValue(option)
  emit('update:modelValue', value)
  emit('change', value)

  if (props.customInputValue !== null) {
    emit('update:customText', null)
  }

  isCustomInputMode.value = false
  internalInputText.value = '' // ⭐ 변경
  closeDropdown()
}

function activateCustomInput() {
  isCustomInputMode.value = true
  internalInputText.value = '' // ⭐ 변경
  nextTick(() => {
    customInputRef.value?.focus()
  })
}

function confirmCustomInput() {
  const trimmedValue = internalInputText.value.trim() // ⭐ 변경
  if (!trimmedValue) return

  if (props.customInputValue !== null) {
    emit('update:modelValue', props.customInputValue)
    emit('change', props.customInputValue)
    emit('update:customText', trimmedValue)
  } else {
    emit('update:modelValue', trimmedValue)
    emit('change', trimmedValue)
  }

  closeDropdown()
}

function cancelCustomInput() {
  isCustomInputMode.value = false
  internalInputText.value = '' // ⭐ 변경
}

function navigateOptions(direction: number) {
  if (!isOpen.value) {
    openDropdown()
    return
  }

  const totalOptions = props.allowCustomInput
    ? normalizedOptions.value.length + 1
    : normalizedOptions.value.length
  const maxIndex = totalOptions - 1
  let newIndex = highlightedIndex.value + direction

  if (newIndex < 0) {
    newIndex = maxIndex
  } else if (newIndex > maxIndex) {
    newIndex = 0
  }

  highlightedIndex.value = newIndex
  scrollToOption(newIndex)
}

function scrollToOption(index: number) {
  nextTick(() => {
    const optionsWrapper = selectRef.value?.querySelector('.options-wrapper')
    const optionElements = optionsWrapper?.querySelectorAll('.option-item')
    const optionElement = optionElements?.[index] as HTMLElement

    if (optionsWrapper && optionElement) {
      const wrapperRect = optionsWrapper.getBoundingClientRect()
      const optionRect = optionElement.getBoundingClientRect()

      if (optionRect.bottom > wrapperRect.bottom) {
        optionElement.scrollIntoView({ block: 'nearest' })
      } else if (optionRect.top < wrapperRect.top) {
        optionElement.scrollIntoView({ block: 'nearest' })
      }
    }
  })
}

function calculateDropdownPosition() {
  if (!selectRef.value) return

  const rect = selectRef.value.getBoundingClientRect()
  const spaceBelow = window.innerHeight - rect.bottom
  const spaceAbove = rect.top
  const dropdownHeight = 300

  if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
    dropdownStyle.value = {
      bottom: '100%',
      marginBottom: '4px'
    }
  } else {
    dropdownStyle.value = {
      top: '100%',
      marginTop: '4px'
    }
  }
}

function handleScroll() {
  // 무한 스크롤 등 추가 기능
}

function handleContainerClick(event: MouseEvent) {
  if (props.isDisabled) return

  const target = event.target as HTMLElement
  if (target.tagName === 'BUTTON' || target.closest('button')) {
    return
  }

  if (!isOpen.value) {
    openDropdown()
  }
}

function handleClickOutside(event: MouseEvent) {
  if (fieldRef.value && !fieldRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

function handleOtherSelectOpen(e: Event) {
  const customEvent = e as CustomEvent<{ selectId: string }>
  if (isOpen.value && customEvent.detail.selectId !== selectId) {
    closeDropdown()
  }
}

watch(
  () => props.isDisabled,
  () => {
    if (props.isDisabled) {
      closeDropdown()
    }
  }
)

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('select-open', handleOtherSelectOpen)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('select-open', handleOtherSelectOpen)
})

defineExpose({
  focus: openDropdown,
  blur: closeDropdown
})
</script>

<style scoped lang="scss">
.floating-custom-select {
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
  height: 74px;
  border: 1px solid #bbbbbb;
  border-radius: 8px;
  background: white;
  transition: all 0.2s ease;
  padding: 12px;
  display: flex;
  align-items: center;

  &:not(.has-content) {
    .custom-select {
      opacity: 0;
    }
  }

  &.has-content {
    .custom-select {
      opacity: 1;
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

.custom-select {
  position: relative;
  width: 100%;
  user-select: none;
  transition: opacity 0.2s ease;

  &.is-disabled {
    cursor: not-allowed;
  }
}

.select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  cursor: pointer;
  outline: none;

  .is-disabled & {
    cursor: not-allowed;
  }
}

.selected-value {
  flex: 1;
  font-size: 15px;
  color: #1a1a1a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &.is-placeholder {
    color: #999999;
  }
}

.arrow {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: #666666;
  transition: transform 0.2s ease;

  &.is-open {
    transform: rotate(180deg);
  }
}

.dropdown-menu {
  position: absolute;
  left: 0;
  right: 0;
  z-index: 1000;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.options-wrapper {
  max-height: 300px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;

    &:hover {
      background: #a1a1a1;
    }
  }
}

.option-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.15s ease;
  outline: none;

  &:hover,
  &.is-highlighted,
  &:focus {
    background-color: #f3f4f6;
  }

  &.is-selected {
    background-color: #e0f2f1;
    color: #21adad;
    font-weight: 500;
  }

  &.is-active {
    background-color: #e0f2f1;
    color: #21adad;
    font-weight: 500;
  }

  &:active {
    background-color: #e5e7eb;
  }

  &.custom-input-option {
    border-top: 1px solid #e5e7eb;
    color: #21adad;
    font-weight: 500;
  }
}

.option-label {
  flex: 1;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.check-icon {
  flex-shrink: 0;
  margin-left: 8px;
  color: #21adad;
  font-size: 16px;
  font-weight: bold;
}

.custom-input-wrapper {
  padding: 12px 16px;
  border-top: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.custom-input-field {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  margin-bottom: 8px;

  &:focus {
    border-color: #21adad;
    box-shadow: 0 0 0 3px rgba(33, 173, 173, 0.1);
  }
}

.custom-input-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.btn-cancel,
.btn-confirm {
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  outline: none;

  &:active {
    transform: translateY(1px);
  }
}

.btn-cancel {
  background: #f3f4f6;
  color: #6b7280;

  &:hover {
    background: #e5e7eb;
  }
}

.btn-confirm {
  background: #21adad;
  color: white;

  &:hover {
    background: #1d9999;
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

// Transition
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: top;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: scaleY(0.95);
}

.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: scaleY(1);
}
</style>
