<!-- 문서 경로: `@/src/features/estimate/pages/EstimateMgmtPage.vue`
문서 제목: 기능 페이지/컴포넌트: estimate-mgmt-page -->

<template>
  <div class="estimate-mgmt-page">
    <div class="Search-panel">
      <form @submit.prevent="handleSubmit">
        <div class="input-area">
          <SearchSelect
            v-model="filters.registryType"
            label="등기유형"
            :options="registryTypeOptions"
            :disabled="true"
          />

          <SearchSelect v-model="filters.plotCount" label="필지" :options="plotOptions" />

          <SearchDateRangePicker v-model="requestDateRange" label="등기의뢰일자" />

          <SearchDateRangePicker v-model="receiptDateRange" label="등기접수일자" />

          <SearchSelect
            v-model="filters.progressStatus"
            label="진행상태"
            :options="progressStatusOptions"
          />

          <SearchSelect
            v-model="filters.writingStatus"
            label="작성여부"
            :options="writingStatusOptions"
          />

          <SearchSelect
            v-model="filters.selectionStatus"
            label="선정여부"
            :options="selectionStatusOptions"
          />

          <SearchInput
            v-model="filters.keyword"
            label="통합검색"
            placeholder="부동산 주소 또는 등기신청번호"
          />
        </div>
        <input type="submit" value="검색" />
      </form>
    </div>

    <div class="list-header">
      <p>전체 {{ totalItems }}건</p>
      <button type="button" class="refresh-btn" @click="fetchList" :disabled="isLoading">
        새로고침
      </button>
    </div>

    <table class="data-table">
      <thead>
        <tr>
          <th>등기신청번호</th>
          <th>매매금액</th>
          <th>부동산 주소</th>
          <th>필지</th>
          <th>등기의뢰일자</th>
          <th>등기접수일자</th>
          <th>진행상태</th>
          <th>작성여부</th>
          <th>선정여부</th>
          <th>상세</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="isLoading">
          <td colspan="10">목록을 불러오는 중입니다.</td>
        </tr>
        <tr v-else-if="loadError">
          <td colspan="10">{{ loadError }}</td>
        </tr>
        <tr v-else-if="items.length === 0">
          <td colspan="10">조회 조건에 맞는 데이터가 존재하지 않습니다.</td>
        </tr>
        <tr
          v-for="item in items"
          :key="`${item.registryRequestNumber}-${item.estimateId ?? 'new'}`"
        >
          <td>{{ item.registryRequestNumber || '-' }}</td>
          <td>{{ formatCurrency(item.tradeAmount) }}</td>
          <td>{{ item.propertyAddress || '-' }}</td>
          <td>{{ item.plotCount ?? '-' }}</td>
          <td>{{ formatDate(item.requestDate) }}</td>
          <td>{{ formatDate(item.receiptDate) }}</td>
          <td>{{ getCodeLabel(quoteProgressCodeMap, item.progressStatus) }}</td>
          <td>{{ getCodeLabel(writingStatusCodeMap, item.writingStatus) }}</td>
          <td>{{ getCodeLabel(selectionStatusCodeMap, item.selectionStatus) }}</td>
          <td>
            <button class="detail-btn" type="button" @click="moveDetail(item)">
              <i class="fi fi-sr-angle-circle-right"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <Pagination
      v-model:current-page="currentPage"
      :total-items="totalItems"
      :items-per-page="pageSize"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { codeAPI } from '@/api/services/code'
import { registryQuoteAPI } from '@/api/services/registry/quote'
import SearchDateRangePicker from '@/components/template/input/SearchDateRangePicker.vue'
import SearchInput from '@/components/template/input/SearchInput.vue'
import SearchSelect from '@/components/template/input/SearchSelect.vue'
import Pagination from '@/components/template/PaginationItem.vue'
import type { Code, EstimateListItemResponse, GetEstimateListQuery, SelectOption } from '@/types'

defineOptions({
  name: 'EstimateMgmtPage'
})

interface DateRange {
  startDate: string | null
  endDate: string | null
}

interface ListRoot {
  content?: EstimateListItemResponse[]
  items?: EstimateListItemResponse[]
  totalElements?: number
  totalCount?: number
  total?: number
}

const router = useRouter()

const pageSize = 10
const currentPage = ref(1)
const totalItems = ref(0)
const items = ref<EstimateListItemResponse[]>([])
const isLoading = ref(false)
const loadError = ref('')

const quoteProgressStatusCodes = ref<Code[]>([])
const writingStatusCodes = ref<Code[]>([])
const selectionStatusCodes = ref<Code[]>([])

const filters = reactive<{
  registryType: string | number | null
  plotCount: string | number | null
  progressStatus: string | number | null
  writingStatus: string | number | null
  selectionStatus: string | number | null
  keyword: string
}>({
  registryType: 'OWNERSHIP_TRANSFER',
  plotCount: '',
  progressStatus: '',
  writingStatus: '',
  selectionStatus: '',
  keyword: ''
})

const requestDateRange = ref<DateRange>({ startDate: null, endDate: null })
const receiptDateRange = ref<DateRange>({ startDate: null, endDate: null })

const registryTypeOptions = ref<SelectOption[]>([
  { label: '소유권이전', value: 'OWNERSHIP_TRANSFER' }
])

const plotOptions = computed<SelectOption[]>(() => [
  { label: '전체', value: '' },
  ...Array.from({ length: 20 }, (_, i) => {
    const value = String(i + 1)
    return { label: value, value }
  })
])

const progressStatusOptions = computed<SelectOption[]>(() => [
  { label: '전체', value: '' },
  ...quoteProgressStatusCodes.value.map((code) => ({ label: code.description, value: code.code }))
])

