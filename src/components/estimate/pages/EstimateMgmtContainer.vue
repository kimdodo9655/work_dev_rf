<template>
  <div class="Search-panel">
    <form @submit.prevent="handleSubmit">
      <FormDateRangePicker v-model="dateRange1" label="" @change="handleChange1" />
      <FormDateRangePicker v-model="dateRange2" label="" @change="handleChange2" />

      <input type="Search" placeholder="검색어 입력" />
      <input type="submit" value="검색" />
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import FormDateRangePicker from '@/components/template/input/FormDateRangePicker.vue'

const handleSubmit = async () => {}

interface DateRange {
  startDate: string | null
  endDate: string | null
}

// 날짜를 YYYY-MM-DD 형식으로 포맷
function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 해당 월의 말일 구하기
function getLastDayOfMonth(date: Date): Date {
  const result = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  return result
}

// 1개월 후 계산
function addOneMonth(date: Date): Date {
  // 1일이면 해당 월의 말일 반환
  if (date.getDate() === 1) {
    return getLastDayOfMonth(date)
  }

  // 1일이 아니면 월 +1, 일 -1
  const result = new Date(date)
  result.setMonth(result.getMonth() + 1)
  result.setDate(result.getDate() - 1)
  return result
}

// 1개월 전 계산
function subtractOneMonth(date: Date): Date {
  // 말일이면 전달 1일 반환
  const lastDay = getLastDayOfMonth(date)
  if (date.getDate() === lastDay.getDate()) {
    return new Date(date.getFullYear(), date.getMonth(), 1)
  }

  // 말일이 아니면 월 -1, 일 +1
  const result = new Date(date)
  result.setMonth(result.getMonth() - 1)
  result.setDate(result.getDate() + 1)
  return result
}

const today = new Date()

// 피커 1: 시작일 오늘, 종료일 오늘로부터 1개월 후
const dateRange1 = ref<DateRange>({
  startDate: formatDate(today),
  endDate: formatDate(addOneMonth(today))
})

// 피커 2: 시작일 오늘로부터 1개월 전, 종료일 오늘
const dateRange2 = ref<DateRange>({
  startDate: formatDate(subtractOneMonth(today)),
  endDate: formatDate(today)
})

function handleChange1(value: DateRange) {
  console.log('dateRange1 changed:', value)
}

function handleChange2(value: DateRange) {
  console.log('dateRange2 changed:', value)
}
</script>

<style lang="scss" scoped></style>
