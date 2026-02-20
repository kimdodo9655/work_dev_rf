import { computed, ref } from 'vue'

import { codeAPI } from '@/api/services/code'
import type {
  ApiCodeResponse,
  Code,
  CodeKey,
  CodeMap,
  CodeResponse,
  RoleLevelCode,
  RoleLevelCodeMap,
  SelectOption
} from '@/types'
import { logger } from '@/utils/logger'

// ──────────────────────────────────────────────────────
// 상수
// ──────────────────────────────────────────────────────

/**
 * CodeResponse 중 Code[] 구조가 아닌 특수 키
 * - userRoleLevels  : RoleLevelCode[] (code + level + description)
 * - successCodes    : ApiCodeResponse[] (code + status + title + message)
 * - errorCodes      : ApiCodeResponse[] (code + status + title + message)
 */
const SPECIAL_KEYS = new Set<CodeKey>(['userRoleLevels', 'successCodes', 'errorCodes'])

// ──────────────────────────────────────────────────────
// 초기값
// ──────────────────────────────────────────────────────

function createInitialCodes(): CodeResponse {
  return {
    organizationTypes: [],
    organizationStatuses: [],
    qualifiedTypes: [],
    branchStatuses: [],
    userRoleLevels: [],
    registryTypes: [],
    registryCauses: [],
    partyTypes: [],
    propertyTypes: [],
    sections: [],
    registryMethods: [],
    securedDebtScopeTypes: [],
    certificateTypes: [],
    workTypes: [],
    paymentStatuses: [],
    adminInfoLinkTime: [],
    userStatuses: [],
    assignedWorks: [],
    progressStatuses: [],
    quoteProgressStatuses: [],
    estimateWritingStatuses: [],
    estimateSelectionStatuses: [],
    progressTypes: [],
    partyRoles: [],
    partyRolesForRequest: [],
    registryTypesForAssign: [],
    actionTypes: [],
    bondPurchaseTypes: [],
    correctionTypes: [],
    dataSources: [],
    eSignatureMethods: [],
    eSignatureStatuses: [],
    fileProgressDocumentTypes: [],
    fileRegistryTypes: [],
    fileRequestDocumentTypes: [],
    ownershipTypes: [],
    processActions: [],
    propertyBuildTypes: [],
    rpaUserTaskStatuses: [],
    rpaUserTaskTypes: [],
    confirmationDocumentTypes: [],
    fileBranchDocumentTypes: [],
    successCodes: [],
    errorCodes: []
  }
}

// ──────────────────────────────────────────────────────
// CodeKey → API 함수 매핑
// ──────────────────────────────────────────────────────

/**
 * CodeResponse 키와 codeAPI 메서드를 1:1 매핑합니다.
 *
 * ※ assignedWorks(state 키) ↔ codeAPI.assignmentWorks(API명) 불일치 주의
 */
const API_METHOD_MAP: Record<CodeKey, () => Promise<Code[] | RoleLevelCode[] | ApiCodeResponse[]>> =
  {
    // P06-01 ~ 17
    organizationTypes: codeAPI.organizationTypes,
    organizationStatuses: codeAPI.organizationStatuses,
    qualifiedTypes: codeAPI.qualifiedTypes,
    branchStatuses: codeAPI.branchStatuses,
    userRoleLevels: codeAPI.userRoleLevels,
    registryTypes: codeAPI.registryTypes,
    registryCauses: codeAPI.registryCauses,
    partyTypes: codeAPI.partyTypes,
    propertyTypes: codeAPI.propertyTypes,
    sections: codeAPI.sections,
    registryMethods: codeAPI.registryMethods,
    securedDebtScopeTypes: codeAPI.securedDebtScopeTypes,
    certificateTypes: codeAPI.certificateTypes,
    workTypes: codeAPI.workTypes,
    paymentStatuses: codeAPI.paymentStatuses,
    adminInfoLinkTime: codeAPI.adminInfoLinkTime,
    userStatuses: codeAPI.userStatuses,
    // P06-18: state 키 = assignedWorks, API 메서드명 = assignmentWorks
    assignedWorks: codeAPI.assignmentWorks,
    // P06-19 ~ 26
    progressStatuses: codeAPI.progressStatuses,
    quoteProgressStatuses: codeAPI.quoteProgressStatuses,
    estimateWritingStatuses: codeAPI.estimateWritingStatuses,
    estimateSelectionStatuses: codeAPI.estimateSelectionStatuses,
    progressTypes: codeAPI.progressTypes,
    partyRoles: codeAPI.partyRoles,
    partyRolesForRequest: codeAPI.partyRolesForRequest,
    registryTypesForAssign: codeAPI.registryTypesForAssign,
    // P06-27 ~ 42
    actionTypes: codeAPI.actionTypes,
    bondPurchaseTypes: codeAPI.bondPurchaseTypes,
    correctionTypes: codeAPI.correctionTypes,
    dataSources: codeAPI.dataSources,
    eSignatureMethods: codeAPI.eSignatureMethods,
    eSignatureStatuses: codeAPI.eSignatureStatuses,
    fileProgressDocumentTypes: codeAPI.fileProgressDocumentTypes,
    fileRegistryTypes: codeAPI.fileRegistryTypes,
    fileRequestDocumentTypes: codeAPI.fileRequestDocumentTypes,
    ownershipTypes: codeAPI.ownershipTypes,
    processActions: codeAPI.processActions,
    propertyBuildTypes: codeAPI.propertyBuildTypes,
    rpaUserTaskStatuses: codeAPI.rpaUserTaskStatuses,
    rpaUserTaskTypes: codeAPI.rpaUserTaskTypes,
    confirmationDocumentTypes: codeAPI.confirmationDocumentTypes,
    fileBranchDocumentTypes: codeAPI.fileBranchDocumentTypes,
    // P06-43 ~ 44 (ApiCodeResponse[] — Code[]와 구조 다름)
    successCodes: codeAPI.successCodes,
    errorCodes: codeAPI.errorCodes
  }

