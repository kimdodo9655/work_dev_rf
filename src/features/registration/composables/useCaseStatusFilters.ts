/**
 * 문서 경로: `@/src/features/registration/composables/useCaseStatusFilters.ts`
 * 문서 제목: 기능 모듈: use-case-status-filters
 */

import { computed, reactive } from 'vue'

import { useAuthStore } from '@/stores/auth'
import { UserRoleLevel } from '@/types/store'

import type { SearchOption } from './caseStatus.types'
import { useCaseStatusAssignableUsers } from './useCaseStatusAssignableUsers'
import { useCaseStatusCodes } from './useCaseStatusCodes'

function toYMD(date: Date) {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function addMonths(base: Date, months: number) {
  const date = new Date(base)
  // Date#setMonth가 말일을 넘길 수 있으므로, 기본 범위 계산은 현재 화면 기준의 상대 월 이동만 맡긴다.
  date.setMonth(date.getMonth() + months)
  return date
}

export function useCaseStatusFilters() {
  const authStore = useAuthStore()
  const roleLevel = computed(() => authStore.roleLevel)
  const roleLevelValue = computed(() => roleLevel.value ?? 0)
  const userId = computed(() => authStore.userId)

  // 사용자 권한에 따라 "본인 배정만 가능"인지 "전체 배정 관리 가능"인지 UI가 갈린다.
  const isAssigneeRole = computed(() => roleLevelValue.value === UserRoleLevel.USER)
  const isManagerRole = computed(() => roleLevelValue.value > UserRoleLevel.USER)

  const filters = reactive({
    workType: 'ALL',
    assignedWork: 'ALL',
    registryMethod: 'ALL',
    managerUserId: 'ALL',
    registryRequestStartDate: '',
    registryRequestEndDate: '',
    registryReceiptStartDate: '',
    registryReceiptEndDate: '',
    progressStatus: 'ALL',
    keyword: ''
  })

  const today = new Date()
  const defaultRequestStart = toYMD(addMonths(today, -1))
  const defaultRequestEnd = toYMD(today)
  const defaultReceiptStart = toYMD(today)
  const defaultReceiptEnd = toYMD(addMonths(today, 1))

  filters.registryRequestStartDate = defaultRequestStart
  filters.registryRequestEndDate = defaultRequestEnd
  filters.registryReceiptStartDate = defaultReceiptStart
  filters.registryReceiptEndDate = defaultReceiptEnd

  const requestDateRange = computed({
    get: () => ({
      startDate: filters.registryRequestStartDate || null,
      endDate: filters.registryRequestEndDate || null
    }),
    set: (value: { startDate: string | null; endDate: string | null }) => {
      // DateRangePicker가 null을 돌려줄 수 있어도 검색 기본 범위는 항상 유지한다.
      filters.registryRequestStartDate = value.startDate ?? defaultRequestStart
      filters.registryRequestEndDate = value.endDate ?? defaultRequestEnd
    }
  })

  const receiptDateRange = computed({
    get: () => ({
      startDate: filters.registryReceiptStartDate || null,
      endDate: filters.registryReceiptEndDate || null
    }),
    set: (value: { startDate: string | null; endDate: string | null }) => {
      // 접수일도 동일한 정책으로 복구해 빈 날짜 상태의 API 호출을 막는다.
      filters.registryReceiptStartDate = value.startDate ?? defaultReceiptStart
      filters.registryReceiptEndDate = value.endDate ?? defaultReceiptEnd
    }
  })

  const codesModel = useCaseStatusCodes()
  const assignableModel = useCaseStatusAssignableUsers({
    filters,
    isAssigneeRole,
    roleLevelValue
  })

  const managerOptions = computed<SearchOption[]>(() => {
    // 담당자 권한 사용자는 본인 배정 케이스만 보므로 "전체" 옵션을 숨긴다.
    const base = isAssigneeRole.value ? [] : ([{ label: '전체', value: 'ALL' }] as SearchOption[])
    return [
      ...base,
      { label: '미배정', value: '-1' },
      ...assignableModel.assignableUsers.value.map((user) => ({
        label: user.userName,
        value: String(user.userId)
      }))
    ]
  })

  function displayAddress(value?: string | null): string {
    if (!value) return '-'
    return (
      value
        // API/HTML 렌더링 과정에서 섞인 non-breaking space를 일반 공백으로 정규화한다.
        .replace(/&nbsp;/gi, ' ')
        .replace(/&#160;/gi, ' ')
        .replace(/&#xA0;/gi, ' ')
        .replace(/\u00A0/g, ' ')
        .trim()
    )
  }

  return {
    userId,
    isAssigneeRole,
    isManagerRole,
    filters,
    requestDateRange,
    receiptDateRange,
    workTypeOptions: codesModel.workTypeOptions,
    assignedWorkOptions: codesModel.assignedWorkOptions,
    registryMethodOptions: codesModel.registryMethodOptions,
    managerOptions,
    progressStatusOptions: codesModel.progressStatusOptions,
    assignableUsers: assignableModel.assignableUsers,
    codesLoading: codesModel.codesLoading,
    assignableLoading: assignableModel.assignableLoading,
    codesError: codesModel.codesError,
    assignableError: assignableModel.assignableError,
    loadCodes: codesModel.loadCodes,
    loadAssignableUsers: assignableModel.loadAssignableUsers,
    isUnassigned: assignableModel.isUnassigned,
    displayAddress,
    findUserIdByName: assignableModel.findUserIdByName
  }
}
