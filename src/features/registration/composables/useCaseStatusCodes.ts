/**
 * 문서 경로: `@/src/features/registration/composables/useCaseStatusCodes.ts`
 * 문서 제목: 기능 모듈: use-case-status-codes
 */

import { computed, ref } from 'vue'

import { codeAPI } from '@/api/services/code'
import type { Code } from '@/types'

import type { SearchOption } from './caseStatus.types'

function unwrap<T>(res: any): T | undefined {
  if (!res) return undefined
  if (typeof res === 'object' && 'data' in res) {
    const data = (res as any).data
    if (data && typeof data === 'object' && 'data' in data) return (data as any).data as T
    return data as T
  }
  return res as T
}

function pickCodes(payload: any): Code[] {
  if (!payload) return []
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.codes)) return payload.codes
  if (Array.isArray(payload?.items)) return payload.items
  if (Array.isArray(payload?.content)) return payload.content
  if (Array.isArray(payload?.result)) return payload.result
  if (Array.isArray(payload?.result?.codes)) return payload.result.codes
  if (Array.isArray(payload?.result?.items)) return payload.result.items
  if (Array.isArray(payload?.result?.content)) return payload.result.content
  return []
}

export function useCaseStatusCodes() {
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
    ...assignmentWorks.value.map((code) => ({ label: code.description, value: code.description }))
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

      workTypes.value = pickCodes(unwrap<any>(workTypeRes))
      assignmentWorks.value = pickCodes(unwrap<any>(assignedWorkRes))
      registryMethods.value = pickCodes(unwrap<any>(registryMethodRes))
      progressStatuses.value = pickCodes(unwrap<any>(progressStatusRes))
    } catch (error: any) {
      codesError.value = error?.message ?? '코드 목록 로딩 실패'
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
