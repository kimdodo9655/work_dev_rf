// --------------------------------------------------
// [P06] 공통코드
// --------------------------------------------------

import { apiHelpers } from '@/api/client'
import { API } from '@/api/endpoints'
import type {
  GetActionTypesResponse,
  GetAdminInfoLinkTimeResponse,
  GetAssignedWorksResponse,
  GetBondPurchaseTypesResponse,
  GetBranchStatusesResponse,
  GetCertificateTypesResponse,
  GetConfirmationDocumentTypesResponse,
  GetCorrectionTypesResponse,
  GetDataSourcesResponse,
  GetErrorCodesResponse,
  GetESignatureMethodsResponse,
  GetESignatureStatusesResponse,
  GetEstimateSelectionStatusesResponse,
  GetEstimateWritingStatusesResponse,
  GetFileBranchDocumentTypesResponse,
  GetFileProgressDocumentTypesResponse,
  GetFileRegistryTypesResponse,
  GetFileRequestDocumentTypesResponse,
  GetOrganizationStatusesResponse,
  GetOrganizationTypesResponse,
  GetOwnershipTypesResponse,
  GetPartyRolesForRequestResponse,
  GetPartyRolesResponse,
  GetPartyTypesResponse,
  GetPaymentStatusesResponse,
  GetProcessActionsResponse,
  GetProgressStatusesResponse,
  GetProgressTypesResponse,
  GetPropertyBuildTypesResponse,
  GetPropertyTypesResponse,
  GetQualifiedTypesResponse,
  GetQuoteProgressStatusesResponse,
  GetRegistryCausesResponse,
  GetRegistryMethodsResponse,
  GetRegistryTypesForAssignResponse,
  GetRegistryTypesResponse,
  GetRpaUserTaskStatusesResponse,
  GetRpaUserTaskTypesResponse,
  GetSectionsResponse,
  GetSecuredDebtScopeTypesResponse,
  GetSuccessCodesResponse,
  GetUserRoleLevelsResponse,
  GetUserStatusesResponse,
  GetWorkTypesResponse
} from '@/types'

