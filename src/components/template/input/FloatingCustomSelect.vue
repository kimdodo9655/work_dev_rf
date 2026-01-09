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
  customText?: string | null // 직접입력 실제 텍스트 (선택값/입력값 분리 모드에서만 사용)
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
  customInputValue: null,
  customText: null
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
const internalInputText = ref('')

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

  // 직접입력이 선택된 경우
  if (isCustomInputSelected.value) {
    // 선택값/입력값 분리 모드
    if (props.customInputValue !== null) {
      // customText가 있으면 그걸 표시, 없으면 placeholder
      return props.customText || props.placeholder
    }
    // 기존 모드 (입력값이 바로 modelValue)
    return String(props.modelValue)
  }

  // 옵션 목록에서 찾기
  const selected = normalizedOptions.value.find(
    (option) => getOptionValue(option) === props.modelValue
  )

  if (selected) {
    return getOptionLabel(selected)
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
      // 직접입력이 이미 선택되어 있으면 자동으로 입력 모드 활성화
      activateCustomInput()
    }
  })
}

function closeDropdown() {
  isOpen.value = false
  isFocused.value = false
  highlightedIndex.value = -1
  isCustomInputMode.value = false
  internalInputText.value = ''
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
  internalInputText.value = ''
  closeDropdown()
}

function activateCustomInput() {
  isCustomInputMode.value = true

  // 기존에 입력된 값이 있으면 불러오기
  if (props.customInputValue !== null) {
    // 선택값/입력값 분리 모드: customText 사용
    internalInputText.value = props.customText || ''
  } else {
    // 기존 모드: modelValue가 옵션에 없으면 그게 직접입력 값
    if (props.modelValue && !isValueInOptions.value) {
      internalInputText.value = String(props.modelValue)
    } else {
      internalInputText.value = ''
    }
  }

  nextTick(() => {
    customInputRef.value?.focus()
  })
}

function confirmCustomInput() {
  const trimmedValue = internalInputText.value.trim()
  if (!trimmedValue) return

  if (props.customInputValue !== null) {
    // 선택값/입력값 분리 모드
    emit('update:modelValue', props.customInputValue)
    emit('change', props.customInputValue)
    emit('update:customText', trimmedValue)
  } else {
    // 기존 모드
    emit('update:modelValue', trimmedValue)
    emit('change', trimmedValue)
  }

  closeDropdown()
}

function cancelCustomInput() {
  isCustomInputMode.value = false
  internalInputText.value = ''
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
