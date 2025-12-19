<template>
  <div ref="pickerRef" class="date-range-picker">
    <label v-if="label" class="picker-label">{{ label }}</label>
    <div class="picker-input-wrapper">
      <input
        type="text"
        :value="displayValue"
        :placeholder="placeholder"
        readonly
        @click="toggleCalendar"
      />
      <button class="dropdown-btn" @click="toggleCalendar">▼</button>
    </div>

    <div v-show="isOpen" class="calendar-dropdown">
      <div class="calendar">
        <div class="calendar-header">
          <button @click="prevMonth" :disabled="!canGoPrev">◀</button>
          <span>{{ currentYear }}년 {{ currentMonth }}월</span>
          <button @click="nextMonth" :disabled="!canGoNext">▶</button>
        </div>

        <div class="calendar-body">
          <div class="weekdays">
            <div v-for="day in weekdays" :key="day">{{ day }}</div>
          </div>

          <div class="days">
            <div
              v-for="(day, index) in calendarDays"
              :key="index"
              class="day"
              :class="{
                'other-month': day.isOtherMonth,
                disabled: day.disabled,
                selected: day.isSelected,
                'in-range': day.inRange,
                'range-start': day.isRangeStart,
                'range-end': day.isRangeEnd
              }"
              @click="selectDate(day)"
            >
              {{ day.date }}
            </div>
          </div>
        </div>

        <div class="selected-period">
          {{ periodText }}
        </div>

        <div class="calendar-footer">
          <button
            class="confirm-btn"
            :disabled="!tempStartDate || !tempEndDate"
            @click="confirmSelection"
          >
            설정
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

interface CalendarDay {
  date: number
  fullDate: Date
  isOtherMonth: boolean
  disabled: boolean
  isSelected: boolean
  inRange: boolean
  isRangeStart: boolean
  isRangeEnd: boolean
}

interface Props {
  modelValue?: {
    startDate: string | null
    endDate: string | null
  }
  label?: string
  placeholder?: string
  monthRange?: number // 시작일 기준 선택 가능한 개월 수 (기본 3개월)
}

interface Emits {
  (e: 'update:modelValue', value: { startDate: string | null; endDate: string | null }): void
  (e: 'change', value: { startDate: string | null; endDate: string | null }): void
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  placeholder: 'YYYY-MM-DD ~ YYYY-MM-DD',
  monthRange: 3
})

const emit = defineEmits<Emits>()

// Refs
const pickerRef = ref<HTMLDivElement>()
const isOpen = ref(false)
const pickerId = ref(`picker-${Math.random().toString(36).substr(2, 9)}`)
const startDate = ref<Date | null>(null)
const endDate = ref<Date | null>(null)
const tempStartDate = ref<Date | null>(null)
const tempEndDate = ref<Date | null>(null)
const calendarMode = ref<'start' | 'end'>('start')
const currentYear = ref(new Date().getFullYear())
const currentMonth = ref(new Date().getMonth() + 1)

const weekdays = ['일', '월', '화', '수', '목', '금', '토']

// Computed
const displayValue = computed(() => {
  if (startDate.value && endDate.value) {
    return `${formatDate(startDate.value)} ~ ${formatDate(endDate.value)}`
  }
  return ''
})

const periodText = computed(() => {
  return calculatePeriod(tempStartDate.value, tempEndDate.value)
})

const minMaxDates = computed(() => {
  if (!tempStartDate.value) return { min: null, max: null }

  const min = new Date(tempStartDate.value)
  min.setMonth(min.getMonth() - props.monthRange)
  min.setDate(min.getDate() + 1)

  const max = new Date(tempStartDate.value)
  max.setMonth(max.getMonth() + props.monthRange)
  max.setDate(max.getDate() - 1)

  return { min, max }
})

const canGoPrev = computed(() => {
  const { min } = minMaxDates.value
  if (!min) return true

  const firstDayOfCurrentMonth = new Date(currentYear.value, currentMonth.value - 1, 1)
  return firstDayOfCurrentMonth > min
})

const canGoNext = computed(() => {
  const { max } = minMaxDates.value
  if (!max) return true

  const lastDayOfCurrentMonth = new Date(currentYear.value, currentMonth.value, 0)
  return lastDayOfCurrentMonth < max
})

const calendarDays = computed((): CalendarDay[] => {
  const days: CalendarDay[] = []
  const firstDay = new Date(currentYear.value, currentMonth.value - 1, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value, 0)
  const prevLastDay = new Date(currentYear.value, currentMonth.value - 1, 0)

  const firstDayOfWeek = firstDay.getDay()
  const lastDate = lastDay.getDate()
  const prevLastDate = prevLastDay.getDate()

  const { min, max } = minMaxDates.value

  // 이전 달 날짜들
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = prevLastDate - i
    const fullDate = new Date(currentYear.value, currentMonth.value - 2, date)
    days.push(createCalendarDay(fullDate, date, true, min, max))
  }

  // 현재 달 날짜들
  for (let date = 1; date <= lastDate; date++) {
    const fullDate = new Date(currentYear.value, currentMonth.value - 1, date)
    days.push(createCalendarDay(fullDate, date, false, min, max))
  }

  // 다음 달 날짜들
  const remainingDays = 42 - days.length
  for (let date = 1; date <= remainingDays; date++) {
    const fullDate = new Date(currentYear.value, currentMonth.value, date)
    days.push(createCalendarDay(fullDate, date, true, min, max))
  }

  return days
})

