<template>
  <div class="estimate-detail-page">
    <div class="page-header">
      <h1>{{ pageTitle }}</h1>
      <button type="button" @click="goBack">← 이전</button>
    </div>

    <div v-if="isLoading" class="state-box">데이터를 불러오는 중입니다.</div>
    <div v-else-if="loadError" class="state-box">{{ loadError }}</div>
    <template v-else>
      <section class="info-section">
        <h2>견적서 기본 정보</h2>
        <table class="data-table">
          <tbody>
            <tr>
              <th>등기유형</th>
              <td>{{ info.registryInfo?.workTypeDescription || '-' }}</td>
              <th>매매금액</th>
              <td>{{ formatCurrency(info.registryInfo?.tradeAmount) }}</td>
            </tr>
            <tr>
              <th>잔금일자</th>
              <td>{{ formatDate(info.registryInfo?.balanceDueDate) }}</td>
              <th>등기방식(요청)</th>
              <td>{{ info.registryInfo?.registryMethodDescription || '-' }}</td>
            </tr>
            <tr>
              <th>부동산 주소</th>
              <td colspan="3">{{ info.propertyInfo?.propertyAddress || '-' }}</td>
            </tr>
            <tr>
              <th>부동산 구분</th>
              <td>{{ info.propertyInfo?.propertyClassification || '-' }}</td>
              <th>필지수</th>
              <td>{{ info.propertyInfo?.propertyCount ?? '-' }}</td>
            </tr>
            <tr>
              <th>등기의무자 수</th>
              <td>{{ info.obligorInfo?.obligorCount ?? '-' }}</td>
              <th>등기권리자 수</th>
              <td>{{ info.obligeeInfo?.obligeeCount ?? '-' }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section v-if="isCreateMode" class="info-section">
        <h2>등기 진행 방식</h2>
        <SearchSelect
          v-model="selectedRegistryMethod"
          :options="registryMethodOptions"
          label="등기 방식"
          placeholder="등기 방식을 선택해주세요"
        />
      </section>

      <section v-else class="info-section">
        <h2>견적서 작성 정보</h2>

        <div v-if="!estimateId" class="state-box">선택된 견적서 ID가 없습니다.</div>
        <template v-else>
          <table class="data-table">
            <thead>
              <tr>
                <th>항목</th>
                <th>금액</th>
                <th>항목</th>
                <th>금액</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>기본 보수</td>
                <td>{{ formatCurrency(detail.feeDetails?.baseFee) }}</td>
                <td>취득세</td>
                <td>{{ formatCurrency(detail.publicChargeDetails?.acquisitionTax) }}</td>
              </tr>
              <tr>
                <td>가산 보수</td>
                <td>{{ formatCurrency(detail.feeDetails?.additionalFee) }}</td>
                <td>등록면허세</td>
                <td>{{ formatCurrency(detail.publicChargeDetails?.registrationLicenseTax) }}</td>
              </tr>
              <tr>
                <td>제증명 비용</td>
                <td>{{ formatCurrency(detail.feeDetails?.certificateFee) }}</td>
                <td>교육세</td>
                <td>{{ formatCurrency(detail.publicChargeDetails?.educationTax) }}</td>
              </tr>
              <tr>
                <td>등기원인증서 작성</td>
                <td>{{ formatCurrency(detail.feeDetails?.registryCauseDocumentFee) }}</td>
                <td>농어촌특별세</td>
                <td>{{ formatCurrency(detail.publicChargeDetails?.ruralSpecialTax) }}</td>
              </tr>
              <tr>
                <td>공과금 신고/납부 대행</td>
                <td>{{ formatCurrency(detail.feeDetails?.taxPaymentAgencyFee) }}</td>
                <td>인지세</td>
                <td>{{ formatCurrency(detail.publicChargeDetails?.stampTax) }}</td>
              </tr>
              <tr>
                <td>국민주택채권 즉시매도 대행</td>
                <td>{{ formatCurrency(detail.feeDetails?.bondSaleAgencyFee) }}</td>
                <td>등기신청수수료</td>
                <td>{{ formatCurrency(detail.publicChargeDetails?.registryApplicationFee) }}</td>
              </tr>
              <tr>
                <td>검인/부동산거래신고 대행</td>
                <td>{{ formatCurrency(detail.feeDetails?.inspectionTradeReportAgencyFee) }}</td>
                <td>공과금 합계</td>
                <td>{{ formatCurrency(detail.publicChargeDetails?.totalTax) }}</td>
              </tr>
              <tr>
                <td>실비변상</td>
                <td>{{ formatCurrency(detail.feeDetails?.actualCost) }}</td>
                <td>등기 진행 방식</td>
                <td>{{ detail.registryMethod || '-' }}</td>
              </tr>
              <tr>
                <td>확인서면</td>
                <td>{{ formatCurrency(detail.feeDetails?.confirmationDocumentFee) }}</td>
                <td>선정일시</td>
                <td>{{ formatDateTime(detail.selectedAt) }}</td>
              </tr>
              <tr>
                <td>기타 비용</td>
                <td>{{ formatCurrency(detail.feeDetails?.otherFee) }}</td>
                <td>보수료 합계</td>
                <td>{{ formatCurrency(detail.feeDetails?.totalFee) }}</td>
              </tr>
              <tr>
                <td>부가가치세</td>
                <td>{{ formatCurrency(detail.feeDetails?.vat) }}</td>
                <td>작성자</td>
                <td>{{ detail.legalAgentInfo?.estimatorName || '-' }}</td>
              </tr>
            </tbody>
          </table>
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
import SearchSelect from '@/components/template/input/SearchSelect.vue'
import type { Code, EstimateDetailResponse, EstimateInfoResponse, SelectOption } from '@/types'

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
  isCreateMode.value ? '견적서 작성/제출 상세' : '견적서 확인/철회 상세'
)

const registryRequestNumber = computed(() => String(route.params.registrationNo ?? ''))
const estimateId = computed(() => {
  const raw = route.query.estimateId
  if (!raw) return null
  const value = Number(Array.isArray(raw) ? raw[0] : raw)
  return Number.isFinite(value) ? value : null
})

const registryMethodOptions = computed<SelectOption[]>(() => [
  { label: '선택해주세요', value: '' },
  ...registryMethodCodes.value.map((code) => ({ label: code.description, value: code.code }))
])

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

<style scoped>
.estimate-detail-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.state-box {
  padding: 14px;
  border: 1px solid #e2e2e2;
  border-radius: 8px;
  background: #fafafa;
}
</style>