// ──────────────────────────────────────────────────────
// 컴포저블
// ──────────────────────────────────────────────────────

export function useCodes() {
  const codes = ref<CodeResponse>(createInitialCodes())
  const isLoading = ref(false)
  const loadError = ref<string | null>(null)

  // ── codeMaps ──────────────────────────────────────
  /**
   * 빠른 조회를 위한 Map 컬렉션
   * - userRoleLevels  → RoleLevelCodeMap
   * - successCodes    → Map<string, string>  (code → title)
   * - errorCodes      → Map<string, string>  (code → title)
   * - 그 외           → CodeMap              (code → description)
   */
  const codeMaps = computed(() => {
    const maps: Record<string, CodeMap | RoleLevelCodeMap> = {}

    for (const key of Object.keys(codes.value) as CodeKey[]) {
      if (key === 'userRoleLevels') {
        maps.userRoleLevels = new Map(
          (codes.value.userRoleLevels as RoleLevelCode[]).map((item) => [
            item.code,
            { level: item.level, description: item.description }
          ])
        ) as RoleLevelCodeMap
      } else if (key === 'successCodes' || key === 'errorCodes') {
        // ApiCodeResponse — description 없음, title 로 대체
        maps[key] = new Map(
          (codes.value[key] as unknown as ApiCodeResponse[]).map((item) => [
            item.code ?? '',
            item.title ?? item.message ?? ''
          ])
        ) as CodeMap
      } else {
        maps[key] = new Map(
          (codes.value[key] as Code[]).map((item) => [item.code, item.description])
        ) as CodeMap
      }
    }

    return maps
  })

  // ── 내부 헬퍼: API 응답을 배열로 정규화 ───────────
  function toList(payload: unknown): unknown[] {
    if (Array.isArray(payload)) return payload
    return []
  }

  // ── 개별 카테고리 fetch ───────────────────────────
  async function fetchCodesByCategory(category: CodeKey) {
    isLoading.value = true
    loadError.value = null

    try {
      logger.info('[CODES] Fetching codes by category', { category })

      const res = await API_METHOD_MAP[category]()
      codes.value[category] = toList(res) as any

      logger.info('[CODES] Codes loaded successfully', { category })
      return codes.value[category]
    } catch (error) {
      logger.error('[CODES] Failed to fetch codes', { category, error })
      loadError.value = `${category} 로드 실패`
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // ── 전체 fetch ────────────────────────────────────
  async function fetchAllCodes() {
    isLoading.value = true
    loadError.value = null

    try {
      const startTime = performance.now()
      logger.info('[CODES] Fetching all codes')

      const entries = Object.entries(API_METHOD_MAP) as Array<
        [CodeKey, () => Promise<Code[] | RoleLevelCode[] | ApiCodeResponse[]>]
      >

      const results = await Promise.allSettled(entries.map(([, fn]) => fn()))

      results.forEach((result, idx) => {
        const entry = entries[idx]
        if (!entry) return
        const [key] = entry
        if (result.status === 'fulfilled') {
          codes.value[key] = toList(result.value) as any
        } else {
          logger.warn('[CODES] Failed to fetch category', { key, reason: result.reason })
        }
      })

      logger.info('[CODES] All codes loaded', {
        loadTime: `${(performance.now() - startTime).toFixed(2)}ms`,
        failed: results.filter((r) => r.status === 'rejected').length
      })

      return codes.value
    } catch (error) {
      logger.error('[CODES] Failed to fetch all codes', { error })
      loadError.value = '공통코드 로드 실패'
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // ── 유틸 ──────────────────────────────────────────

  function getCodeLabel(category: CodeKey, code: string): string {
    const map = codeMaps.value[category]
    if (category === 'userRoleLevels') {
      return (map as RoleLevelCodeMap).get(code)?.description ?? code
    }
    return (map as CodeMap).get(code) ?? code
  }

  function getRoleLevel(code: string): number | null {
    return (codeMaps.value.userRoleLevels as RoleLevelCodeMap).get(code)?.level ?? null
  }

  function getCodeOptions(category: CodeKey): SelectOption[] {
    if (SPECIAL_KEYS.has(category)) {
      if (category === 'userRoleLevels') {
        return (codes.value.userRoleLevels as RoleLevelCode[]).map((item) => ({
          value: item.code,
          label: item.description
        }))
      }
      // successCodes / errorCodes
      return (codes.value[category] as unknown as ApiCodeResponse[]).map((item) => ({
        value: item.code ?? '',
        label: item.title ?? item.message ?? item.code ?? ''
      }))
    }
    return (codes.value[category] as Code[]).map((item) => ({
      value: item.code,
      label: item.description
    }))
  }

  function hasCode(category: CodeKey, code: string): boolean {
    const map = codeMaps.value[category]
    return category === 'userRoleLevels'
      ? (map as RoleLevelCodeMap).has(code)
      : (map as CodeMap).has(code)
  }

  function getCodes(category: CodeKey): Code[] | RoleLevelCode[] {
    return (codes.value[category] as Code[] | RoleLevelCode[]) ?? []
  }

  function clearCache() {
    codes.value = createInitialCodes()
    loadError.value = null
    logger.info('[CODES] Cache cleared')
  }

  return {
    codes,
    isLoading,
    loadError,
    fetchCodesByCategory,
    fetchAllCodes,
    getCodeLabel,
    getRoleLevel,
    getCodeOptions,
    hasCode,
    getCodes,
    clearCache
  }
}
