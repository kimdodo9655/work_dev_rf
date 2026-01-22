/**
 * @file useCodes.ts
 * @description 공통코드 관련 Composable (조회 전용)
 * @domain [P06] 공통코드
 */

import { computed, ref } from 'vue'

import { codeAPI } from '@/api/services/code'
import type { Code, SelectOption } from '@/types'
import type {
  CodeKey,
  CodeMap,
  CodeResponse,
  RoleLevelCode,
  RoleLevelCodeMap
} from '@/types/domains/code'
import { logger } from '@/utils/logger'

/**
 * 공통코드 관리 Composable
 *
 * @example
 * const { codes, isLoading, fetchAllCodes, getCodeLabel, getCodeOptions } = useCodes()
 *
 * // 전체 코드 일괄 조회
 * await fetchAllCodes()
 *
 * // 특정 카테고리만 조회
 * await fetchCodesByCategory('organizationStatuses')
 *
 * // 코드 라벨 조회
 * const label = getCodeLabel('organizationStatuses', 'ACTIVE') // '사용'
 *
 * // SelectOption 변환
 * const options = getCodeOptions('organizationStatuses') // [{ value: 'ACTIVE', label: '사용' }, ...]
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
    userStatuses: [] // [P06-17] 추가
  })

  const isLoading = ref(false)
  const loadError = ref<string | null>(null)

  // ============================================================================
  // 빠른 조회를 위한 Map (computed)
  // ============================================================================

  /**
   * 각 코드 카테고리별 Map 생성
   */
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

  // [P06-*] 특정 카테고리 코드 조회
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
        userStatuses: codeAPI.getUserStatuses // [P06-17] 추가
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

  // [P06-*] 모든 공통코드 일괄 조회
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
        userStats
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
        codeAPI.getUserStatuses()
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

  /**
   * 코드로 라벨(설명) 조회
   */
  function getCodeLabel(category: CodeKey, code: string): string {
    const map = codeMaps.value[category]

    if (category === 'userRoleLevels') {
      const roleLevelMap = map as RoleLevelCodeMap
      return roleLevelMap.get(code)?.description || code
    }

    const codeMap = map as CodeMap
    return codeMap.get(code) || code
  }

  /**
   * 권한 레벨 조회 (userRoleLevels 전용)
   */
  function getRoleLevel(code: string): number | null {
    const map = codeMaps.value.userRoleLevels as RoleLevelCodeMap
    return map.get(code)?.level ?? null
  }

  /**
   * 코드 배열을 SelectOption 배열로 변환
   */
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

  /**
   * 코드 존재 여부 확인
   */
  function hasCode(category: CodeKey, code: string): boolean {
    const map = codeMaps.value[category]

    if (category === 'userRoleLevels') {
      return (map as RoleLevelCodeMap).has(code)
    }

    return (map as CodeMap).has(code)
  }

  /**
   * 특정 카테고리의 모든 코드 목록 조회
   */
  function getCodes(category: CodeKey): Code[] | RoleLevelCode[] {
    return codes.value[category] || []
  }

  /**
   * 캐시 초기화
   */
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
      userStatuses: []
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
