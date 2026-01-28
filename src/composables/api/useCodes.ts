/**
 * @file useCodes.ts
 * @description 공통코드 관련 Composable (조회 전용)
 * @domain [P06] 공통코드
 */

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

/**
 * 공통코드 관리 Composable
 */
export function useCodes() {
  // ============================================================================
  // State
  // ============================================================================

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
    assignedWorks: [], // ⚠️ CodeResponse에는 assignedWorks
    progressStatuses: [],
    quoteProgressStatuses: [],
    estimateWritingStatuses: [],
    estimateSelectionStatuses: [],
    progressTypes: [],
    partyRoles: [], // ⚠️ API 없음 - 빈 배열로 초기화만
    partyRolesForRequest: [], // ⚠️ API 없음 - 빈 배열로 초기화만
    registryTypesForAssign: [] // ⚠️ API 없음 - 빈 배열로 초기화만
  })

  const isLoading = ref(false)
  const loadError = ref<string | null>(null)

  // ============================================================================
  // 빠른 조회를 위한 Map (computed)
  // ============================================================================

  const codeMaps = computed(() => {
    const maps: Record<string, CodeMap | RoleLevelCodeMap> = {}

    // userRoleLevels는 level 정보 포함
    maps.userRoleLevels = new Map(
      codes.value.userRoleLevels.map((item) => [
        item.code,
        { level: item.level, description: item.description }
      ])
    ) as RoleLevelCodeMap

    // 나머지는 일반 CodeMap
    const keys = Object.keys(codes.value).filter((key) => key !== 'userRoleLevels') as CodeKey[]

    keys.forEach((key) => {
      maps[key] = new Map((codes.value[key] as Code[]).map((item) => [item.code, item.description]))
    })

    return maps
  })

  // ============================================================================
  // API Functions
  // ============================================================================

  /**
   * 특정 카테고리의 코드만 조회
   */
  async function fetchCodesByCategory(category: CodeKey) {
    isLoading.value = true
    loadError.value = null

    try {
      logger.info('[CODES] Fetching codes by category', { category })

      const apiMethodMap: Record<CodeKey, () => Promise<any>> = {
        organizationTypes: codeAPI.getOrganizationTypes,
        organizationStatuses: codeAPI.getOrganizationStatuses,
        qualifiedTypes: codeAPI.getQualifiedTypes,
        branchStatuses: codeAPI.getBranchStatuses,
        userRoleLevels: codeAPI.getUserRoleLevels,
        registryTypes: codeAPI.getRegistryTypes,
        registryCauses: codeAPI.getRegistryCauses,
        partyTypes: codeAPI.getPartyTypes,
        propertyTypes: codeAPI.getPropertyTypes,
        sections: codeAPI.getSections,
        registryMethods: codeAPI.getRegistryMethods,
        securedDebtScopeTypes: codeAPI.getSecuredDebtScopeTypes,
        certificateTypes: codeAPI.getCertificateTypes,
        workTypes: codeAPI.getWorkTypes,
        paymentStatuses: codeAPI.getPaymentStatuses,
        adminInfoLinkTime: codeAPI.getAdminInfoLinkTime,
        userStatuses: codeAPI.getUserStatuses,
        assignedWorks: codeAPI.getAssignmentWorks, // ⚠️ API는 getAssignmentWorks
        progressStatuses: codeAPI.getProgressStatuses,
        quoteProgressStatuses: codeAPI.getQuoteProgressStatuses,
        estimateWritingStatuses: codeAPI.getEstimateWritingStatuses,
        estimateSelectionStatuses: codeAPI.getEstimateSelectionStatuses,
        progressTypes: codeAPI.getProgressTypes,
        // ⚠️ 아래 3개는 API 메서드가 없으므로 더미 함수 반환
        partyRoles: async () => ({ data: [] }),
        partyRolesForRequest: async () => ({ data: [] }),
        registryTypesForAssign: async () => ({ data: [] })
      }

      const response = await apiMethodMap[category]()
      codes.value[category] = response.data as any

      logger.info('[CODES] Codes loaded successfully', { category })
      return response.data
    } catch (error) {
      logger.error('[CODES] Failed to fetch codes', { category, error })
      loadError.value = `${category} 로드 실패`
      throw error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 모든 공통코드 일괄 조회
   */
  async function fetchAllCodes() {
    isLoading.value = true
    loadError.value = null

    try {
      const startTime = performance.now()
      logger.info('[CODES] Fetching all codes')

      const [
        orgTypes,
        orgStatuses,
        qualTypes,
        branchStats,
        userRoles,
        regTypes,
        regCauses,
        partyTypes,
        propTypes,
        sections,
        regMethods,
        debtScopes,
        certTypes,
        workTypes,
        payStatuses,
        adminLinkTime,
        userStats,
        assignmentWorks, // ⚠️ 변수명: assignmentWorks (API 메서드명과 일치)
        progressStats,
        quoteProgressStats,
        estimateWritingStats,
        estimateSelectionStats,
        progressTypes
        // ⚠️ partyRoles, partyRolesForRequest, registryTypesForAssign는 API 없음
      ] = await Promise.all([
        codeAPI.getOrganizationTypes(),
        codeAPI.getOrganizationStatuses(),
        codeAPI.getQualifiedTypes(),
        codeAPI.getBranchStatuses(),
        codeAPI.getUserRoleLevels(),
        codeAPI.getRegistryTypes(),
        codeAPI.getRegistryCauses(),
        codeAPI.getPartyTypes(),
        codeAPI.getPropertyTypes(),
        codeAPI.getSections(),
        codeAPI.getRegistryMethods(),
        codeAPI.getSecuredDebtScopeTypes(),
        codeAPI.getCertificateTypes(),
        codeAPI.getWorkTypes(),
        codeAPI.getPaymentStatuses(),
        codeAPI.getAdminInfoLinkTime(),
        codeAPI.getUserStatuses(),
        codeAPI.getAssignmentWorks(), // ⚠️ API는 getAssignmentWorks
        codeAPI.getProgressStatuses(),
        codeAPI.getQuoteProgressStatuses(),
        codeAPI.getEstimateWritingStatuses(),
        codeAPI.getEstimateSelectionStatuses(),
        codeAPI.getProgressTypes()
        // ⚠️ 아래 3개는 API 없음
      ])

      codes.value.organizationTypes = orgTypes.data || []
      codes.value.organizationStatuses = orgStatuses.data || []
      codes.value.qualifiedTypes = qualTypes.data || []
      codes.value.branchStatuses = branchStats.data || []
      codes.value.userRoleLevels = userRoles.data || []
      codes.value.registryTypes = regTypes.data || []
      codes.value.registryCauses = regCauses.data || []
      codes.value.partyTypes = partyTypes.data || []
      codes.value.propertyTypes = propTypes.data || []
      codes.value.sections = sections.data || []
      codes.value.registryMethods = regMethods.data || []
      codes.value.securedDebtScopeTypes = debtScopes.data || []
      codes.value.certificateTypes = certTypes.data || []
      codes.value.workTypes = workTypes.data || []
      codes.value.paymentStatuses = payStatuses.data || []
      codes.value.adminInfoLinkTime = adminLinkTime.data || []
      codes.value.userStatuses = userStats.data || []
      codes.value.assignedWorks = assignmentWorks.data || [] // ⚠️ assignedWorks에 저장
      codes.value.progressStatuses = progressStats.data || []
      codes.value.quoteProgressStatuses = quoteProgressStats.data || []
      codes.value.estimateWritingStatuses = estimateWritingStats.data || []
      codes.value.estimateSelectionStatuses = estimateSelectionStats.data || []
      codes.value.progressTypes = progressTypes.data || []
      // ⚠️ 아래 3개는 API 없으므로 빈 배열 유지
      codes.value.partyRoles = []
      codes.value.partyRolesForRequest = []
      codes.value.registryTypesForAssign = []

      const endTime = performance.now()
      const loadTime = (endTime - startTime).toFixed(2)

      logger.info('[CODES] All codes loaded successfully', { loadTime: `${loadTime}ms` })
      return codes.value
    } catch (error) {
      logger.error('[CODES] Failed to fetch all codes', { error })
      loadError.value = '공통코드 로드 실패'
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // ============================================================================
  // 유틸리티 함수
  // ============================================================================

  function getCodeLabel(category: CodeKey, code: string): string {
    const map = codeMaps.value[category]

    if (category === 'userRoleLevels') {
      const roleLevelMap = map as RoleLevelCodeMap
      return roleLevelMap.get(code)?.description || code
    }

    const codeMap = map as CodeMap
    return codeMap.get(code) || code
  }

  function getRoleLevel(code: string): number | null {
    const map = codeMaps.value.userRoleLevels as RoleLevelCodeMap
    return map.get(code)?.level ?? null
  }

  function getCodeOptions(category: CodeKey): SelectOption[] {
    const codeList = codes.value[category]

    if (!codeList || codeList.length === 0) {
      return []
    }

    return codeList.map((item) => ({
      value: item.code,
      label: item.description
    }))
  }

  function hasCode(category: CodeKey, code: string): boolean {
    const map = codeMaps.value[category]

    if (category === 'userRoleLevels') {
      return (map as RoleLevelCodeMap).has(code)
    }

    return (map as CodeMap).has(code)
  }

  function getCodes(category: CodeKey): Code[] | RoleLevelCode[] {
    return codes.value[category] || []
  }

  function clearCache() {
    codes.value = {
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
      registryTypesForAssign: []
    }
    loadError.value = null
    logger.info('[CODES] Cache cleared')
  }

  // ============================================================================
  // Return
  // ============================================================================

  return {
    // State
    codes,
    isLoading,
    loadError,

    // API Functions
    fetchCodesByCategory,
    fetchAllCodes,

    // Utility Functions
    getCodeLabel,
    getRoleLevel,
    getCodeOptions,
    hasCode,
    getCodes,
    clearCache
  }
}
