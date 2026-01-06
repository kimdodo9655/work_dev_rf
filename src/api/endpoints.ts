/**
 * API 엔드포인트 상수
 * 모든 API 경로를 한 곳에서 관리
 */
export const API = {
  // [A01] 주소/등기소
  ADDRESS: {
    SEARCH: '/api/addresses',
    SUGGESTIONS: '/api/addresses/suggestions',
    REGISTRY_OFFICES: '/api/registry-offices'
  },

  // [P01] 기관
  ORGANIZATION: {
    DETAIL: (organizationId: string | number) => `/api/organizations/${organizationId}`,
    OPTIONS: '/api/organizations/options',
    CHECK_REGISTRATION_NUMBER: '/api/organizations/check-registration-number'
  },

  // [P02A] 지점-기본
  BRANCH: {
    SEARCH: '/api/branches/search',
    DETAIL: (branchId: string | number) => `/api/branches/${branchId}`,
    OPTIONS: '/api/branches/options',
    CHECK_BUSINESS_NUMBER: '/api/branches/check-business-number',
    UPDATE: (branchId: string | number) => `/api/branches/${branchId}`,
    CREATE: '/api/branches'
  },

  // [P02B] 지점-금융기관배정
  BRANCH_BANK: {
    LIST: (branchId: string | number) => `/api/branches/${branchId}/assigned-banks`,
    UPDATE: (branchId: string | number) => `/api/branches/${branchId}/assigned-banks`
  },

  // [P02C] 지점-지급계좌
  BRANCH_PAYMENT: {
    LIST: (branchId: string | number) => `/api/branches/${branchId}/payment-accounts`,
    UPDATE: (branchId: string | number) => `/api/branches/${branchId}/payment-accounts`
  },

  // [P02D] 지점-인터넷등기소
  BRANCH_REGISTRY: {
    LIST: (branchId: string | number) => `/api/branches/${branchId}/registry-credentials`,
    UPDATE: (branchId: string | number) => `/api/branches/${branchId}/registry-credentials`
  },

  // [P02E] 지점-선불지급수단
  BRANCH_PREPAID: {
    LIST: (branchId: string | number) => `/api/branches/${branchId}/prepaid-cards`,
    UPDATE: (branchId: string | number) => `/api/branches/${branchId}/prepaid-cards`
  },

  // [P02F] 지점-문서
  BRANCH_DOCUMENT: {
    LIST: (organizationId: string | number, branchId: string | number) =>
      `/api/organizations/${organizationId}/branches/${branchId}/documents`,
    TEMP_UPLOAD: (organizationId: string | number, branchId: string | number) =>
      `/api/organizations/${organizationId}/branches/${branchId}/documents/temp`,
    SAVE: (organizationId: string | number, branchId: string | number) =>
      `/api/organizations/${organizationId}/branches/${branchId}/documents`,
    DELETE: (organizationId: string | number, branchId: string | number) =>
      `/api/organizations/${organizationId}/branches/${branchId}/documents`,
    DOWNLOAD: (organizationId: string | number, branchId: string | number) =>
      `/api/organizations/${organizationId}/branches/${branchId}/documents/download`,
    DOWNLOAD_BASE64: (organizationId: string | number, branchId: string | number) =>
      `/api/organizations/${organizationId}/branches/${branchId}/documents/download/base64`
  },

  // [P03] 사용자
  USER: {
    PROFILE: '/api/users/profile',
    SEARCH: '/api/users/search',
    DETAIL: (userId: string | number) => `/api/users/${userId}`,
    ASSIGNABLE: '/api/users/assignable',
    ASSIGNED_BANKS: '/api/users/assigned-banks',
    UPDATE: (userId: string | number) => `/api/users/${userId}`,
    CREATE: '/api/users',
    APPROVE: (userId: string | number) => `/api/users/${userId}/approve`,
    EMAIL_VERIFY: (userId: string | number) => `/api/users/${userId}/email-verify`
  },

  // [P04] 인증
  AUTH: {
    SIGNUP: '/api/auth/signup',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    EMAIL_VERIFY_VALIDATE: '/api/auth/email-verify/validate',
    EMAIL_VERIFY: '/api/auth/email-verify',
    PASSWORD: '/api/auth/password'
  },

  // [P05] 금융기관
  BANK: {
    LIST: '/api/banks',
    DETAIL: (code: string) => `/api/banks/${code}`
  },

  // [P06] 공통코드
  CODE: {
    ORGANIZATION_TYPES: '/api/codes/organization-types',
    ORGANIZATION_STATUSES: '/api/codes/organization-statuses',
    QUALIFIED_TYPES: '/api/codes/qualified-types',
    BRANCH_STATUSES: '/api/codes/branch-statuses',
    USER_ROLE_LEVELS: '/api/codes/user-role-levels',
    REGISTRY_TYPES: '/api/codes/registry-types',
    REGISTRY_CAUSES: '/api/codes/registry-causes',
    PARTY_TYPES: '/api/codes/party-types',
    PROPERTY_TYPES: '/api/codes/property-types',
    SECTIONS: '/api/codes/sections',
    REGISTRY_METHODS: '/api/codes/registry-methods',
    SECURED_DEBT_SCOPE_TYPES: '/api/codes/secured-debt-scope-types',
    CERTIFICATE_TYPES: '/api/codes/certificate-types',
    WORK_TYPES: '/api/codes/work-types',
    PAYMENT_STATUSES: '/api/codes/payment-statuses',
    ADMIN_INFO_LINK_TIME: '/api/codes/adminInfo-linkTime'
  },

  // [P07] 알림
  NOTIFICATION: {
    LIST: '/api/notifications',
    CREATE: '/api/notifications',
    READ: (id: string | number) => `/api/notifications/${id}/read`,
    CLEAR_ALL: '/api/notifications/clear-all'
  },

  // [P08] 공지사항
  NOTICE: {
    LIST: '/api/notices'
  },

  // [R00] 등기 테스트 데이터
  REGISTRY_TEST: {
    REQUEST_DATA: '/api/registry/requests/test-data',
    PROGRESS_DATA: '/api/registry/progress/test-data'
  },

  // [R00D] 등기의뢰-문서
  REGISTRY_REQUEST_DOCUMENT: {
    LIST: (requestNumber: string) => `/api/registry/requests/${requestNumber}/documents`,
    UPLOAD: (requestNumber: string) => `/api/registry/requests/${requestNumber}/documents`,
    DOWNLOAD: (requestNumber: string, fileName: string) =>
      `/api/registry/requests/${requestNumber}/documents/${fileName}`,
    DELETE: (requestNumber: string, fileName: string) =>
      `/api/registry/requests/${requestNumber}/documents/${fileName}`,
    DOWNLOAD_BASE64: (requestNumber: string, fileName: string) =>
      `/api/registry/requests/${requestNumber}/documents/${fileName}/base64`
  },

  // [R01] 등기견적
  REGISTRY_ESTIMATE: {
    LIST: '/api/registry/estimates',
    INFO: (estimateId: string | number) => `/api/registry/estimates/${estimateId}/info`,
    DETAILS: (estimateId: string | number) => `/api/registry/estimates/${estimateId}/details`,
    SUBMIT: (registryRequestNumber: string) =>
      `/api/registry/estimates/requests/${registryRequestNumber}/submit`,
    WITHDRAW: (estimateId: string | number) => `/api/registry/estimates/${estimateId}`
  },

  // [R02A] 등기진행-대시보드
  REGISTRY_DASHBOARD: {
    SUMMARY: '/api/registry/progress/summary',
    TODAY: '/api/registry/progress/today',
    ESTIMATE_SUMMARY: '/api/registry/progress/estimates/summary',
    STATISTICS: '/api/registry/progress/statistics'
  },

  // [R02B] 등기진행-기본
  REGISTRY_PROGRESS: {
    LIST: '/api/registry/progress',
    BASIC_INFO: (requestNumber: string) => `/api/registry/progress/${requestNumber}/basic-info`,
    ASSIGN_MANAGER: (requestNumber: string) =>
      `/api/registry/progress/${requestNumber}/assign-manager`,
    LOAN_INFO: (requestNumber: string) => `/api/registry/progress/${requestNumber}/loan-info`
  },

  // [R02C] 등기진행-선순위대출
  REGISTRY_SENIOR_LOAN: {
    LIST: (managementNumber: string) =>
      `/api/registry/progress/${managementNumber}/senior-loan-repayments`
  },

  // [R02D] 등기진행-등기유형
  REGISTRY_APPLICATION: {
    CREATE: (managementNumber: string) => `/api/registry/applications/${managementNumber}`,
    UPDATE: (managementNumber: string) => `/api/registry/applications/${managementNumber}`,
    DELETE: (managementNumber: string) => `/api/registry/applications/${managementNumber}`,
    OWNERSHIP_TRANSFER: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/ownership-transfer`,
    MORTGAGE_INFO: (managementNumber: string) =>
      `/api/registry/applications/mortgages/${managementNumber}/info`,
    LEGAL_AGENT: (managementNumber: string) =>
      `/api/registry/applications/mortgages/${managementNumber}/legal-agent`,
    TABS: (managementNumber: string) => `/api/registry/applications/${managementNumber}/tabs`,
    DOCUMENTS: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/documents`
  },

  // [R02F] 등기진행-부동산
  REGISTRY_PROPERTY: {
    DETAIL: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/properties`,
    REPLACE: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/properties`
  },

  // [R02G] 등기진행-등기권리증
  REGISTRY_CERTIFICATE: {
    DETAIL: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/certificates`,
    REPLACE: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/certificates`
  },

  // [R02J] 등기진행-첨부서면
  REGISTRY_ATTACHMENT: {
    LIST: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/attachments`,
    SAVE: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/attachments`,
    DOWNLOAD: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/attachments/download`,
    PREVIEW: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/attachments/preview`
  },

  // [R02K] 등기진행-변경
  REGISTRY_CHANGE: {
    DETAIL: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/changes`,
    REPLACE: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/changes`
  },

  // [R02L] 등기진행-경정
  REGISTRY_CORRECTION: {
    DETAIL: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/correction`,
    REPLACE: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/correction`
  },

  // [R02N] 등기진행-행정정보동의
  REGISTRY_ADMIN_INFO: {
    LIST: (managementNumber: string) =>
      `/api/registry/progress/${managementNumber}/admin-info-requests`,
    REPLACE: (managementNumber: string) =>
      `/api/registry/progress/${managementNumber}/admin-info-requests`,
    DETAILS: (managementNumber: string) =>
      `/api/registry/progress/${managementNumber}/admin-info-requests/details`
  },

  // [R02S] 등기진행-이전말소권리증
  REGISTRY_TRANSFER_CERTIFICATE: {
    LIST: (managementNumber: string) =>
      `/api/registry/progress/${managementNumber}/transfer-certificates`,
    REPLACE: (managementNumber: string) =>
      `/api/registry/progress/${managementNumber}/transfer-certificates`,
    DETAIL: (managementNumber: string) =>
      `/api/registry/progress/${managementNumber}/transfer-certificates/detail`
  },

  // [R02T] 등기진행-신청사건
  REGISTRY_CASE: {
    LIST: (managementNumber: string) => `/api/registry/progress/${managementNumber}/case-inquiries`,
    REPLACE: (managementNumber: string) =>
      `/api/registry/progress/${managementNumber}/case-inquiries`,
    DETAILS: (managementNumber: string) =>
      `/api/registry/progress/${managementNumber}/case-inquiries/details`
  },

  // [R02U] 등기진행-접수정보
  REGISTRY_RECEIPT: {
    LIST: (managementNumber: string) => `/api/registry/applications/${managementNumber}/receipts`,
    REPLACE: (managementNumber: string) =>
      `/api/registry/applications/${managementNumber}/receipts`,
    DETAIL: (managementNumber: string) =>
      `/api/registry/applications/${managementNumber}/receipts/detail`
  },

  // [R02Y] 등기진행-문서
  REGISTRY_PROGRESS_DOCUMENT: {
    TEMP_UPLOAD: (managementNumber: string) =>
      `/api/registry/progress/${managementNumber}/documents/temp`,
    LIST: (managementNumber: string) => `/api/registry/progress/${managementNumber}/documents`,
    SAVE: (managementNumber: string) => `/api/registry/progress/${managementNumber}/documents`,
    DELETE: (managementNumber: string) => `/api/registry/progress/${managementNumber}/documents`,
    DOWNLOAD: (managementNumber: string) =>
      `/api/registry/progress/${managementNumber}/documents/download`,
    DOWNLOAD_BASE64: (managementNumber: string) =>
      `/api/registry/progress/${managementNumber}/documents/download/base64`,
    DELETE_BY_APPLICATION: (managementNumber: string, applicationId: string | number) =>
      `/api/registry/progress/${managementNumber}/applications/${applicationId}/documents`
  },

  // [R03] 등기일정관리
  REGISTRY_SCHEDULE: {
    LIST: '/api/registry/progress/schedules'
  },

  // [RPAC] RPA 사용자 PC 작업
  RPA: {
    TASK_DETAIL: (taskToken: string) => `/api/registry/rpa/user-tasks/${taskToken}`,
    TASK_RESULT: (taskToken: string) => `/api/registry/rpa/user-tasks/${taskToken}/result`,
    FULL_CERTIFICATE: (managementNumber: string) =>
      `/api/registry/rpa/user-tasks/${managementNumber}/full-certificate`,
    PROPERTY_DESCRIPTION: (managementNumber: string) =>
      `/api/registry/rpa/user-tasks/${managementNumber}/property-description`,
    REGISTRATION_PASSWORD: (managementNumber: string) =>
      `/api/registry/rpa/user-tasks/${managementNumber}/registration-password`,
    ETAX_ACQUISITION: (managementNumber: string) =>
      `/api/registry/rpa/user-tasks/${managementNumber}/etax-acquisition`,
    ETAX_REGISTRATION: (managementNumber: string) =>
      `/api/registry/rpa/user-tasks/${managementNumber}/etax-registration`,
    WETAX_ACQUISITION: (managementNumber: string) =>
      `/api/registry/rpa/user-tasks/${managementNumber}/wetax-acquisition`,
    WETAX_REGISTRATION: (managementNumber: string) =>
      `/api/registry/rpa/user-tasks/${managementNumber}/wetax-registration`,
    REGISTRATION_CASE: (managementNumber: string) =>
      `/api/registry/rpa/user-tasks/${managementNumber}/registration-case`,
    ADMIN_CONSENT: (managementNumber: string) =>
      `/api/registry/rpa/user-tasks/${managementNumber}/admin-consent`,
    REGISTRATION_APPLICATION: (managementNumber: string) =>
      `/api/registry/rpa/user-tasks/${managementNumber}/registration-application`
  },

  // 등기완료문서
  REGISTRY_COMPLETION: {
    LIST: (managementNumber: string) =>
      `/api/registry/progress/${managementNumber}/completion-documents`,
    DETAILS: (managementNumber: string) =>
      `/api/registry/progress/${managementNumber}/completion-documents/details`
  }
} as const
