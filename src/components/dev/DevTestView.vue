<template>
  <div class="app-container">
    <h1>FormDateRangePicker 사용 예시</h1>

    <!-- 기본 사용 -->
    <section>
      <h2>1. 기본 사용</h2>
      <FormDateRangePicker v-model="dateRange1" label="등기일자입력 선택" @change="handleChange1" />
      <div v-if="dateRange1.startDate" class="result">
        <p>시작일: {{ dateRange1.startDate }}</p>
        <p>종료일: {{ dateRange1.endDate }}</p>
      </div>
    </section>

    <!-- 여러 개 사용 (독립적으로 동작) -->
    <section>
      <h2>2. 여러 개 사용 (각각 독립적으로 동작)</h2>
      <div class="multi-picker">
        <div class="picker-item">
          <FormDateRangePicker
            v-model="dateRange2"
            label="계약 시작 기간"
            @change="handleChange2"
          />
          <div v-if="dateRange2.startDate" class="mini-result">
            {{ dateRange2.startDate }} ~ {{ dateRange2.endDate }}
          </div>
        </div>

        <div class="picker-item">
          <FormDateRangePicker
            v-model="dateRange3"
            label="계약 종료 기간"
            @change="handleChange3"
          />
          <div v-if="dateRange3.startDate" class="mini-result">
            {{ dateRange3.startDate }} ~ {{ dateRange3.endDate }}
          </div>
        </div>

        <div class="picker-item">
          <FormDateRangePicker v-model="dateRange4" label="연장 기간" @change="handleChange4" />
          <div v-if="dateRange4.startDate" class="mini-result">
            {{ dateRange4.startDate }} ~ {{ dateRange4.endDate }}
          </div>
        </div>
      </div>
    </section>

    <!-- 커스텀 개월 범위 -->
    <section>
      <h2>3. 다른 개월 범위 설정</h2>
      <div class="multi-picker">
        <div class="picker-item">
          <FormDateRangePicker
            v-model="dateRange5"
            label="단기 프로젝트 (1개월 범위)"
            :month-range="1"
          />
        </div>

        <div class="picker-item">
          <FormDateRangePicker
            v-model="dateRange6"
            label="장기 프로젝트 (6개월 범위)"
            :month-range="6"
          />
        </div>
      </div>
    </section>

    <!-- 폼 안에서 사용 -->
    <section>
      <h2>4. 폼 안에서 사용</h2>
      <form @submit.prevent="handleSubmit" class="form-example">
        <div class="form-group">
          <label>프로젝트명</label>
          <input v-model="formData.projectName" type="text" placeholder="프로젝트명 입력" />
        </div>

        <div class="form-group">
          <FormDateRangePicker v-model="formData.period" label="프로젝트 기간" :month-range="5" />
        </div>

        <div class="form-group">
          <label>담당자</label>
          <input v-model="formData.manager" type="text" placeholder="담당자 입력" />
        </div>

        <button type="submit" class="submit-btn" :disabled="!isFormValid">제출</button>

        <div v-if="submittedData" class="submitted-result">
          <h3>제출된 데이터:</h3>
          <pre>{{ submittedData }}</pre>
        </div>
      </form>
    </section>

    <!-- API 연동 예시 -->
    <section>
      <h2>5. API 연동 시뮬레이션</h2>
      <FormDateRangePicker v-model="apiDateRange" label="조회 기간" @change="fetchData" />

      <div v-if="loading" class="loading">데이터 로딩 중...</div>

      <div v-else-if="apiData" class="api-result">
        <h3>조회 결과:</h3>
        <p>기간: {{ apiData.period }}</p>
        <p>조회 시간: {{ apiData.timestamp }}</p>
        <p>데이터 건수: {{ apiData.count }}건</p>
      </div>
    </section>

    <!-- 초기값 설정 -->
    <section>
      <h2>6. 초기값 설정</h2>
      <FormDateRangePicker v-model="dateRangeWithDefault" label="초기값이 있는 피커" />
      <button @click="resetDefault" class="reset-btn">초기값으로 리셋</button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import FormDateRangePicker from '@/components/template/input/FormDateRangePicker.vue'

interface DateRange {
  startDate: string | null
  endDate: string | null
}

// 기본 사용
const dateRange1 = ref<DateRange>({
  startDate: null,
  endDate: null
})

// 여러 개 사용
const dateRange2 = ref<DateRange>({
  startDate: null,
  endDate: null
})