export const codeAPI = {
  async organizationTypes() {
    // --------------------------------------------------
    // [P06-01][GET - /api/codes/organization-types] 기관 구분 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetOrganizationTypesResponse>(API.CODE.ORGANIZATION_TYPES)
  },

  async organizationStatuses() {
    // --------------------------------------------------
    // [P06-02][GET - /api/codes/organization-statuses] 기관 상태 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetOrganizationStatusesResponse>(API.CODE.ORGANIZATION_STATUSES)
  },

  async qualifiedTypes() {
    // --------------------------------------------------
    // [P06-03][GET - /api/codes/qualified-types] 자격자 구분 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetQualifiedTypesResponse>(API.CODE.QUALIFIED_TYPES)
  },

  async branchStatuses() {
    // --------------------------------------------------
    // [P06-04][GET - /api/codes/branch-statuses] 지점 상태 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetBranchStatusesResponse>(API.CODE.BRANCH_STATUSES)
  },

  async userRoleLevels() {
    // --------------------------------------------------
    // [P06-05][GET - /api/codes/user-role-levels] 사용자 권한 레벨 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetUserRoleLevelsResponse>(API.CODE.USER_ROLE_LEVELS)
  },

  async registryTypes() {
    // --------------------------------------------------
    // [P06-06][GET - /api/codes/registry-types] 등기 유형 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetRegistryTypesResponse>(API.CODE.REGISTRY_TYPES)
  },

  async registryCauses() {
    // --------------------------------------------------
    // [P06-07][GET - /api/codes/registry-causes] 등기 원인 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetRegistryCausesResponse>(API.CODE.REGISTRY_CAUSES)
  },

  async partyTypes() {
    // --------------------------------------------------
    // [P06-08][GET - /api/codes/party-types] 당사자 구분 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetPartyTypesResponse>(API.CODE.PARTY_TYPES)
  },

  async propertyTypes() {
    // --------------------------------------------------
    // [P06-09][GET - /api/codes/property-types] 부동산 구분 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetPropertyTypesResponse>(API.CODE.PROPERTY_TYPES)
  },

  async sections() {
    // --------------------------------------------------
    // [P06-10][GET - /api/codes/sections] 구분 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetSectionsResponse>(API.CODE.SECTIONS)
  },

  async registryMethods() {
    // --------------------------------------------------
    // [P06-11][GET - /api/codes/registry-methods] 등기 방식 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetRegistryMethodsResponse>(API.CODE.REGISTRY_METHODS)
  },

  async securedDebtScopeTypes() {
    // --------------------------------------------------
    // [P06-12][GET - /api/codes/secured-debt-scope-types] 채권최고액 범위 구분 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetSecuredDebtScopeTypesResponse>(API.CODE.SECURED_DEBT_SCOPE_TYPES)
  },

  async certificateTypes() {
    // --------------------------------------------------
    // [P06-13][GET - /api/codes/certificate-types] 증명서 구분 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetCertificateTypesResponse>(API.CODE.CERTIFICATE_TYPES)
  },

  async workTypes() {
    // --------------------------------------------------
    // [P06-14][GET - /api/codes/work-types] 업무 구분 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetWorkTypesResponse>(API.CODE.WORK_TYPES)
  },

  async paymentStatuses() {
    // --------------------------------------------------
    // [P06-15][GET - /api/codes/payment-statuses] 지급 상태 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetPaymentStatusesResponse>(API.CODE.PAYMENT_STATUSES)
  },

  async adminInfoLinkTime() {
    // --------------------------------------------------
    // [P06-16][GET - /api/codes/admin-info-link-times] 행정정보 연계 시점 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetAdminInfoLinkTimeResponse>(API.CODE.ADMIN_INFO_LINK_TIMES)
  },

  async userStatuses() {
    // --------------------------------------------------
    // [P06-17][GET - /api/codes/user-statuses] 사용자 상태 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetUserStatusesResponse>(API.CODE.USER_STATUSES)
  },

  async assignmentWorks() {
    // --------------------------------------------------
    // [P06-18][GET - /api/codes/assigned-works] 배정 업무 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetAssignedWorksResponse>(API.CODE.ASSIGNED_WORKS)
  },

  async progressStatuses() {
    // --------------------------------------------------
    // [P06-19][GET - /api/codes/progress-statuses] 진행 상태 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetProgressStatusesResponse>(API.CODE.PROGRESS_STATUSES)
  },

  async quoteProgressStatuses() {
    // --------------------------------------------------
    // [P06-20][GET - /api/codes/quote-progress-statuses] 등기 견적 진행 상태 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetQuoteProgressStatusesResponse>(API.CODE.QUOTE_PROGRESS_STATUSES)
  },

  async estimateWritingStatuses() {
    // --------------------------------------------------
    // [P06-21][GET - /api/codes/estimate-writing-statuses] 등기 견적 작성 여부 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetEstimateWritingStatusesResponse>(API.CODE.ESTIMATE_WRITING_STATUSES)
  },

  async estimateSelectionStatuses() {
    // --------------------------------------------------
    // [P06-22][GET - /api/codes/estimate-selection-statuses] 등기 견적 선정 상태 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetEstimateSelectionStatusesResponse>(
      API.CODE.ESTIMATE_SELECTION_STATUSES
    )
  },

  async progressTypes() {
    // --------------------------------------------------
    // [P06-23][GET - /api/codes/progress-types] 등기 진행 유형 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetProgressTypesResponse>(API.CODE.PROGRESS_TYPES)
  },

  async partyRoles() {
    // --------------------------------------------------
    // [P06-24][GET - /api/codes/party-roles] 당사자 구분 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetPartyRolesResponse>(API.CODE.PARTY_ROLES)
  },

  async partyRolesForRequest() {
    // --------------------------------------------------
    // [P06-25][GET - /api/codes/party-roles-for-request] 당사자 구분 (등기의뢰 계약당사자) 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetPartyRolesForRequestResponse>(API.CODE.PARTY_ROLES_FOR_REQUEST)
  },

  async actionTypes() {
    // --------------------------------------------------
    // [P06-27][GET - /api/codes/action-types] action 구분 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetActionTypesResponse>(API.CODE.ACTION_TYPES)
  },

  async bondPurchaseTypes() {
    // --------------------------------------------------
    // [P06-28][GET - /api/codes/bond-purchase-types] 국민주택채권 매입 구분 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetBondPurchaseTypesResponse>(API.CODE.BOND_PURCHASE_TYPES)
  },

  async correctionTypes() {
    // --------------------------------------------------
    // [P06-29][GET - /api/codes/correction-types] 경정사항 구분 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetCorrectionTypesResponse>(API.CODE.CORRECTION_TYPES)
  },

  async dataSources() {
    // --------------------------------------------------
    // [P06-30][GET - /api/codes/data-sources] 데이터 출처 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetDataSourcesResponse>(API.CODE.DATA_SOURCES)
  },

  async eSignatureMethods() {
    // --------------------------------------------------
    // [P06-31][GET - /api/codes/e-signature-methods] 전자서명 방식 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetESignatureMethodsResponse>(API.CODE.E_SIGNATURE_METHODS)
  },

  async eSignatureStatuses() {
    // --------------------------------------------------
    // [P06-32][GET - /api/codes/e-signature-statuses] 전자서명 진행 상태 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetESignatureStatusesResponse>(API.CODE.E_SIGNATURE_STATUSES)
  },

  async fileProgressDocumentTypes() {
    // --------------------------------------------------
    // [P06-33][GET - /api/codes/file-progress-document-types] 등기 진행 문서 종류 코드 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetFileProgressDocumentTypesResponse>(
      API.CODE.FILE_PROGRESS_DOCUMENT_TYPES
    )
  },

  async fileRegistryTypes() {
    // --------------------------------------------------
    // [P06-34][GET - /api/codes/file-registry-types] 파일 등기 유형 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetFileRegistryTypesResponse>(API.CODE.FILE_REGISTRY_TYPES)
  },

  async fileRequestDocumentTypes() {
    // --------------------------------------------------
    // [P06-35][GET - /api/codes/file-request-document-types] 등기 의뢰 문서 종류 코드 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetFileRequestDocumentTypesResponse>(API.CODE.FILE_REQUEST_DOCUMENT_TYPES)
  },

  async ownershipTypes() {
    // --------------------------------------------------
    // [P06-36][GET - /api/codes/ownership-types] 소유 형태 구분 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetOwnershipTypesResponse>(API.CODE.OWNERSHIP_TYPES)
  },

  async processActions() {
    // --------------------------------------------------
    // [P06-37][GET - /api/codes/process-actions] 등기 진행 단계별 가능한 액션(버튼) 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetProcessActionsResponse>(API.CODE.PROCESS_ACTIONS)
  },

  async propertyBuildTypes() {
    // --------------------------------------------------
    // [P06-38][GET - /api/codes/property-build-types] 부동산 구분(세금신고) 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetPropertyBuildTypesResponse>(API.CODE.PROPERTY_BUILD_TYPES)
  },

  async rpaUserTaskStatuses() {
    // --------------------------------------------------
    // [P06-39][GET - /api/codes/rpa-user-task-statuses] RPA 사용자 PC 작업 상태 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetRpaUserTaskStatusesResponse>(API.CODE.RPA_USER_TASK_STATUSES)
  },

  async rpaUserTaskTypes() {
    // --------------------------------------------------
    // [P06-40][GET - /api/codes/rpa-user-task-types] RPA 사용자 PC 작업 종류 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetRpaUserTaskTypesResponse>(API.CODE.RPA_USER_TASK_TYPES)
  },

  async confirmationDocumentTypes() {
    // --------------------------------------------------
    // [P06-41][GET - /api/codes/confirmation-document-types] 본인확인정보 구분 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetConfirmationDocumentTypesResponse>(
      API.CODE.CONFIRMATION_DOCUMENT_TYPES
    )
  },

  async fileBranchDocumentTypes() {
    // --------------------------------------------------
    // [P06-42][GET - /api/codes/file-branch-document-types] 지점 등록 문서 종류 코드 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetFileBranchDocumentTypesResponse>(API.CODE.FILE_BRANCH_DOCUMENT_TYPES)
  },

  async successCodes() {
    // --------------------------------------------------
    // [P06-43][GET - /api/codes/success-codes] API 성공 코드 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetSuccessCodesResponse>(API.CODE.SUCCESS_CODES)
  },

  async errorCodes() {
    // --------------------------------------------------
    // [P06-44][GET - /api/codes/error-codes] API 오류 코드 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetErrorCodesResponse>(API.CODE.ERROR_CODES)
  },

  async registryTypesForAssign() {
    // --------------------------------------------------
    // [P06-26][GET - /api/codes/registry-types-for-assign] 금융기관 담당(배정) 등기유형 목록 조회
    // --------------------------------------------------
    return apiHelpers.get<GetRegistryTypesForAssignResponse>(API.CODE.REGISTRY_TYPES_FOR_ASSIGN)
  }
}
