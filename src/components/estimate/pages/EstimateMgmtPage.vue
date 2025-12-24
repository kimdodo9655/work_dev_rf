<template>
  <div class="Search-panel">
    <form @submit.prevent="handleSubmit">
      <div class="input-area">
        <!-- 등기유형 선택 -->
        <SearchSelect
          v-model="selectRegistrationType"
          :label="t('estimate.search.registrationType')"
          :options="optionRegistrationType"
          @change="handleRegistrationType"
        />

        <!-- 필지 선택 -->
        <SearchSelect
          v-model="selectLot"
          :label="t('estimate.search.lot')"
          :options="optionLot"
          @change="handleLot"
        />

        <SearchDateRangePicker
          v-model="dateRange1"
          label="등기의뢰일자 선택"
          @change="handleChange1"
        />
        <SearchDateRangePicker
          v-model="dateRange2"
          label="등기접수일자 선택"
          @change="handleChange2"
        />
        <SearchSelect
          v-model="selectedCity"
          :options="cityOptions"
          label="도시 선택"
          placeholder="도시를 선택해주세요"
          @change="handleCityChange"
        />
        <SearchSelect
          v-model="selectedCity"
          :options="cityOptions"
          label="도시 선택"
          placeholder="도시를 선택해주세요"
          @change="handleCityChange"
        />

        <SearchSelect
          v-model="selectedCategory"
          :options="categoryOptions"
          label="카테고리"
          placeholder="카테고리를 선택해주세요"
        />
        <SearchInput
          v-model="searchKeyword"
          label="상품 검색"
          placeholder="상품명을 입력하세요"
          @search="handleSearch"
        />
      </div>
      <input type="submit" value="검색" />
    </form>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

import SearchDateRangePicker from '@/components/template/input/SearchDateRangePicker.vue'
import SearchInput from '@/components/template/input/SearchInput.vue'
import SearchSelect from '@/components/template/input/SearchSelect.vue'
import { useMessage } from '@/composables/useMessage'

const { t } = useMessage()
const handleSubmit = async () => {}

/* ***********************************
 * search panel
 *********************************** */

// --------------------------------------------------------------- 등기유형 선택

// 선택한 등기유형
const selectRegistrationType = ref<string | number | null>('')

// 등기유형 선택 option : 전체(default) / 소유권이전
const optionRegistrationType = [
  { label: t('common.all'), value: '' },
  {
    label: t('estimate.search.value.ownershipTransfer'),
    value: t('estimate.search.value.ownershipTransfer')
  }
]

// 등기유형 handle
function handleRegistrationType(value: string | number | null) {
  console.log('선택된 등기유형:', value)
}

// --------------------------------------------------------------- 필지 선택

// 선택한 필지
const selectLot = ref<string | number | null>('')

// 필지 선택 option : 전체(default) / 1 ~ 20
const optionLot = computed(() => [
  { label: t('common.all'), value: '' },
  ...Array.from({ length: 20 }, (_, i) => ({
    label: String(i + 1),
    value: String(i + 1)
  }))
])

// 필지 handle
function handleLot(value: string | number | null) {
  console.log('선택된 필지:', value)
}

// 기간선택
interface DateRange {
  startDate: string | null
  endDate: string | null
}

// 날짜를 YYYY-MM-DD 형식으로 포맷
function formatPickerDate(date: Date): string {
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

// 등기의뢰일자 선택
// 시작일 오늘, 종료일 오늘로부터 1개월 후
const dateRange1 = ref<DateRange>({
  startDate: formatPickerDate(today),
  endDate: formatPickerDate(addOneMonth(today))
})

// 등기접수일자 선택

// 시작일 오늘로부터 1개월 전, 종료일 오늘
const dateRange2 = ref<DateRange>({
  startDate: formatPickerDate(subtractOneMonth(today)),
  endDate: formatPickerDate(today)
})
// 진행상태 선택
// 작성여부 선택
// 선정여부 선택
//통합검색

function handleChange1(value: DateRange) {
  console.log('dateRange1 changed:', value)
}

function handleChange2(value: DateRange) {
  console.log('dateRange2 changed:', value)
}

const selectedCity = ref<string | number | null>(null)
const selectedCategory = ref<string | number | null>('it')

const cityOptions = [
  { label: '서울', value: 'seoul' },
  { label: '부산', value: 'busan' },
  { label: '대구', value: 'daegu' },
  { label: '인천', value: 'incheon' }
]

const categoryOptions = [
  { label: 'IT/개발', value: 'it' },
  { label: '디자인', value: 'design' },
  { label: '마케팅', value: 'marketing' }
]

function handleCityChange(value: string | number | null) {
  console.log('선택된 도시:', value)
}

const searchKeyword = ref('')

function handleSearch(value: string) {
  console.log('검색:', value)
  // API 호출 등
}
</script>