// Methods
function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function isSameDay(date1: Date | null, date2: Date | null): boolean {
  if (!date1 || !date2) return false
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

function isDateInRange(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false
  return date >= start && date <= end
}

function isDateDisabled(date: Date, min: Date | null, max: Date | null): boolean {
  if (!min || !max) return false
  return date < min || date > max
}

function createCalendarDay(
  fullDate: Date,
  date: number,
  isOtherMonth: boolean,
  min: Date | null,
  max: Date | null
): CalendarDay {
  return {
    date,
    fullDate,
    isOtherMonth,
    disabled: isDateDisabled(fullDate, min, max),
    isSelected: isSameDay(fullDate, tempStartDate.value) || isSameDay(fullDate, tempEndDate.value),
    inRange: isDateInRange(fullDate, tempStartDate.value, tempEndDate.value),
    isRangeStart: tempStartDate.value ? isSameDay(fullDate, tempStartDate.value) : false,
    isRangeEnd: tempEndDate.value ? isSameDay(fullDate, tempEndDate.value) : false
  }
}

function calculatePeriod(start: Date | null, end: Date | null): string {
  if (!start || !end) {
    return '기간을 선택해주세요'
  }

  const startCopy = new Date(start)
  const adjustedEnd = new Date(end)
  adjustedEnd.setDate(adjustedEnd.getDate() + 1)

  let years = adjustedEnd.getFullYear() - startCopy.getFullYear()
  let months = adjustedEnd.getMonth() - startCopy.getMonth()
  let days = adjustedEnd.getDate() - startCopy.getDate()

  if (days < 0) {
    months--
    const prevMonth = new Date(adjustedEnd.getFullYear(), adjustedEnd.getMonth(), 0)
    days += prevMonth.getDate()
  }

  if (months < 0) {
    years--
    months += 12
  }

  let result = '선택한 기간: '

  if (years > 0) {
    result += `${years}년 `
  }

  if (months > 0 && days > 0) {
    result += `${months}개월 ${days}일`
  } else if (months > 0) {
    result += `${months}개월`
  } else if (days > 0) {
    result += `${days}일`
  } else {
    result += '0일'
  }

  return result
}

function openCalendar() {
  // 다른 피커들에게 닫기 이벤트 전파
  document.dispatchEvent(new CustomEvent('picker-open', { detail: { pickerId: pickerId.value } }))

  tempStartDate.value = startDate.value ? new Date(startDate.value) : null
  tempEndDate.value = endDate.value ? new Date(endDate.value) : null
  calendarMode.value = 'start'

  if (tempStartDate.value) {
    currentYear.value = tempStartDate.value.getFullYear()
    currentMonth.value = tempStartDate.value.getMonth() + 1
  } else {
    const today = new Date()
    currentYear.value = today.getFullYear()
    currentMonth.value = today.getMonth() + 1
  }

  isOpen.value = true
}

function toggleCalendar() {
  if (isOpen.value) {
    // 이미 열려있으면 닫기
    cancelSelection()
  } else {
    // 닫혀있으면 열기
    openCalendar()
  }
}

function closeCalendar() {
  isOpen.value = false
}

function confirmSelection() {
  if (tempStartDate.value && tempEndDate.value) {
    startDate.value = new Date(tempStartDate.value)
    endDate.value = new Date(tempEndDate.value)

    const value = {
      startDate: formatDate(startDate.value),
      endDate: formatDate(endDate.value)
    }

    emit('update:modelValue', value)
    emit('change', value)
    closeCalendar()
  }
}

function cancelSelection() {
  tempStartDate.value = null
  tempEndDate.value = null
  closeCalendar()
}

function selectDate(day: CalendarDay) {
  if (day.disabled) return

  if (calendarMode.value === 'start') {
    // 같은 날짜 클릭 시 선택 취소
    if (tempStartDate.value && isSameDay(day.fullDate, tempStartDate.value)) {
      tempStartDate.value = null
      tempEndDate.value = null
      calendarMode.value = 'start'
      return
    }

    tempStartDate.value = new Date(day.fullDate)
    tempEndDate.value = null
    calendarMode.value = 'end'
  } else {
    // 이미 시작일과 종료일이 모두 선택되어 있으면 새로운 시작일로
    if (tempStartDate.value && tempEndDate.value) {
      tempStartDate.value = new Date(day.fullDate)
      tempEndDate.value = null
      calendarMode.value = 'end'
      return
    }

    // 종료일이 시작일보다 이전이면 시작일 재설정
    if (tempStartDate.value && day.fullDate < tempStartDate.value) {
      tempStartDate.value = new Date(day.fullDate)
      tempEndDate.value = null
      calendarMode.value = 'end'
    } else {
      tempEndDate.value = new Date(day.fullDate)
    }
  }

  checkCalendarRange()
}

function prevMonth() {
  if (!canGoPrev.value) return

  if (currentMonth.value === 1) {
    currentMonth.value = 12
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

function nextMonth() {
  if (!canGoNext.value) return

  if (currentMonth.value === 12) {
    currentMonth.value = 1
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

function checkCalendarRange() {
  if (!tempStartDate.value) return

  const { min, max } = minMaxDates.value
  if (!min || !max) return

  const currentViewDate = new Date(currentYear.value, currentMonth.value - 1, 1)

  if (currentViewDate < min || currentViewDate > max) {
    currentYear.value = tempStartDate.value.getFullYear()
    currentMonth.value = tempStartDate.value.getMonth() + 1
  }
}

function handleClickOutside(e: Event) {
  if (isOpen.value && pickerRef.value && !pickerRef.value.contains(e.target as Node)) {
    cancelSelection()
  }
}

function handleOtherPickerOpen(e: CustomEvent) {
  // 다른 피커가 열렸을 때 현재 피커가 열려있고, 다른 피커의 ID가 현재 ID와 다르면 닫기
  if (isOpen.value && e.detail.pickerId !== pickerId.value) {
    cancelSelection()
  }
}

// Watch modelValue
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue?.startDate && newValue?.endDate) {
      startDate.value = new Date(newValue.startDate)
      endDate.value = new Date(newValue.endDate)
    } else {
      startDate.value = null
      endDate.value = null
    }
  },
  { immediate: true }
)

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('picker-open', handleOtherPickerOpen as any)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('picker-open', handleOtherPickerOpen as any)
})
</script>

