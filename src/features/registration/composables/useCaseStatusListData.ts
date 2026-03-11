/**
 * 문서 경로: `@/src/features/registration/composables/useCaseStatusListData.ts`
 * 문서 제목: 기능 모듈: use-case-status-list-data
 */

import { computed, ref } from 'vue'

import { registryProgressAPI } from '@/api/services/registry'
import { useErrorHandler } from '@/composables/utils/useErrorHandler'
import type { SearchRegistryProgresssListQuery } from '@/types'
import { extractArrayByKeys, extractRecordByKeys } from '@/utils/apiPayload'

import type { CaseStatusFilters, Row } from './caseStatus.types'

interface CaseStatusListPayload {
  content?: Row[]
  totalElements?: number
}

// 형식: YYYY-MM-DD -> YYYYMMDD
function toApiDate(ymd: string) {
  return ymd.replace(/-/g, '')
}

function toYMD(date: Date) {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function addMonths(base: Date, months: number) {
  const date = new Date(base)
  date.setMonth(date.getMonth() + months)
  return date
}

function clampRangeWithin3Months(start: string, end: string) {
  // 규칙: 조회 기간 최대 3개월
  const startDate = new Date(start)
  const endDate = new Date(end)
  const maxEnd = addMonths(startDate, 3)
  if (endDate > maxEnd) return { start, end: toYMD(maxEnd) }
  return { start, end }
}

function calcTotalPagesSafe(totalElements: number, pageSize: number) {
  // 규칙: 최소 1페이지
  const size = Math.max(1, Number(pageSize) || 1)
  const total = Math.max(0, Number(totalElements) || 0)
  return Math.max(1, Math.ceil(total / size))
}

function resolveManagerUserIdForApi(value: string): string | null {
  // 의미:
  // ''  -> 파라미터 생략
  // ALL -> 전체
  // -1  -> 미배정
  if (!value) return null
  if (value === 'ALL') return 'ALL'
  if (value === '-1') return '-1'
  return value
}

export function useCaseStatusListData({
  filters,
  onRowsLoaded
}: {
  filters: CaseStatusFilters
  onRowsLoaded?: () => void
}) {
  const { getErrorMessage } = useErrorHandler()
  const loading = ref(false)
  const errorMessage = ref('')
  const rows = ref<Row[]>([])
  const totalElements = ref(0)
  const totalPages = ref(0)
  const page = ref(0)
  const size = ref(10)

  const lastPageIndex = computed(() => Math.max(0, (totalPages.value || 1) - 1))

  function buildQuery(nextPage1Base: number): SearchRegistryProgresssListQuery {
    // 규칙: 날짜 범위는 API 요청 직전에 보정
    const req = clampRangeWithin3Months(
      filters.registryRequestStartDate,
      filters.registryRequestEndDate
    )
    const rcp = clampRangeWithin3Months(
      filters.registryReceiptStartDate,
      filters.registryReceiptEndDate
    )

    const managerUserId = resolveManagerUserIdForApi(filters.managerUserId)
    const query: any = {
      workType: filters.workType,
      assignedWork: filters.assignedWork,
      registryMethod: filters.registryMethod,
      progressStatus: filters.progressStatus,
      registryRequestStartDate: toApiDate(req.start),
      registryRequestEndDate: toApiDate(req.end),
      registryReceiptStartDate: toApiDate(rcp.start),
      registryReceiptEndDate: toApiDate(rcp.end),
      page: nextPage1Base,
      size: size.value
    }

    if (managerUserId !== null) query.managerUserId = managerUserId
    const keyword = filters.keyword.trim()
    if (keyword) query.searchKeyword = keyword

    return query as SearchRegistryProgresssListQuery
  }

  async function fetchList(resetPage: boolean) {
    loading.value = true
    errorMessage.value = ''
    try {
      if (resetPage) page.value = 0

      const query = buildQuery(page.value + 1)
      const response = await registryProgressAPI.getList(query)
      const data = extractRecordByKeys<CaseStatusListPayload>(response, ['content']) ?? {}

      rows.value = extractArrayByKeys<Row>(data, ['content'])
      totalElements.value = Number(data?.totalElements ?? 0)
      totalPages.value = calcTotalPagesSafe(totalElements.value, size.value)

      if (page.value > lastPageIndex.value) {
        // 보정: 현재 페이지가 총 페이지 수를 넘으면 마지막 페이지로 재조회
        page.value = lastPageIndex.value
        const query2 = buildQuery(page.value + 1)
        const response2 = await registryProgressAPI.getList(query2)
        const data2 = extractRecordByKeys<CaseStatusListPayload>(response2, ['content']) ?? {}

        rows.value = extractArrayByKeys<Row>(data2, ['content']) || rows.value
        totalElements.value = Number(data2?.totalElements ?? totalElements.value)
        totalPages.value = calcTotalPagesSafe(totalElements.value, size.value)
      }

      onRowsLoaded?.()
    } catch (error) {
      errorMessage.value = getErrorMessage(error)
      rows.value = []
      totalElements.value = 0
      totalPages.value = 0
    } finally {
      loading.value = false
    }
  }

  function handleSearch(reset: boolean) {
    void fetchList(reset)
  }

  function movePage(next: number) {
    // 규칙: 0 ~ lastPageIndex 범위 고정
    const clamped = Math.min(Math.max(next, 0), lastPageIndex.value)
    if (clamped === page.value) return
    page.value = clamped
    void fetchList(false)
  }

  const MAX_PAGE_SIZE = 50 as const
  const currentPage = computed({
    get: () => page.value + 1,
    set: (next: number) => movePage(next - 1)
  })

  function onChangePageSize() {
    // 규칙: page size 상한 50
    const value = Number(size.value)
    if (!Number.isFinite(value) || value <= 0) size.value = 10
    if (size.value > MAX_PAGE_SIZE) size.value = MAX_PAGE_SIZE
    handleSearch(true)
  }

  return {
    loading,
    errorMessage,
    rows,
    totalElements,
    size,
    currentPage,
    MAX_PAGE_SIZE,
    fetchList,
    handleSearch,
    onChangePageSize
  }
}
