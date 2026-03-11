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
      const [workTypeRes, assignedWorkRes, registryMethodRes, progressStatusRes] =
        await Promise.all([
          codeAPI.workTypes(),
          codeAPI.assignmentWorks(),
          codeAPI.registryMethods(),
          codeAPI.progressStatuses()
        ])

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