<style scoped>
.date-range-picker {
  font-family: inherit;
  position: relative;
}

.picker-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.picker-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
}

.picker-input-wrapper input {
  flex: 1;
  padding: 10px 12px;
  border: none;
  font-size: 14px;
  cursor: pointer;
  background: transparent;
}

.picker-input-wrapper input:focus {
  outline: none;
}

.dropdown-btn {
  padding: 10px 12px;
  background: none;
  border: none;
  border-left: 1px solid #ddd;
  cursor: pointer;
  font-size: 12px;
  color: #666;
  transition: background 0.2s;
}

.dropdown-btn:hover {
  background: #f5f5f5;
}

.calendar-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  width: fit-content;
  margin-top: 8px;
  z-index: 1000;
}

.calendar {
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  border: 1px solid #e5e7eb;
  padding: 16px;
  width: 100%;
  max-width: 320px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.calendar-header button {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  transition: all 0.2s;
}

.calendar-header button:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #d1d5db;
}

.calendar-header button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.calendar-header span {
  font-weight: 600;
  font-size: 16px;
  color: #111827;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
}

.weekdays div {
  text-align: center;
  font-size: 11px;
  font-weight: 600;
  color: #666;
  padding: 6px 0;
}

.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  position: relative;
  min-height: 32px;
}

.day::before,
.day::after {
  position: absolute;
  font-size: 9px;
  font-weight: 600;
  color: #21adad;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
}

.day.range-start::before {
  content: '시작일';
  background-color: #21adad;
  color: #fff;
  padding: 5px 0 0;
  width: 32px;
  border-radius: 5px 5px 0 0;
  text-align: center;
  top: -10px;
}

.day.range-end::after {
  content: '종료일';
  background-color: #21adad;
  color: #fff;
  padding: 0 0 5px;
  width: 32px;
  border-radius: 0 0 5px 5px;
  text-align: center;
  bottom: -10px;
}

.day:hover:not(.disabled):not(.other-month) {
  background: #ebf7f8;
}

.day.other-month {
  color: #ccc;
}

.day.disabled {
  color: #ddd;
  cursor: not-allowed;
}

.day.disabled:hover {
  background: none;
}

.day.selected {
  background: #2563eb;
  color: white;
  font-weight: 600;
}

.day.in-range {
  background: #ebf7f8;
}

.day.range-start,
.day.range-end {
  background: #21adad;
  color: white;
  font-weight: 600;
}

.selected-period {
  margin-top: 12px;
  padding: 10px;
  background: #ebf7f8;
  border-radius: 4px;
  text-align: center;
  font-size: 12px;
  color: #0369a1;
  font-weight: 500;
}

.calendar-footer {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #ebf7f8;
  text-align: right;
}

.confirm-btn {
  padding: 8px 24px;
  border: none;
  border-radius: 4px;
  background: #21adad;
  color: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s;
}

.confirm-btn:hover {
  background: #21adad;
}

.confirm-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}
</style>
