import { computed, ref } from 'vue'

import { codeAPI } from '@/api/services/code'
import type {
  Code,
  CodeKey,
  CodeMap,
  CodeResponse,
  RoleLevelCode,
  RoleLevelCodeMap,
  SelectOption
} from '@/types'
import { logger } from '@/utils/logger'

/** axios 응답({data}) / DTO 응답(그 자체) 둘 다 지원 */
function unwrap<T>(res: any): T {
  if (res && typeof res === 'object' && 'data' in res) return res.data as T
  return res as T
}

export function useCodes() {
  const codes = ref<CodeResponse>({
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

    // (프로젝트에 실제로 CodeKey/CodeResponse에 추가된 키만 남기세요)
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
  } as any)

  const isLoading = ref(false)
  const loadError = ref<string | null>(null)

  const codeMaps = computed(() => {
    const maps: Record<string, CodeMap | RoleLevelCodeMap> = {}

    maps.userRoleLevels = new Map(
      codes.value.userRoleLevels.map((item) => [
        item.code,
        { level: item.level, description: item.description }
      ])
    ) as RoleLevelCodeMap

    const keys = Object.keys(codes.value).filter((k) => k !== 'userRoleLevels') as CodeKey[]
    keys.forEach((key) => {
      maps[key] = new Map((codes.value[key] as Code[]).map((item) => [item.code, item.description]))
    })

    return maps
  })

  /** ✅ 카테고리 -> API 함수 매핑 (키 기반) */
  const apiMethodMap: Record<CodeKey, () => Promise<any>> = {
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

    // ⚠️ state 키는 assignedWorks, API 함수명은 assignmentWorks 인 케이스
    assignedWorks: codeAPI.assignmentWorks,

    progressStatuses: codeAPI.progressStatuses,
    quoteProgressStatuses: codeAPI.quoteProgressStatuses,
    estimateWritingStatuses: codeAPI.estimateWritingStatuses,
    estimateSelectionStatuses: codeAPI.estimateSelectionStatuses,
    progressTypes: codeAPI.progressTypes,
    partyRoles: codeAPI.partyRoles,
    partyRolesForRequest: codeAPI.partyRolesForRequest,
    registryTypesForAssign: codeAPI.registryTypesForAssign,

    // 신규(P06-27~44) - 실제로 CodeKey에 포함된 것만 유지
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
    successCodes: codeAPI.successCodes,
    errorCodes: codeAPI.errorCodes
  } as any

  async function fetchCodesByCategory(category: CodeKey) {
    isLoading.value = true
    loadError.value = null

    try {
      logger.info('[CODES] Fetching codes by category', { category })

      const res = await apiMethodMap[category]()
      const payload = unwrap<any>(res)

      // ✅ 응답이 배열이면 그대로, DTO면 흔한 케이스로 한번 더 처리
      // - 서버/생성기마다 payload 구조가 달라질 수 있어서 안전하게 처리
      const list = Array.isArray(payload)
        ? payload
        : payload?.items
          ? payload.items
          : payload?.result
            ? payload.result
            : payload?.data
              ? payload.data
              : payload

      codes.value[category] = (list ?? []) as any

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

  async function fetchAllCodes() {
    isLoading.value = true
    loadError.value = null

    try {
      const startTime = performance.now()
      logger.info('[CODES] Fetching all codes')

      const entries = Object.entries(apiMethodMap) as Array<[CodeKey, () => Promise<any>]>

      const settled = await Promise.all(
        entries.map(async ([key, fn]) => {
          const res = await fn()
          const payload = unwrap<any>(res)
          const list = Array.isArray(payload)
            ? payload
            : payload?.items
              ? payload.items
              : payload?.result
                ? payload.result
                : payload?.data
                  ? payload.data
                  : payload
          return [key, list ?? []] as const
        })
      )

      // ✅ 키 기반으로 안전하게 할당 (인덱스 i++ 제거)
      settled.forEach(([key, list]) => {
        ;(codes.value as any)[key] = list
      })

      logger.info('[CODES] All codes loaded successfully', {
        loadTime: `${(performance.now() - startTime).toFixed(2)}ms`
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

  // --- 이하 유틸들은 기존 그대로 사용 가능 ---
  function getCodeLabel(category: CodeKey, code: string): string {
    const map = codeMaps.value[category]
    if (category === 'userRoleLevels')
      return (map as RoleLevelCodeMap).get(code)?.description || code
    return (map as CodeMap).get(code) || code
  }

  function getRoleLevel(code: string): number | null {
    const map = codeMaps.value.userRoleLevels as RoleLevelCodeMap
    return map.get(code)?.level ?? null
  }

  function getCodeOptions(category: CodeKey): SelectOption[] {
    const codeList = codes.value[category]
    if (!codeList?.length) return []
    return codeList.map((item) => ({ value: item.code, label: item.description }))
  }

  function hasCode(category: CodeKey, code: string): boolean {
    const map = codeMaps.value[category]
    return category === 'userRoleLevels'
      ? (map as RoleLevelCodeMap).has(code)
      : (map as CodeMap).has(code)
  }

  function getCodes(category: CodeKey): Code[] | RoleLevelCode[] {
    return codes.value[category] || []
  }

  function clearCache() {
    Object.keys(codes.value).forEach((k) => ((codes.value as any)[k] = []))
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
