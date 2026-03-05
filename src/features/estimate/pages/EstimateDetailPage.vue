<!-- 문서 경로: `@/src/features/estimate/pages/EstimateDetailPage.vue`
문서 제목: 기능 페이지/컴포넌트: estimate-detail-page -->

<template>
  <div>
    <h1>{{ pageTitle }}</h1>
    <button type="button" @click="goBack">이전</button>

    <div v-if="isLoading">데이터를 불러오는 중입니다.</div>
    <div v-else-if="loadError">{{ loadError }}</div>
    <template v-else>
      <section>
        <h2>견적서 기본 정보</h2>
        <p>등기신청번호: {{ registryRequestNumber || '-' }}</p>
        <p>등기유형: {{ info.registryInfo?.workTypeDescription || '-' }}</p>
        <p>매매금액: {{ formatCurrency(info.registryInfo?.tradeAmount) }}</p>
        <p>잔금일자: {{ formatDate(info.registryInfo?.balanceDueDate) }}</p>
        <p>등기방식(요청): {{ info.registryInfo?.registryMethodDescription || '-' }}</p>
        <p>부동산 주소: {{ info.propertyInfo?.propertyAddress || '-' }}</p>
        <p>부동산 구분: {{ info.propertyInfo?.propertyClassification || '-' }}</p>
        <p>필지수: {{ info.propertyInfo?.propertyCount ?? '-' }}</p>
        <p>등기의무자 수: {{ info.obligorInfo?.obligorCount ?? '-' }}</p>
        <p>등기권리자 수: {{ info.obligeeInfo?.obligeeCount ?? '-' }}</p>
      </section>

      <section v-if="isCreateMode">
        <h2>등기 진행 방식</h2>
        <label for="registry-method">등기 방식</label>
        <select id="registry-method" v-model="selectedRegistryMethod">
          <option value="">선택해주세요</option>
          <option v-for="code in registryMethodCodes" :key="code.code" :value="code.code">
            {{ code.description }}
          </option>
        </select>
        <p>선택된 등기방식: {{ selectedRegistryMethod || '-' }}</p>
      </section>

      <section v-else>
        <h2>견적서 작성 정보</h2>

        <div v-if="!estimateId">선택된 견적서 ID가 없습니다.</div>
        <template v-else>
          <p>견적서 ID: {{ detail.estimateId ?? '-' }}</p>
          <p>등기신청번호: {{ detail.registryRequestNumber || '-' }}</p>
          <p>등기 진행 방식: {{ detail.registryMethod || '-' }}</p>
          <p>선정일시: {{ formatDateTime(detail.selectedAt) }}</p>
          <p>작성자: {{ detail.legalAgentInfo?.estimatorName || '-' }}</p>
          <p>보수료 합계: {{ formatCurrency(detail.feeDetails?.totalFee) }}</p>
          <p>공과금 합계: {{ formatCurrency(detail.publicChargeDetails?.totalTax) }}</p>
          <h3>견적 상세 원본(JSON)</h3>
          <pre>{{ detailJson }}</pre>
        </template>
      </section>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { codeAPI } from '@/api/services/code'
import { registryQuoteAPI } from '@/api/services/registry/quote'
import { MESSAGES } from '@/constants/messages'
import type { Code, EstimateDetailResponse, EstimateInfoResponse } from '@/types'

defineOptions({
  name: 'EstimateDetailPage'
})

const route = useRoute()
const router = useRouter()

const isLoading = ref(false)
const loadError = ref('')

const info = ref<EstimateInfoResponse>({})
const detail = ref<EstimateDetailResponse>({})

const registryMethodCodes = ref<Code[]>([])
const selectedRegistryMethod = ref<string | number | null>('')

const isCreateMode = computed(() => route.name === 'EstimateCreate')
const pageTitle = computed(() =>
  isCreateMode.value
    ? MESSAGES.pageTitle.estimate.createDetail
    : MESSAGES.pageTitle.estimate.confirmDetail
)

const registryRequestNumber = computed(() => String(route.params.registrationNo ?? ''))
const estimateId = computed(() => {
  const raw = route.query.estimateId
  if (!raw) return null
  const value = Number(Array.isArray(raw) ? raw[0] : raw)
  return Number.isFinite(value) ? value : null
})

const detailJson = computed(() => JSON.stringify(detail.value, null, 2))

function unwrapData<T>(payload: unknown): T {
  if (payload && typeof payload === 'object' && 'data' in (payload as Record<string, unknown>)) {
    return (payload as { data: T }).data
  }
  return payload as T
}

function unwrapResult<T>(payload: unknown): T {
  const data = unwrapData<unknown>(payload)
  if (data && typeof data === 'object' && 'result' in (data as Record<string, unknown>)) {
    return (data as { result: T }).result
  }
  return data as T
}

function formatCurrency(amount?: number): string {
  if (typeof amount !== 'number') return '-'
  return `${amount.toLocaleString('ko-KR')}원`
}

function formatDate(value?: string): string {
  if (!value) return '-'
  return value.includes('T') ? value.slice(0, 10) : value
}

function formatDateTime(value?: string): string {
  if (!value) return '-'
  return value.replace('T', ' ').slice(0, 16)
}

function goBack() {
  if (window.history.length > 1) {
    router.back()
    return
  }
  router.push('/estimate')
}

async function loadBasicInfo() {
  const response = await registryQuoteAPI.getDetail({
    registryRequestNumber: registryRequestNumber.value
  })
  info.value = unwrapResult<EstimateInfoResponse>(response) ?? {}
}

async function loadRegistryMethods() {
  const response = await codeAPI.registryMethods()
  registryMethodCodes.value = Array.isArray(response) ? response : []
}

async function loadEstimateDetail() {
  if (!estimateId.value) {
    detail.value = {}
    return
  }

  const response = await registryQuoteAPI.accept({ estimateId: estimateId.value })
  detail.value = unwrapResult<EstimateDetailResponse>(response) ?? {}
}

onMounted(async () => {
  isLoading.value = true
  loadError.value = ''

  try {
    await loadBasicInfo()

    if (isCreateMode.value) {
      await loadRegistryMethods()
      selectedRegistryMethod.value =
        registryMethodCodes.value.length > 0 ? (registryMethodCodes.value[0]?.code ?? '') : ''
    } else {
      await loadEstimateDetail()
    }
  } catch (error) {
    console.error(error)
    loadError.value = '견적 상세 정보를 불러오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
})
</script>
