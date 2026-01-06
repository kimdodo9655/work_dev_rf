<template>
  <div
    ref="selectRef"
    class="floating-inner-select"
    :class="{ 'is-disabled': disabled, 'is-open': isOpen }"
  >
    <!-- FloatingInput이 감지할 수 있는 숨겨진 input -->
    <input
      ref="hiddenInput"
      type="text"
      :value="modelValue || ''"
      readonly
      style="position: absolute; width: 1px; height: 1px; opacity: 0; z-index: -1"
    />

    <div
      class="select-trigger"
      :tabindex="disabled ? -1 : 0"
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
      <div v-show="isOpen" class="dropdown-menu" :style="dropdownStyle" @click.stop>
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
            @click="selectOption(option)"
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
            @click="activateCustomInput"
            @mouseenter="highlightedIndex = normalizedOptions.length"
            @focus="highlightedIndex = normalizedOptions.length"
            @keydown.enter.prevent="activateCustomInput"
          >
            <span class="option-label">직접입력</span>
            <span v-if="shouldShowCustomInputCheck" class="check-icon">✓</span>
          </div>

          <!-- 직접입력 필드 -->
          <div v-if="allowCustomInput && isCustomInputMode" class="custom-input-wrapper">
            <input
              ref="customInputRef"
              v-model="customInputValue"
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
  modelValue?: string | number | null
  options: Option[] | string[] | number[]
  disabled?: boolean
  placeholder?: string
  labelKey?: string
  valueKey?: string
  allowCustomInput?: boolean
  customInputPlaceholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  disabled: false,
  placeholder: '선택하세요',
  labelKey: 'label',
  valueKey: 'value',
  allowCustomInput: false,
  customInputPlaceholder: '직접 입력하세요'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null]
  change: [value: string | number | null]
  focus: []
  blur: []
}>()

// 고유 ID 생성
const selectId = `select-${Math.random().toString(36).substr(2, 9)}`

const selectRef = ref<HTMLElement | null>(null)
const hiddenInput = ref<HTMLInputElement | null>(null)
const customInputRef = ref<HTMLInputElement | null>(null)
const isOpen = ref(false)
const highlightedIndex = ref(-1)
const dropdownStyle = ref<Record<string, string>>({})
const isCustomInputMode = ref(false)
const customInputValue = ref('')

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

// 값이 있는지 체크
const hasValue = computed(() => {
  return props.modelValue !== null && props.modelValue !== undefined && props.modelValue !== ''
})

// 현재 값이 옵션 목록에 있는지 확인
const isValueInOptions = computed(() => {
  return normalizedOptions.value.some((option) => getOptionValue(option) === props.modelValue)
})

// 직접입력 체크 아이콘을 표시해야 하는지
const shouldShowCustomInputCheck = computed(() => {
  return isCustomInputMode.value || (hasValue.value && !isValueInOptions.value)
})

// 선택된 값 표시
const displayValue = computed(() => {
  if (!hasValue.value) {
    return props.placeholder
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

// 옵션 값 추출
function getOptionValue(option: Option): string | number {
  return option[props.valueKey]
}

// 옵션 라벨 추출
function getOptionLabel(option: Option): string {
  return String(option[props.labelKey])
}

// 선택 여부 확인
function isSelected(option: Option): boolean {
  return getOptionValue(option) === props.modelValue && !isCustomInputMode.value
}

// 드롭다운 토글
function toggleDropdown() {
  if (props.disabled) return

  if (isOpen.value) {
    closeDropdown()
  } else {
    openDropdown()
  }
}

// 드롭다운 열기
function openDropdown() {
  if (props.disabled) return

  // 다른 셀렉트에게 알림
  document.dispatchEvent(new CustomEvent('select-open', { detail: { selectId } }))

  isOpen.value = true

  // FloatingInput에 focus 이벤트 전달
  if (hiddenInput.value) {
    hiddenInput.value.focus()
  }
  emit('focus')

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
    } else if (props.allowCustomInput && !isValueInOptions.value && hasValue.value) {
      highlightedIndex.value = normalizedOptions.value.length
    }
  })
}

// 드롭다운 닫기
function closeDropdown() {
  isOpen.value = false
  highlightedIndex.value = -1
  isCustomInputMode.value = false
  customInputValue.value = ''

  // FloatingInput에 blur 이벤트 전달
  if (hiddenInput.value) {
    hiddenInput.value.blur()
  }
  emit('blur')
}

// 옵션 선택
function selectOption(option: Option) {
  if (option.disabled) return

  const value = getOptionValue(option)
  emit('update:modelValue', value)
  emit('change', value)

  // FloatingInput에 input/change 이벤트 전달
  nextTick(() => {
    if (hiddenInput.value) {
      hiddenInput.value.dispatchEvent(new Event('input', { bubbles: true }))
      hiddenInput.value.dispatchEvent(new Event('change', { bubbles: true }))
    }
  })

  isCustomInputMode.value = false
  customInputValue.value = ''
  closeDropdown()
}

// 직접입력 활성화
function activateCustomInput() {
  isCustomInputMode.value = true
  if (props.modelValue && !isValueInOptions.value) {
    customInputValue.value = String(props.modelValue)
  } else {
    customInputValue.value = ''
  }
  nextTick(() => {
    customInputRef.value?.focus()
  })
}

// 직접입력 확인
function confirmCustomInput() {
  const trimmedValue = customInputValue.value.trim()
  if (trimmedValue) {
    emit('update:modelValue', trimmedValue)
    emit('change', trimmedValue)

    nextTick(() => {
      if (hiddenInput.value) {
        hiddenInput.value.dispatchEvent(new Event('input', { bubbles: true }))
        hiddenInput.value.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    closeDropdown()
  }
}

// 직접입력 취소
function cancelCustomInput() {
  isCustomInputMode.value = false
  customInputValue.value = ''
}

// 키보드 네비게이션
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

// 옵션으로 스크롤
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

// 드롭다운 위치 계산
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

// 스크롤 핸들러
function handleScroll() {
  // 무한 스크롤 등
}

// 외부 클릭 처리
function handleClickOutside(event: MouseEvent) {
  if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

// 다른 셀렉트가 열렸을 때 처리
function handleOtherSelectOpen(e: Event) {
  const customEvent = e as CustomEvent<{ selectId: string }>
  if (isOpen.value && customEvent.detail.selectId !== selectId) {
    closeDropdown()
  }
}

// props 변경 시 상태 업데이트
watch(
  () => props.disabled,
  () => {
    if (props.disabled) {
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
.floating-inner-select {
  position: relative;
  width: 100%;
  user-select: none;

  &.is-disabled {
    cursor: not-allowed;
  }
}

.select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
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
