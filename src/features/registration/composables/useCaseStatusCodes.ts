/**
 * 문서 경로: `@/src/features/registration/composables/useCaseStatusCodes.ts`
 * 문서 제목: 기능 모듈: use-case-status-codes
 */

import { computed, ref } from 'vue'

import { codeAPI } from '@/api/services/code'
import { useErrorHandler } from '@/composables/utils/useErrorHandler'
import type { Code } from '@/types'
import { extractArrayByKeys } from '@/utils/apiPayload'

import type { SearchOption } from './caseStatus.types'

export function useCaseStatusCodes() {
  const { getErrorMessage } = useErrorHandler()
  const workTypes = ref<Code[]>([])
  const assignmentWorks = ref<Code[]>([])
  const registryMethods = ref<Code[]>([])
  const progressStatuses = ref<Code[]>([])

  const codesLoading = ref(false)
  const codesError = ref('')

  // 각 select는 동일한 "전체" 옵션 정책을 먼저 붙이고 서버 코드 목록을 뒤에 이어 붙인다.
  const workTypeOptions = computed<SearchOption[]>(() => [
    { label: '전체', value: 'ALL' },
    ...workTypes.value.map((code) => ({ label: code.description, value: code.code }))
  ])

  const assignedWorkOptions = computed<SearchOption[]>(() => [
    { label: '전체', value: 'ALL' },
    ...assignmentWorks.value.map((code) => ({ label: code.description, value: code.code }))
  ])

  const registryMethodOptions = computed<SearchOption[]>(() => [
    { label: '전체', value: 'ALL' },
    ...registryMethods.value.map((code) => ({ label: code.description, value: code.code }))
  ])

  const progressStatusOptions = computed<SearchOption[]>(() => [
    { label: '전체', value: 'ALL' },
    ...progressStatuses.value.map((code) => ({ label: code.description, value: code.code }))
  ])

  async function loadCodes() {
    codesLoading.value = true
    codesError.value = ''
    try {
      // 검색 필터의 코드표는 서로 독립적이므로 병렬 조회해 초기 진입 시간을 줄인다.
      const [workTypeRes, assignedWorkRes, registryMethodRes, progressStatusRes] =
        await Promise.all([
          codeAPI.workTypes(),
          codeAPI.assignmentWorks(),
          codeAPI.registryMethods(),
          codeAPI.progressStatuses()
        ])

      // 엔드포인트마다 payload 키가 달라도 공통 추출 유틸로 흡수한다.
      workTypes.value = extractArrayByKeys<Code>(workTypeRes, ['codes', 'items', 'content'])
      assignmentWorks.value = extractArrayByKeys<Code>(assignedWorkRes, [
        'codes',
        'items',
        'content'
      ])
      registryMethods.value = extractArrayByKeys<Code>(registryMethodRes, [
        'codes',
        'items',
        'content'
      ])
      progressStatuses.value = extractArrayByKeys<Code>(progressStatusRes, [
        'codes',
        'items',
        'content'
      ])
    } catch (error) {
      // 코드표 일부만 남으면 필터 조합이 어긋날 수 있어 실패 시 전부 초기화한다.
      codesError.value = getErrorMessage(error)
      workTypes.value = []
      assignmentWorks.value = []
      registryMethods.value = []
      progressStatuses.value = []
    } finally {
      codesLoading.value = false
    }
  }

  return {
    codesLoading,
    codesError,
    workTypeOptions,
    assignedWorkOptions,
    registryMethodOptions,
    progressStatusOptions,
    loadCodes
  }
}
