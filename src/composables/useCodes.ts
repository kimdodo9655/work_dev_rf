import { computed, ref } from 'vue'

import { codesAPI } from '@/api/codes'
import type { Code, SelectOption } from '@/types'
import type { CodeKey, CodeMap, CodeResponse, RoleLevelCode, RoleLevelCodeMap } from '@/types/code'
import { logger } from '@/utils/logger'

/**
 * 공통코드 관리 Composable
 *
 * @example
 * const { codes, isLoading, getCodeLabel, getCodeOptions } = useCodes()
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
    adminInfoLinkTime: []
  })

  const isLoading = ref(false)

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
  // API 호출
  // ============================================================================

  /**
   * 특정 카테고리의 코드만 조회
   */
  async function fetchCodesByCategory(category: CodeKey) {
    isLoading.value = true

    try {
      logger.info('[CODES] Fetching codes by category', { category })

      const apiMethodMap: Record<CodeKey, () => Promise<any>> = {
        organizationTypes: codesAPI.getOrganizationTypes,
        organizationStatuses: codesAPI.getOrganizationStatuses,
        qualifiedTypes: codesAPI.getQualifiedTypes,
        branchStatuses: codesAPI.getBranchStatuses,
        userRoleLevels: codesAPI.getUserRoleLevels,
        registryTypes: codesAPI.getRegistryTypes,
        registryCauses: codesAPI.getRegistryCauses,
        partyTypes: codesAPI.getPartyTypes,
        propertyTypes: codesAPI.getPropertyTypes,
        sections: codesAPI.getSections,
        registryMethods: codesAPI.getRegistryMethods,
        securedDebtScopeTypes: codesAPI.getSecuredDebtScopeTypes,
        certificateTypes: codesAPI.getCertificateTypes,
        workTypes: codesAPI.getWorkTypes,
        paymentStatuses: codesAPI.getPaymentStatuses,
        adminInfoLinkTime: codesAPI.getAdminInfoLinkTime
      }

      const response = await apiMethodMap[category]()
      codes.value[category] = response.data as any

      logger.info('[CODES] Codes loaded successfully', { category })
      return response.data
    } catch (error) {
      logger.error('[CODES] Failed to fetch codes', { category, error })
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
      adminInfoLinkTime: []
    }
    logger.info('[CODES] Cache cleared')
  }

  // ============================================================================
  // Return
  // ============================================================================

  return {
    // State
    codes,
    isLoading,

    // API
    fetchCodesByCategory,

    // Utilities
    getCodeLabel,
    getRoleLevel,
    getCodeOptions,
    hasCode,
    getCodes,
    clearCache
  }
}
