import type { ApiResponse, Code } from '@/types'
import type { RoleLevelCode } from '@/types/code'

import { apiHelpers } from './client'
import { API } from './endpoints'

export const codesAPI = {
  // 기관 유형 목록
  async getOrganizationTypes() {
    return apiHelpers.get<ApiResponse<Code[]>>(API.CODE.ORGANIZATION_TYPES)
  },

  // 기관 상태 목록
  async getOrganizationStatuses() {
    return apiHelpers.get<ApiResponse<Code[]>>(API.CODE.ORGANIZATION_STATUSES)
  },

  // 자격 유형 목록
  async getQualifiedTypes() {
    return apiHelpers.get<ApiResponse<Code[]>>(API.CODE.QUALIFIED_TYPES)
  },

  // 지점 상태 목록
  async getBranchStatuses() {
    return apiHelpers.get<ApiResponse<Code[]>>(API.CODE.BRANCH_STATUSES)
  },

  // 사용자 권한 레벨 목록
  async getUserRoleLevels() {
    return apiHelpers.get<ApiResponse<RoleLevelCode[]>>(API.CODE.USER_ROLE_LEVELS)
  },

  // 등기 유형 목록
  async getRegistryTypes() {
    return apiHelpers.get<ApiResponse<Code[]>>(API.CODE.REGISTRY_TYPES)
  },

  // 등기 원인 목록
  async getRegistryCauses() {
    return apiHelpers.get<ApiResponse<Code[]>>(API.CODE.REGISTRY_CAUSES)
  },

  // 당사자 유형 목록
  async getPartyTypes() {
    return apiHelpers.get<ApiResponse<Code[]>>(API.CODE.PARTY_TYPES)
  },

  // 부동산 유형 목록
  async getPropertyTypes() {
    return apiHelpers.get<ApiResponse<Code[]>>(API.CODE.PROPERTY_TYPES)
  },

  // 구역 목록
  async getSections() {
    return apiHelpers.get<ApiResponse<Code[]>>(API.CODE.SECTIONS)
  },

  // 등기 방법 목록
  async getRegistryMethods() {
    return apiHelpers.get<ApiResponse<Code[]>>(API.CODE.REGISTRY_METHODS)
  },

  // 담보채무 범위 유형 목록
  async getSecuredDebtScopeTypes() {
    return apiHelpers.get<ApiResponse<Code[]>>(API.CODE.SECURED_DEBT_SCOPE_TYPES)
  },

  // 권리증 유형 목록
  async getCertificateTypes() {
    return apiHelpers.get<ApiResponse<Code[]>>(API.CODE.CERTIFICATE_TYPES)
  },

  // 업무 유형 목록
  async getWorkTypes() {
    return apiHelpers.get<ApiResponse<Code[]>>(API.CODE.WORK_TYPES)
  },

  // 지급 상태 목록
  async getPaymentStatuses() {
    return apiHelpers.get<ApiResponse<Code[]>>(API.CODE.PAYMENT_STATUSES)
  },

  // 행정정보 연계 시간 목록
  async getAdminInfoLinkTime() {
    return apiHelpers.get<ApiResponse<Code[]>>(API.CODE.ADMIN_INFO_LINK_TIME)
  }
}