const dateRange3 = ref<DateRange>({
  startDate: null,
  endDate: null
})

const dateRange4 = ref<DateRange>({
  startDate: null,
  endDate: null
})

// 다른 개월 범위
const dateRange5 = ref<DateRange>({
  startDate: null,
  endDate: null
})

const dateRange6 = ref<DateRange>({
  startDate: null,
  endDate: null
})

// 폼 데이터
const formData = ref({
  projectName: '',
  period: {
    startDate: null,
    endDate: null
  } as DateRange,
  manager: ''
})

const submittedData = ref<string | null>(null)

const isFormValid = computed(() => {
  return (
    formData.value.projectName &&
    formData.value.period.startDate &&
    formData.value.period.endDate &&
    formData.value.manager
  )
})

// API 연동
const apiDateRange = ref<DateRange>({
  startDate: null,
  endDate: null
})

const loading = ref(false)
const apiData = ref<any>(null)

// 초기값 설정
const defaultDateRange = {
  startDate: '2025-01-01',
  endDate: '2025-01-31'
}

const dateRangeWithDefault = ref<DateRange>({ ...defaultDateRange })

// 이벤트 핸들러
function handleChange1(value: DateRange) {
  console.log('dateRange1 changed:', value)
}

function handleChange2(value: DateRange) {
  console.log('계약 시작 기간:', value)
}

function handleChange3(value: DateRange) {
  console.log('계약 종료 기간:', value)
}

function handleChange4(value: DateRange) {
  console.log('연장 기간:', value)
}

function handleSubmit() {
  submittedData.value = JSON.stringify(formData.value, null, 2)
  console.log('폼 제출:', formData.value)

  // 여기서 실제 API 호출
  // await api.submitProject(formData.value)
}

async function fetchData(value: DateRange) {
  console.log('데이터 조회:', value)

  loading.value = true
  apiData.value = null

  // API 호출 시뮬레이션
  await new Promise((resolve) => setTimeout(resolve, 1000))

  apiData.value = {
    period: `${value.startDate} ~ ${value.endDate}`,
    timestamp: new Date().toLocaleString('ko-KR'),
    count: Math.floor(Math.random() * 100) + 1
  }

  loading.value = false
}

function resetDefault() {
  dateRangeWithDefault.value = { ...defaultDateRange }
}
</script>

<style scoped>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f9fafb;
}

h1 {
  margin-bottom: 40px;
  color: #111827;
  font-size: 32px;
  text-align: center;
}

section {
  margin-bottom: 48px;
  padding: 32px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-bottom: 24px;
  font-size: 20px;
  color: #374151;
  padding-bottom: 12px;
  border-bottom: 2px solid #e5e7eb;
}

.result {
  margin-top: 16px;
  padding: 16px;
  background: #f0fdf4;
  border: 1px solid #86efac;
  border-radius: 8px;
  font-size: 14px;
}

.result p {
  margin: 4px 0;
  color: #166534;
  font-weight: 500;
}

.multi-picker {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.picker-item {
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.mini-result {
  margin-top: 12px;
  padding: 8px 12px;
  background: white;
  border-radius: 4px;
  font-size: 13px;
  color: #6b7280;
  text-align: center;
}

.form-example {
  max-width: 600px;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.form-group input[type='text'] {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input[type='text']:focus {
  outline: none;
  border-color: #2563eb;
}

.submit-btn {
  padding: 12px 32px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #1d4ed8;
}

.submit-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.submitted-result {
  margin-top: 24px;
  padding: 16px;
  background: #f3f4f6;
  border-radius: 8px;
}

.submitted-result h3 {
  margin-bottom: 12px;
  font-size: 16px;
  color: #374151;
}

.submitted-result pre {
  background: #1f2937;
  color: #10b981;
  padding: 16px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 13px;
}

.loading {
  margin-top: 16px;
  padding: 24px;
  text-align: center;
  color: #6b7280;
  font-style: italic;
}

.api-result {
  margin-top: 16px;
  padding: 20px;
  background: #eff6ff;
  border: 1px solid #93c5fd;
  border-radius: 8px;
}

.api-result h3 {
  margin-bottom: 12px;
  font-size: 16px;
  color: #1e40af;
}

.api-result p {
  margin: 8px 0;
  color: #1e3a8a;
  font-size: 14px;
}

.reset-btn {
  margin-top: 16px;
  padding: 8px 16px;
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.reset-btn:hover {
  background: #4b5563;
}
</style>
