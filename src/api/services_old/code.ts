import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type { ApiResponse, Code, RoleLevelCode } from '@/types'

export const codeAPI = {
  /**
   * [P06-01] 기관 유형 목록 조회
   * @returns 기관 유형 코드 목록
   * @throws {ApiError} 조회 실패 시
   */
  async getOrganizationTypes() {
    return apiHelpers.get<ApiResponse<Code[]>>(API.CODE.ORGANIZATION_TYPES)
  },

  /**
   * [P06-02] 기관 상태 목록 조회
   * @returns 기관 상태 코드 목록
   * @throws {ApiError} 조회 실패 시
   */
  async getOrganizationStatuses() {
    return apiHelpers.get<ApiResponse<Code[]>>(API.CODE.ORGANIZATION_STATUSES)
  },

  /**
   * [P06-03] 자격 유형 목록 조회
   * @returns 자격 유형 코드 목록
   * @throws {ApiError} 조회 실패 시
   */
  async getQualifiedTypes() {
    return apiHelpers.get<ApiResponse<Code[]>>(API.CODE.QUALIFIED_TYPES)
  },

  /**
   * [P06-04] 지점 상태 목록 조회
   * @returns 지점 상태 코드 목록
   * @throws {ApiError} 조회 실패 시
   */
  async getBranchStatuses() {
    return apiHelpers.get<ApiResponse<Code[]>>(API.CODE.BRANCH_STATUSES)
  },

  /**
   * [P06-05] 사용자 권한 레벨 목록 조회
   * @returns 사용자 권한 레벨 코드 목록 (level 포함)
   * @throws {ApiError} 조회 실패 시
   */
  async getUserRoleLevels() {
    return apiHelpers.get<ApiResponse<RoleLevelCode[]>>(API.CODE.USER_ROLE_LEVELS)
  },

  /**
   * [P06-06] 등기 유형 목록 조회
   * @returns 등기 유형 코드 목록
   * @throws {ApiError} 조회 실패 시
   */
  async getRegistryTypes() {
    return apiHelpers.get<ApiResponse<Code[]>>(API.CODE.REGISTRY_TYPES)
  },

  /**
   * [P06-07] 등기 원인 목록 조회
   * @returns 등기 원인 코드 목록
   * @throws {ApiError} 조회 실패 시
   */
  async getRegistryCauses() {
    return apiHelpers.get<ApiResponse<Code[]>>(API.CODE.REGISTRY_CAUSES)
  },

  /**
   * [P06-08] 당사자 유형 목록 조회
   * @returns 당사자 유형 코드 목록
   * @throws {ApiError} 조회 실패 시
   */
  async getPartyTypes() {
    return apiHelpers.get<ApiResponse<Code[]>>(API.CODE.PARTY_TYPES)
  },

  /**
   * [P06-09] 부동산 유형 목록 조회
   * @returns 부동산 유형 코드 목록
   * @throws {ApiError} 조회 실패 시
   */
  async getPropertyTypes() {
    return apiHelpers.get<ApiResponse<Code[]>>(API.CODE.PROPERTY_TYPES)
  },

  /**
   * [P06-10] 구역 목록 조회
   * @returns 구역 코드 목록
   * @throws {ApiError} 조회 실패 시
   */
  async getSections() {
    return apiHelpers.get<ApiResponse<Code[]>>(API.CODE.SECTIONS)
  },

  /**
   * [P06-11] 등기 방법 목록 조회
   * @returns 등기 방법 코드 목록
   * @throws {ApiError} 조회 실패 시
   */
  async getRegistryMethods() {
    return apiHelpers.get<ApiResponse<Code[]>>(API.CODE.REGISTRY_METHODS)
  },

  /**
   * [P06-12] 담보채무 범위 유형 목록 조회
   * @returns 담보채무 범위 유형 코드 목록
   * @throws {ApiError} 조회 실패 시
   */
  async getSecuredDebtScopeTypes() {
    return apiHelpers.get<ApiResponse<Code[]>>(API.CODE.SECURED_DEBT_SCOPE_TYPES)
  },

  /**
   * [P06-13] 권리증 유형 목록 조회
   * @returns 권리증 유형 코드 목록
   * @throws {ApiError} 조회 실패 시
   */
  async getCertificateTypes() {
    return apiHelpers.get<ApiResponse<Code[]>>(API.CODE.CERTIFICATE_TYPES)
  },

  /**
   * [P06-14] 업무 유형 목록 조회
   * @returns 업무 유형 코드 목록
   * @throws {ApiError} 조회 실패 시
   */
  async getWorkTypes() {
    return apiHelpers.get<ApiResponse<Code[]>>(API.CODE.WORK_TYPES)
  },

  /**
   * [P06-15] 지급 상태 목록 조회
   * @returns 지급 상태 코드 목록
   * @throws {ApiError} 조회 실패 시
   */
  async getPaymentStatuses() {
    return apiHelpers.get<ApiResponse<Code[]>>(API.CODE.PAYMENT_STATUSES)
  },

  /**
   * [P06-16] 행정정보 연계 시간 목록 조회
   * @returns 행정정보 연계 시간 코드 목록
   * @throws {ApiError} 조회 실패 시
   */
  async getAdminInfoLinkTime() {
    return apiHelpers.get<ApiResponse<Code[]>>(API.CODE.ADMIN_INFO_LINK_TIME)
  },

  /**
   * [P06-17] 사용자 상태 목록 조회
   * @returns 사용자 상태 코드 목록
   * @throws {ApiError} 조회 실패 시
   */
  async getUserStatuses() {
    return apiHelpers.get<ApiResponse<Code[]>>(API.CODE.USER_STATUSES)
  },

  /**
   * [P06-18] 진행 상태 목록 조회
   * @returns 진행 상태 코드 목록
   * @throws {ApiError} 조회 실패 시
   */
  async getProgressStatuses() {
    return apiHelpers.get<ApiResponse<Code[]>>(API.CODE.PROGRESS_STATUSES)
  },

  /**
   * [P06-19] 등기 견적 진행 상태 목록 조회
   * @returns 등기 견적 진행 상태 코드 목록
   * @throws {ApiError} 조회 실패 시
   */
  async getQuoteProgressStatuses() {
    return apiHelpers.get<ApiResponse<Code[]>>(API.CODE.QUOTE_PROGRESS_STATUSES)
  },

  /**
   * [P06-20] 등기 견적 작성 여부 목록 조회
   * @returns 등기 견적 작성 여부 코드 목록
   * @throws {ApiError} 조회 실패 시
   */
  async getEstimateWritingStatuses() {
    return apiHelpers.get<ApiResponse<Code[]>>(API.CODE.ESTIMATE_WRITING_STATUSES)
  },

  /**
   * [P06-21] 등기 견적 선정 상태 목록 조회
   * @returns 등기 견적 선정 상태 코드 목록
   * @throws {ApiError} 조회 실패 시
   */
  async getEstimateSelectionStatuses() {
    return apiHelpers.get<ApiResponse<Code[]>>(API.CODE.ESTIMATE_SELECTION_STATUSES)
  },

  /**
   * [P06-22] 배정 업무 목록 조회
   * @returns 배정 업무 코드 목록
   * @throws {ApiError} 조회 실패 시
   */
  async getAssignmentWorks() {
    return apiHelpers.get<ApiResponse<Code[]>>(API.CODE.ASSIGNMENT_WORKS)
  },

  /**
   * [P06-23] 등기 진행 유형 목록 조회
   * @returns 등기 진행 유형 코드 목록
   * @throws {ApiError} 조회 실패 시
   */
  async getProgressTypes() {
    return apiHelpers.get<ApiResponse<Code[]>>(API.CODE.PROGRESS_TYPES)
  },

  /**
   * [P06-24] 당사자 구분 목록 조회
   * @returns 당사자 구분 코드 목록
   * @throws {ApiError} 조회 실패 시
   */
  async getPartyRoles() {
    return apiHelpers.get<ApiResponse<Code[]>>(API.CODE.PARTY_ROLES)
  },

  /**
   * [P06-25] 당사자 구분 (등기의뢰 계약당사자) 목록 조회
   * @returns 당사자 구분 (등기의뢰 계약당사자) 코드 목록
   * @throws {ApiError} 조회 실패 시
   */
  async getPartyRolesForRequest() {
    return apiHelpers.get<ApiResponse<Code[]>>(API.CODE.PARTY_ROLES_FOR_REQUEST)
  },

  /**
   * [P06-26] 금융기관 담당(배정) 등기유형 목록 조회
   * @returns 금융기관 담당(배정) 등기유형 코드 목록
   * @throws {ApiError} 조회 실패 시
   */
  async getRegistryTypesForAssign() {
    return apiHelpers.get<ApiResponse<Code[]>>(API.CODE.REGISTRY_TYPES_FOR_ASSIGN)
  }
}