const writingStatusOptions = computed<SelectOption[]>(() => [
  { label: '전체', value: '' },
  ...writingStatusCodes.value.map((code) => ({ label: code.description, value: code.code }))
])

const selectionStatusOptions = computed<SelectOption[]>(() => [
  { label: '전체', value: '' },
  ...selectionStatusCodes.value.map((code) => ({ label: code.description, value: code.code }))
])

const quoteProgressCodeMap = computed(() => {
  return new Map(quoteProgressStatusCodes.value.map((code) => [code.code, code.description]))
})

const writingStatusCodeMap = computed(() => {
  return new Map(writingStatusCodes.value.map((code) => [code.code, code.description]))
})

const selectionStatusCodeMap = computed(() => {
  return new Map(selectionStatusCodes.value.map((code) => [code.code, code.description]))
})

function unwrapData<T>(payload: unknown): T {
  if (payload && typeof payload === 'object' && 'data' in (payload as Record<string, unknown>)) {
    return (payload as { data: T }).data
  }
  return payload as T
}

function getListRoot(payload: unknown): ListRoot {
  const data = unwrapData<unknown>(payload)
  if (data && typeof data === 'object' && 'result' in (data as Record<string, unknown>)) {
    return ((data as { result: unknown }).result ?? {}) as ListRoot
  }
  return (data ?? {}) as ListRoot
}

function toList(payload: unknown): EstimateListItemResponse[] {
  const root = getListRoot(payload)

  if (Array.isArray(root)) return root
  if (Array.isArray(root.content)) return root.content
  if (Array.isArray(root.items)) return root.items
  return []
}

function toTotal(payload: unknown): number {
  const root = getListRoot(payload)

  if (typeof root.totalElements === 'number') return root.totalElements
  if (typeof root.totalCount === 'number') return root.totalCount
  if (typeof root.total === 'number') return root.total
  return Array.isArray(root.content)
    ? root.content.length
    : Array.isArray(root.items)
      ? root.items.length
      : Array.isArray(root)
        ? root.length
        : 0
}

function buildQuery(): GetEstimateListQuery {
  const progressStatus = (
    filters.progressStatus ? String(filters.progressStatus) : undefined
  ) as GetEstimateListQuery['progressStatus']
  const writingStatus = (
    filters.writingStatus ? String(filters.writingStatus) : undefined
  ) as GetEstimateListQuery['writingStatus']
  const selectionStatus = (
    filters.selectionStatus ? String(filters.selectionStatus) : undefined
  ) as GetEstimateListQuery['selectionStatus']

  return {
    registryType: 'OWNERSHIP_TRANSFER',
    plotCount: filters.plotCount ? String(filters.plotCount) : undefined,
    requestDateFrom: requestDateRange.value.startDate ?? undefined,
    requestDateTo: requestDateRange.value.endDate ?? undefined,
    receiptDateFrom: receiptDateRange.value.startDate ?? undefined,
    receiptDateTo: receiptDateRange.value.endDate ?? undefined,
    progressStatus,
    writingStatus,
    selectionStatus,
    keyword: filters.keyword.trim() || undefined,
    page: currentPage.value,
    size: pageSize
  }
}

function getCodeLabel(codeMap: Map<string, string>, code?: string): string {
  if (!code) return '-'
  return codeMap.get(code) ?? code
}

function formatCurrency(amount?: number): string {
  if (typeof amount !== 'number') return '-'
  return `${amount.toLocaleString('ko-KR')}원`
}

function formatDate(value?: string): string {
  if (!value) return '-'
  const dateOnly = value.includes('T') ? value.slice(0, 10) : value
  return dateOnly
}

function moveDetail(item: EstimateListItemResponse) {
  if (!item.registryRequestNumber) return

  if (item.estimateId) {
    router.push({
      name: 'EstimateDetail',
      params: { registrationNo: item.registryRequestNumber },
      query: { estimateId: String(item.estimateId) }
    })
    return
  }

  router.push({
    name: 'EstimateCreate',
    params: { registrationNo: item.registryRequestNumber }
  })
}

async function loadCodeOptions() {
  const [progressRes, writingRes, selectionRes] = await Promise.all([
    codeAPI.quoteProgressStatuses(),
    codeAPI.estimateWritingStatuses(),
    codeAPI.estimateSelectionStatuses()
  ])

  quoteProgressStatusCodes.value = Array.isArray(progressRes) ? progressRes : []
  writingStatusCodes.value = Array.isArray(writingRes) ? writingRes : []
  selectionStatusCodes.value = Array.isArray(selectionRes) ? selectionRes : []
}

async function fetchList() {
  isLoading.value = true
  loadError.value = ''

  try {
    const response = await registryQuoteAPI.getList(buildQuery())
    items.value = toList(response)
    totalItems.value = toTotal(response)
  } catch (error) {
    console.error(error)
    loadError.value = '견적 목록을 불러오지 못했습니다.'
    items.value = []
    totalItems.value = 0
  } finally {
    isLoading.value = false
  }
}

function triggerSearch() {
  if (currentPage.value !== 1) {
    currentPage.value = 1
    return
  }
  fetchList()
}

function handleSubmit() {
  triggerSearch()
}

watch(currentPage, () => {
  fetchList()
})

onMounted(async () => {
  try {
    await loadCodeOptions()
  } catch (error) {
    console.error(error)
  }
  await fetchList()
})
</script>

<style scoped>
.estimate-mgmt-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.refresh-btn {
  border: 1px solid #d4d4d4;
  background: #fff;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
}

.refresh-btn:disabled {
  cursor: default;
  opacity: 0.5;
}
</style>
