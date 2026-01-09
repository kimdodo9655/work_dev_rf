/**
 * API 엔드포인트 상수
 * 모든 API 경로 한 곳에서 관리
 */
export const API = {
  // [A01] 주소/등기소
  ADDRESS: {
    SEARCH: '/api/addresses', // [A01-01][GET] 주소 검색
    SUGGESTIONS: '/api/addresses/suggestions', // [A01-02][GET] 주소 자동완성
    REGISTRY_OFFICES: '/api/registry-offices' // [A01-03][GET] 등기소 목록 조회
  },

  // [P01] 기관
  ORGANIZATION: {
    DETAIL: (organizationId: string | number) => `/api/organizations/${organizationId}`, // [P01-01][GET] 기관 상세 조회
    OPTIONS: '/api/organizations/options', // [P01-02][GET] 기관 옵션 목록 조회
    CHECK_REGISTRATION_NUMBER: '/api/organizations/check-registration-number' // [P01-03][GET] 법인등록번호 중복 체크
  },

  // [P02A] 지점-기본
  BRANCH: {
    SEARCH: '/api/branches/search', // [P02A-01][GET] 지점 목록 조회
    DETAIL: (branchId: string | number) => `/api/branches/${branchId}`, // [P02A-02][GET] 지점 상세 조회
    UPDATE: (branchId: string | number) => `/api/branches/${branchId}`, // [P02A-03][PATCH] 지점 수정
    CREATE: '/api/branches', // [P02A-04][POST] 지점 등록
    OPTIONS: '/api/branches/options', // [P02A-05][GET] 지점 옵션 목록 조회
    CHECK_BUSINESS_NUMBER: '/api/branches/check-business-number' // [P02A-06][GET] 사업자등록번호 중복 체크
  },

  // [P02B] 지점-금융기관배정
  BRANCH_BANK: {
    LIST: (branchId: string | number) => `/api/branches/${branchId}/assigned-banks`, // [P02B-01][GET] 배정 금융기관 목록 조회
    UPDATE: (branchId: string | number) => `/api/branches/${branchId}/assigned-banks` // [P02B-02][PATCH] 배정 금융기관 수정
  },

  // [P02C] 지점-지급계좌
  BRANCH_PAYMENT: {
    LIST: (branchId: string | number) => `/api/branches/${branchId}/payment-accounts`, // [P02C-01][GET] 지급계좌 목록 조회
    UPDATE: (branchId: string | number) => `/api/branches/${branchId}/payment-accounts` // [P02C-02][PATCH] 지급계좌 수정
  },

  // [P02D] 지점-인터넷등기소
  BRANCH_REGISTRY: {
    LIST: (branchId: string | number) => `/api/branches/${branchId}/registry-credentials`, // [P02D-01][GET] 인터넷등기소 아이디 목록 조회
    UPDATE: (branchId: string | number) => `/api/branches/${branchId}/registry-credentials` // [P02D-02][PATCH] 인터넷등기소 아이디 수정
  },

  // [P02E] 지점-선불지급수단
  BRANCH_PREPAID: {
    LIST: (branchId: string | number) => `/api/branches/${branchId}/prepaid-cards`, // [P02E-01][GET] 선불지급수단 목록 조회
    UPDATE: (branchId: string | number) => `/api/branches/${branchId}/prepaid-cards` // [P02E-02][PATCH] 선불지급수단 수정
  },

  // [P02F] 지점-문서
  BRANCH_DOCUMENT: {
    TEMP_UPLOAD: (organizationId: string | number, branchId: string | number) =>
      `/api/organizations/${organizationId}/branches/${branchId}/documents/temp`, // [P02F-01][POST] 문서 임시 업로드
    LIST: (organizationId: string | number, branchId: string | number) =>
      `/api/organizations/${organizationId}/branches/${branchId}/documents`, // [P02F-02][GET] 문서 목록 조회
    SAVE: (organizationId: string | number, branchId: string | number) =>
      `/api/organizations/${organizationId}/branches/${branchId}/documents`, // [P02F-03][POST] 문서 저장
    DELETE: (organizationId: string | number, branchId: string | number) =>
      `/api/organizations/${organizationId}/branches/${branchId}/documents`, // [P02F-04][DELETE] 문서 삭제
    DOWNLOAD: (organizationId: string | number, branchId: string | number) =>
      `/api/organizations/${organizationId}/branches/${branchId}/documents/download`, // [P02F-05][GET] 문서 다운로드
    DOWNLOAD_BASE64: (organizationId: string | number, branchId: string | number) =>
      `/api/organizations/${organizationId}/branches/${branchId}/documents/download/base64` // [P02F-06][GET] 문서 Base64 다운로드
  },

  // [P03] 사용자
  USER: {
    PROFILE: '/api/users/profile', // [P03-01][GET] 내 정보 조회
    SEARCH: '/api/users/search', // [P03-02][GET] 사용자 목록 조회
    DETAIL: (userId: string | number) => `/api/users/${userId}`, // [P03-03][GET] 사용자 상세 조회
    UPDATE: (userId: string | number) => `/api/users/${userId}`, // [P03-04][PATCH] 사용자 수정
    CREATE: '/api/users', // [P03-05][POST] 사용자 등록
    APPROVE: (userId: string | number) => `/api/users/${userId}/approve`, // [P03-06][POST] 사용자 승인
    EMAIL_VERIFY: (userId: string | number) => `/api/users/${userId}/email-verify`, // [P03-07][POST] 이메일 인증 완료
    ASSIGNABLE: '/api/users/assignable', // [P03-08][GET] 업무배정 가능 담당자 목록 조회
    ASSIGNED_BANKS: '/api/users/assigned-banks', // [P03-09][GET] 담당 금융기관 목록 조회
    CHECK_LOGIN_ID: '/api/users/check-login-id', // [P03-10][GET] 사용자 아이디 중복 확인
    CHECK_EMAIL: '/api/users/check-email', // [P03-11][GET] 사용자 이메일 중복 확인
    UPDATE_PROFILE: '/api/users/profile' // [P03-12][PATCH] 내 정보 수정
  },

  // [P04] 인증
  AUTH: {
    SIGNUP: '/api/auth/signup', // [P04-01][POST] 회원가입
    LOGIN: '/api/auth/login', // [P04-02][POST] 로그인
    LOGOUT: '/api/auth/logout', // [P04-03][POST] 로그아웃
    REFRESH: '/api/auth/refresh', // [P04-04][POST] 토큰 갱신
    EMAIL_VERIFY_VALIDATE: '/api/auth/email-verify/validate', // [P04-05][POST] 이메일 토큰 검증
    EMAIL_VERIFY: '/api/auth/email-verify', // [P04-06][POST] 이메일 인증 완료
    PASSWORD: '/api/auth/password' // [P04-07][POST] 비밀번호 설정
  },

  // [P05] 금융기관
  BANK: {
    LIST: '/api/banks', // [P05-01][GET] 금융기관 목록 조회
    DETAIL: (code: string) => `/api/banks/${code}` // [P05-02][GET] 금융기관 상세 조회
  },

  // [P06] 공통코드
  CODE: {
    ORGANIZATION_TYPES: '/api/codes/organization-types', // [P06-01][GET] 기관 구분 목록 조회
    ORGANIZATION_STATUSES: '/api/codes/organization-statuses', // [P06-02][GET] 기관 상태 목록 조회
    QUALIFIED_TYPES: '/api/codes/qualified-types', // [P06-03][GET] 자격자 구분 목록 조회
    BRANCH_STATUSES: '/api/codes/branch-statuses', // [P06-04][GET] 지점 상태 목록 조회
    USER_ROLE_LEVELS: '/api/codes/user-role-levels', // [P06-05][GET] 사용자 권한 레벨 목록 조회
    REGISTRY_TYPES: '/api/codes/registry-types', // [P06-06][GET] 등기 유형 목록 조회
    REGISTRY_CAUSES: '/api/codes/registry-causes', // [P06-07][GET] 등기 원인 목록 조회
    PARTY_TYPES: '/api/codes/party-types', // [P06-08][GET] 당사자 구분 목록 조회
    PROPERTY_TYPES: '/api/codes/property-types', // [P06-09][GET] 부동산 구분 목록 조회
    SECTIONS: '/api/codes/sections', // [P06-10][GET] 구분 목록 조회
    REGISTRY_METHODS: '/api/codes/registry-methods', // [P06-11][GET] 등기 방법 목록 조회
    SECURED_DEBT_SCOPE_TYPES: '/api/codes/secured-debt-scope-types', // [P06-12][GET] 채권최고액 범위 구분 목록 조회
    CERTIFICATE_TYPES: '/api/codes/certificate-types', // [P06-13][GET] 증명서 구분 목록 조회
    WORK_TYPES: '/api/codes/work-types', // [P06-14][GET] 업무 구분 목록 조회
    PAYMENT_STATUSES: '/api/codes/payment-statuses', // [P06-15][GET] 지급 상태 목록 조회
    ADMIN_INFO_LINK_TIME: '/api/codes/adminInfo-linkTime', // [P06-16][GET] 행정정보 연계 시점 목록 조회
    USER_STATUSES: '/api/codes/user-statuses' // [P06-17][GET] 사용자 상태 목록 조회
  },

  // [P07] 알림
  NOTIFICATION: {
    LIST: '/api/notifications', // [P07-01][GET] 알림 목록 조회
    CREATE: '/api/notifications', // [P07-02][POST] 알림 등록
    READ: (id: string | number) => `/api/notifications/${id}/read`, // [P07-03][PATCH] 알림 읽음 처리
    CLEAR_ALL: '/api/notifications/clear-all' // [P07-04][DELETE] 알림 모두지우기 처리
  },

  // [P08] 공지사항
  NOTICE: {
    LIST: '/api/notices' // [P08-01][GET] 공지사항 목록 조회
  },

  // [R00] 등기 테스트 데이터
  REGISTRY_TEST: {
    REQUEST_DATA: '/api/registry/requests/test-data', // [R00-01][POST] 등기의뢰 테스트 데이터 생성
    PROGRESS_DATA: '/api/registry/progress/test-data' // [R00-02][POST] 등기진행 테스트 데이터 생성
  },

  // [R00D] 등기의뢰-문서
  REGISTRY_REQUEST_DOCUMENT: {
    LIST: (requestNumber: string) => `/api/registry/requests/${requestNumber}/documents`, // [R00D-01][GET] 문서 목록 조회
    UPLOAD: (requestNumber: string) => `/api/registry/requests/${requestNumber}/documents`, // [R00D-02][POST] 문서 업로드
    DOWNLOAD: (requestNumber: string, fileName: string) =>
      `/api/registry/requests/${requestNumber}/documents/${fileName}`, // [R00D-03][GET] 문서 다운로드
    DELETE: (requestNumber: string, fileName: string) =>
      `/api/registry/requests/${requestNumber}/documents/${fileName}`, // [R00D-04][DELETE] 문서 삭제
    DOWNLOAD_BASE64: (requestNumber: string, fileName: string) =>
      `/api/registry/requests/${requestNumber}/documents/${fileName}/base64` // [R00D-05][GET] 문서 Base64 다운로드
  },

  // [R01] 등기견적
  REGISTRY_ESTIMATE: {
    LIST: '/api/registry/estimates', // [R01-01][GET] 견적 목록 조회
    INFO: (estimateId: string | number) => `/api/registry/estimates/${estimateId}/info`, // [R01-02][GET] 견적 기본 조회
    DETAILS: (estimateId: string | number) => `/api/registry/estimates/${estimateId}/details`, // [R01-03][GET] 견적서 상세 조회
    SUBMIT: (registryRequestNumber: string) =>
      `/api/registry/estimates/requests/${registryRequestNumber}/submit`, // [R01-04][POST] 견적서 제출
    WITHDRAW: (estimateId: string | number) => `/api/registry/estimates/${estimateId}` // [R01-05][DELETE] 견적서 철회
  },

  // [R02A] 등기진행-대시보드
  REGISTRY_DASHBOARD: {
    SUMMARY: '/api/registry/progress/summary', // [R02A-01][GET] 나의 진행현황 조회
    TODAY: '/api/registry/progress/today', // [R02A-02][GET] 오늘의 접수사건 조회
    ESTIMATE_SUMMARY: '/api/registry/progress/estimates/summary', // [R02A-03][GET] 견적현황 요약 조회
    STATISTICS: '/api/registry/progress/statistics' // [R02A-04][GET] 진행 상태별 업무현황 조회
  },

  // [R02B] 등기진행-기본
  REGISTRY_PROGRESS: {
    LIST: '/api/registry/progress', // [R02B-01][GET] 진행현황 목록 조회
    BASIC_INFO: (requestNumber: string) => `/api/registry/progress/${requestNumber}/basic-info`, // [R02B-02][GET] 업무 기본정보 조회
    ASSIGN_MANAGER: (requestNumber: string) =>
      `/api/registry/progress/${requestNumber}/assign-manager`, // [R02B-03][PATCH] 업무담당자 배정
    LOAN_INFO: (requestNumber: string) => `/api/registry/progress/${requestNumber}/loan-info` // [R02B-04][GET] 대출 금융기관 정보 조회
  },

  // [R02C] 등기진행-선순위대출
  REGISTRY_SENIOR_LOAN: {
    LIST: (managementNumber: string) =>
      `/api/registry/progress/${managementNumber}/senior-loan-repayments` // [R02C-01][GET] 선순위대출상환 정보 조회
  },

  // [R02D] 등기진행-등기유형
  REGISTRY_APPLICATION: {
    CREATE: (managementNumber: string) => `/api/registry/applications/${managementNumber}`, // [R02D-02][POST] 등기유형 추가
    DELETE: (managementNumber: string) => `/api/registry/applications/${managementNumber}`, // [R02D-03][DELETE] 등기유형 삭제
    UPDATE: (managementNumber: string) => `/api/registry/applications/${managementNumber}`, // [R02D-04][PATCH] 등기유형 수정
    OWNERSHIP_TRANSFER: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/ownership-transfer`, // [R02D-05][GET] 소유권이전 조회
    MORTGAGE_INFO: (managementNumber: string) =>
      `/api/registry/applications/mortgages/${managementNumber}/info`, // [R02D-06][GET] 근저당권설정 조회
    LEGAL_AGENT: (managementNumber: string) =>
      `/api/registry/applications/mortgages/${managementNumber}/legal-agent`, // [R02D-07][GET] 등기유형별 법무대리인 조회
    TABS: (managementNumber: string) => `/api/registry/applications/${managementNumber}/tabs`, // [R02D-08][GET] 등기신청서 양식 목록 조회
    DOCUMENTS: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/documents` // [R02D-09][GET] 등기신청서 전자문서 조회
  },

  // [R02E] 등기진행-계약정보
  REGISTRY_CONTRACT: {
    PARTIES_DETAIL: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/contracts/parties`, // [R02E-01][GET] 계약당사자 상세 조회
    PARTIES_REPLACE: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/contracts/parties`, // [R02E-02][PUT] 계약당사자 일괄 저장
    OWNERSHIP_DETAIL: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/contracts/ownership`, // [R02E-03][GET] 소유권이전 계약정보 조회
    OWNERSHIP_SAVE: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/contracts/ownership`, // [R02E-04][PUT] 소유권이전 계약정보 저장
    MORTGAGE_DETAIL: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/contracts/mortgage`, // [R02E-05][GET] 근저당권설정 계약정보 조회
    MORTGAGE_SAVE: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/contracts/mortgage`, // [R02E-06][PUT] 근저당권설정 계약정보 저장
    SURFACE_RIGHT_DETAIL: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/contracts/surface-right`, // [R02E-07][GET] 지상권설정 계약정보 조회
    SURFACE_RIGHT_SAVE: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/contracts/surface-right` // [R02E-08][PUT] 지상권설정 계약정보 저장
  },

  // [R02F] 등기진행-부동산
  REGISTRY_PROPERTY: {
    DETAIL: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/properties`, // [R02F-01][GET] 부동산 상세 조회
    REPLACE: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/properties` // [R02F-02][PUT] 부동산 대체
  },

  // [R02G] 등기진행-등기권리증
  REGISTRY_CERTIFICATE: {
    DETAIL: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/certificates`, // [R02G-01][GET] 등기권리증 상세 조회
    REPLACE: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/certificates` // [R02G-02][PUT] 등기권리증 대체
  },

  // [R02J] 등기진행-첨부서면
  REGISTRY_ATTACHMENT: {
    LIST: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/attachments`, // [R02J-01][GET] 첨부서면 목록 조회
    SAVE: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/attachments`, // [R02J-02][PUT] 첨부서면 저장
    DOWNLOAD: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/attachments/download`, // [R02J-03][GET] 첨부서면 다운로드
    PREVIEW: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/attachments/preview` // [R02J-04][GET] 첨부서면 Base64 다운로드
  },

  // [R02K] 등기진행-변경
  REGISTRY_CHANGE: {
    DETAIL: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/changes`, // [R02K-01][GET] 등기명의인표시변경 상세 조회
    REPLACE: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/changes` // [R02K-02][PUT] 등기명의인표시변경 대체
  },

  // [R02L] 등기진행-경정
  REGISTRY_CORRECTION: {
    DETAIL: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/correction`, // [R02L-01][GET] 등기명의인표시경정 상세 조회
    REPLACE: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/correction` // [R02L-02][PUT] 등기명의인표시경정 대체
  },

  // [R02N] 등기진행-행정정보동의
  REGISTRY_ADMIN_INFO: {
    LIST: (managementNumber: string) =>
      `/api/registry/progress/${managementNumber}/admin-info-requests`, // [R02N-01][GET] 행정정보사전동의서 목록 조회
    REPLACE: (managementNumber: string) =>
      `/api/registry/progress/${managementNumber}/admin-info-requests`, // [R02N-02][PUT] 행정정보사전동의서 대체
    DETAILS: (managementNumber: string) =>
      `/api/registry/progress/${managementNumber}/admin-info-requests/details` // [R02N-03][GET] 행정정보사전동의서 상세 조회
  },

  // [R02S] 등기진행-이전말소권리증
  REGISTRY_TRANSFER_CERTIFICATE: {
    LIST: (managementNumber: string) =>
      `/api/registry/progress/${managementNumber}/transfer-certificates`, // [R02S-01][GET] 이전/말소등기권리증 목록 조회
    REPLACE: (managementNumber: string) =>
      `/api/registry/progress/${managementNumber}/transfer-certificates`, // [R02S-02][PUT] 이전/말소등기권리증 대체
    DETAIL: (managementNumber: string) =>
      `/api/registry/progress/${managementNumber}/transfer-certificates/detail` // [R02S-03][GET] 이전/말소등기권리증 상세 조회
  },

  // [R02T] 등기진행-신청사건
  REGISTRY_CASE: {
    LIST: (managementNumber: string) => `/api/registry/progress/${managementNumber}/case-inquiries`, // [R02T-01][GET] 신청사건 목록 조회
    REPLACE: (managementNumber: string) =>
      `/api/registry/progress/${managementNumber}/case-inquiries`, // [R02T-02][PUT] 신청사건 대체
    DETAILS: (managementNumber: string) =>
      `/api/registry/progress/${managementNumber}/case-inquiries/details` // [R02T-03][GET] 신청사건 상세 조회
  },

  // [R02U] 등기진행-접수정보
  REGISTRY_RECEIPT: {
    LIST: (managementNumber: string) => `/api/registry/applications/${managementNumber}/receipts`, // [R02U-01][GET] 등기접수 목록 조회
    REPLACE: (managementNumber: string) =>
      `/api/registry/applications/${managementNumber}/receipts`, // [R02U-02][PUT] 등기접수 대체
    DETAIL: (managementNumber: string) =>
      `/api/registry/applications/${managementNumber}/receipts/detail` // [R02U-03][GET] 등기접수 상세 조회
  },

  // [R02X] 등기진행-완료문서
  REGISTRY_COMPLETION: {
    LIST: (managementNumber: string) =>
      `/api/registry/progress/${managementNumber}/completion-documents`, // [R02X-01][GET] 등기완료 문서 목록 조회
    DETAILS: (managementNumber: string) =>
      `/api/registry/progress/${managementNumber}/completion-documents/details` // [R02X-02][GET] 등기완료 문서 상세 조회
  },

  // [R02Y] 등기진행-문서
  REGISTRY_PROGRESS_DOCUMENT: {
    TEMP_UPLOAD: (managementNumber: string) =>
      `/api/registry/progress/${managementNumber}/documents/temp`, // [R02Y-01][POST] 문서 임시 업로드
    LIST: (managementNumber: string) => `/api/registry/progress/${managementNumber}/documents`, // [R02Y-02][GET] 문서 목록 조회
    SAVE: (managementNumber: string) => `/api/registry/progress/${managementNumber}/documents`, // [R02Y-03][POST] 문서 저장
    DELETE: (managementNumber: string) => `/api/registry/progress/${managementNumber}/documents`, // [R02Y-04][DELETE] 문서 삭제
    DOWNLOAD: (managementNumber: string) =>
      `/api/registry/progress/${managementNumber}/documents/download`, // [R02Y-05][GET] 문서 다운로드
    DOWNLOAD_BASE64: (managementNumber: string) =>
      `/api/registry/progress/${managementNumber}/documents/download/base64`, // [R02Y-06][GET] 문서 Base64 다운로드
    DELETE_BY_APPLICATION: (managementNumber: string, applicationId: string | number) =>
      `/api/registry/progress/${managementNumber}/applications/${applicationId}/documents` // [R02Y-07][DELETE] 신청번호 기준 문서 삭제
  },

  // [R03] 등기일정관리
  REGISTRY_SCHEDULE: {
    LIST: '/api/registry/progress/schedules' // [R03-01][GET] 등기일정 목록 조회
  },

  // [RPAC] RPA 사용자 PC 작업
  RPA: {
    FULL_CERTIFICATE: (managementNumber: string) =>
      `/api/registry/rpa/user-tasks/${managementNumber}/full-certificate`, // [RPAC-01][POST] 등기사항전부증명서 열람/발급 작업 등록
    PROPERTY_DESCRIPTION: (managementNumber: string) =>
      `/api/registry/rpa/user-tasks/${managementNumber}/property-description`, // [RPAC-02][POST] 부동산의표시 생성 작업 등록
    REGISTRATION_PASSWORD: (managementNumber: string) =>
      `/api/registry/rpa/user-tasks/${managementNumber}/registration-password`, // [RPAC-03][POST] 등기필정보 비밀번호 조회 작업 등록
    ETAX_ACQUISITION: (managementNumber: string) =>
      `/api/registry/rpa/user-tasks/${managementNumber}/etax-acquisition`, // [RPAC-04][POST] 이택스 취득세 작업 등록
    ETAX_REGISTRATION: (managementNumber: string) =>
      `/api/registry/rpa/user-tasks/${managementNumber}/etax-registration`, // [RPAC-05][POST] 이택스 등록면허세 작업 등록
    WETAX_ACQUISITION: (managementNumber: string) =>
      `/api/registry/rpa/user-tasks/${managementNumber}/wetax-acquisition`, // [RPAC-06][POST] 위택스 취득세 작업 등록
    WETAX_REGISTRATION: (managementNumber: string) =>
      `/api/registry/rpa/user-tasks/${managementNumber}/wetax-registration`, // [RPAC-07][POST] 위택스 등록면허세 작업 등록
    REGISTRATION_CASE: (managementNumber: string) =>
      `/api/registry/rpa/user-tasks/${managementNumber}/registration-case`, // [RPAC-08][POST] 등기 신청사건 조회 작업 등록
    ADMIN_CONSENT: (managementNumber: string) =>
      `/api/registry/rpa/user-tasks/${managementNumber}/admin-consent`, // [RPAC-09][POST] 행정정보 동의요청 작업 등록
    REGISTRATION_APPLICATION: (managementNumber: string) =>
      `/api/registry/rpa/user-tasks/${managementNumber}/registration-application`, // [RPAC-10][POST] 등기신청서 작성 작업 등록
    TASK_DETAIL: (taskToken: string) => `/api/registry/rpa/user-tasks/${taskToken}`, // [RPAC-11][GET] RPA 작업 조회
    TASK_RESULT: (taskToken: string) => `/api/registry/rpa/user-tasks/${taskToken}/result` // [RPAC-12][PATCH] RPA 작업 결과 전달
  }
} as const
