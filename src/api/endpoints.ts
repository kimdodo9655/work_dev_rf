/**
 * API 엔드포인트 상수
 * 모든 API 경로를 한 곳에서 관리
 *
 * @generated 2025-01-27
 * @total 200개 엔드포인트
 * @categories 43개
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
    DETAIL: (code: string | number) => `/api/banks/${code}` // [P05-02][GET] 금융기관 상세 조회
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
    REGISTRY_METHODS: '/api/codes/registry-methods', // [P06-11][GET] 등기 방식 목록 조회
    SECURED_DEBT_SCOPE_TYPES: '/api/codes/secured-debt-scope-types', // [P06-12][GET] 채권최고액 범위 구분 목록 조회
    CERTIFICATE_TYPES: '/api/codes/certificate-types', // [P06-13][GET] 증명서 구분 목록 조회
    WORK_TYPES: '/api/codes/work-types', // [P06-14][GET] 업무 구분 목록 조회
    PAYMENT_STATUSES: '/api/codes/payment-statuses', // [P06-15][GET] 지급 상태 목록 조회
    ADMIN_INFO_LINK_TIME: '/api/codes/adminInfo-linkTime', // [P06-16][GET] 행정정보 연계 시점 목록 조회
    USER_STATUSES: '/api/codes/user-statuses', // [P06-17][GET] 사용자 상태 목록 조회
    ASSIGNMENT_WORKS: '/api/codes/assigned-works', // [P06-18][GET] 배정 업무 목록 조회
    PROGRESS_STATUSES: '/api/codes/progress-statuses', // [P06-19][GET] 진행 상태 목록 조회
    QUOTE_PROGRESS_STATUSES: '/api/codes/quote-progress-statuses', // [P06-20][GET] 등기 견적 진행 상태 목록 조회
    ESTIMATE_WRITING_STATUSES: '/api/codes/estimate-writing-statuses', // [P06-21][GET] 등기 견적 작성 여부 목록 조회
    ESTIMATE_SELECTION_STATUSES: '/api/codes/estimate-selection-statuses', // [P06-22][GET] 등기 견적 선정 상태 목록 조회
    PROGRESS_TYPES: '/api/codes/progress-types', // [P06-23][GET] 등기 진행 유형 목록 조회
    PARTY_ROLES: '/api/codes/party-roles', // [P06-24][GET] 당사자 구분 목록 조회
    PARTY_ROLES_FOR_REQUEST: '/api/codes/party-roles-for-request', // [P06-25][GET] 당사자 구분 (등기의뢰 계약당사자) 목록 조회
    REGISTRY_TYPES_FOR_ASSIGN: '/api/codes/registry-types-for-assign' // [P06-26][GET] 금융기관 담당(배정) 등기유형 목록 조회
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
    CREATE_REQUEST: '/api/registry/requests/test-data', // [R00-01][POST] 등기의뢰 테스트 데이터 생성
    CREATE_PROGRESS: '/api/registry/progress/test-data', // [R00-02][POST] 등기진행 테스트 데이터 생성
    GENERATE: '/api/registry/scheduler/test-data/generate', // [R00-03][POST] 등기 테스트 데이터 스케쥴러 수동 실행
    GENERATE_MISSING_PROGRESS: '/api/registry/scheduler/test-data/generate-missing-progress', // [R00-04][POST] 누락된 등기 진행 데이터 생성 스케쥴러 수동 실행
    ASSIGN_MANAGERS: '/api/registry/scheduler/test-data/assign-managers' // [R00-05][POST] 등기 담당자 배정 스케쥴러 수동 실행
  },

  // [R00D] 등기의뢰-문서
  REGISTRY_REQUEST_DOCUMENT: {
    LIST: (requestNumber: string | number) => `/api/registry/requests/${requestNumber}/documents`, // [R00D-01][GET] 문서 목록 조회
    UPLOAD: (requestNumber: string | number) => `/api/registry/requests/${requestNumber}/documents`, // [R00D-02][POST] 문서 업로드
    DOWNLOAD: (requestNumber: string | number, fileName: string | number) =>
      `/api/registry/requests/${requestNumber}/documents/${fileName}`, // [R00D-03][GET] 문서 다운로드
    DELETE: (requestNumber: string | number, fileName: string | number) =>
      `/api/registry/requests/${requestNumber}/documents/${fileName}`, // [R00D-04][DELETE] 문서 삭제
    DOWNLOAD_BASE64: (requestNumber: string | number, fileName: string | number) =>
      `/api/registry/requests/${requestNumber}/documents/${fileName}/base64` // [R00D-05][GET] 문서 Base64 다운로드
  },

  // [R01] 등기견적
  REGISTRY_QUOTE: {
    LIST: '/api/registry/estimates', // [R01-01][GET] 견적 목록 조회
    DETAIL: (registryRequestNumber: string | number) =>
      `/api/registry/estimates/requests/${registryRequestNumber}/info`, // [R01-02][GET] 등기의뢰 견적 대상 기본 정보 조회
    ACCEPT: (estimateId: string | number) => `/api/registry/estimates/${estimateId}/details`, // [R01-03][GET] 견적서 상세 조회
    REJECT: (registryRequestNumber: string | number) =>
      `/api/registry/estimates/requests/${registryRequestNumber}/submit`, // [R01-04][POST] 견적서 제출
    ESTIMATES: (estimateId: string | number) => `/api/registry/estimates/${estimateId}` // [R01-05][DELETE] 견적서 철회
  },

  // [R02A] 등기진행-대시보드
  REGISTRY_DASHBOARD: {
    SUMMARY: '/api/registry/progress/summary', // [R02A-01][GET] 나의 진행현황 조회
    TODAY: '/api/registry/progress/today', // [R02A-02][GET] 오늘의 접수사건 조회
    SUMMARY_2: '/api/registry/progress/estimates/summary', // [R02A-03][GET] 견적현황 요약 조회
    STATISTICS: '/api/registry/progress/statistics' // [R02A-04][GET] 진행 상태별 업무현황 조회
  },

  // [R02B] 등기진행-기본
  REGISTRY_PROGRESS: {
    LIST: '/api/registry/progress', // [R02B-01][GET] 진행현황 목록 조회
    BASIC_INFO: (registryManagementNumber: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/basic-info`, // [R02B-02][GET] 업무 기본 정보 조회
    ASSIGN_MANAGER: (registryManagementNumber: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/assign-manager`, // [R02B-03][PATCH] 업무담당자 배정
    LOAN_INFO: (registryManagementNumber: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/loan-info`, // [R02B-04][GET] 대출 금융기관 정보 조회
    OWNERSHIP_TRANSFER: (registryManagementNumber: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/ownership-transfer`, // [R02B-05][GET] 소유권 이전 정보 조회
    MORTGAGE: (registryManagementNumber: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/mortgage`, // [R02B-06][GET] 근저당권 설정 정보 조회
    LEGAL_AGENT: (registryManagementNumber: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/legal-agent`, // [R02B-07][GET] 법무대리인 정보 조회
    PROCESS: (registryManagementNumber: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/process` // [R02B-08][GET] 등기진행 업무 프로세스 조회
  },

  // [R02C] 등기진행-선순위대출
  REGISTRY_PRIOR_LOAN: {
    SENIOR_LOAN_REPAYMENTS: (registryManagementNumber: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/senior-loan-repayments` // [R02C-01][GET] 선순위대출상환 정보 조회
  },

  // [R02D] 등기진행-등기유형
  REGISTRY_TYPE: {
    APPLICATIONS: '/api/registry/applications', // [R02D-02][POST] 등기유형(등기신청서) 추가
    DELETE: (applicationId: string | number) => `/api/registry/applications/${applicationId}`, // [R02D-03][DELETE] 등기유형(등기신청서) 삭제
    UPDATE: (applicationId: string | number) => `/api/registry/applications/${applicationId}`, // [R02D-04][PATCH] 등기유형(등기신청서) 수정
    LIST: '/api/registry/applications/tabs', // [R02D-08][GET] 등기신청서 양식 목록 조회
    DOCUMENTS: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/documents` // [R02D-09][GET] 등기신청서 전자문서 조회
  },

  // [R02E] 등기진행-계약정보
  REGISTRY_CONTRACT: {
    DETAIL: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/contracts/parties`, // [R02E-01][GET] 계약당사자 상세 조회
    SAVE: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/contracts/parties`, // [R02E-02][PUT] 계약당사자 일괄 저장
    OWNERSHIP: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/contracts/ownership`, // [R02E-03][GET] 소유권이전 계약정보 조회
    SAVE_2: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/contracts/ownership`, // [R02E-04][PUT] 소유권이전 계약정보 저장
    MORTGAGE: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/contracts/mortgage`, // [R02E-05][GET] 근저당권설정 계약정보 조회
    SAVE_3: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/contracts/mortgage`, // [R02E-06][PUT] 근저당권설정 계약정보 저장
    SURFACE_RIGHT: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/contracts/surface-right`, // [R02E-07][GET] 지상권설정 계약정보 조회
    SAVE_4: (applicationId: string | number) =>
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

  // [R02H] 등기진행-채권및세금
  REGISTRY_DEBT_TAX: {
    DETAIL: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/mortgage/financial`, // [R02H-01][GET] 채권및세금 상세 조회
    REPLACE: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/mortgage/financial` // [R02H-02][POST] 채권및세금 대체
  },

  // [R02I] 등기진행-세금
  REGISTRY_TAX: {
    DETAIL: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/ownership/tax/detail`, // [R02I-01][GET] 세금 상세 조회
    UPDATE: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/ownership/tax` // [R02I-02][POST] 세금 수정
  },

  // [R02J] 등기진행-첨부서면
  REGISTRY_ATTACHMENT: {
    DETAIL: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/attachments`, // [R02J-01][GET] 첨부서면 상세 조회
    SAVE: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/attachments`, // [R02J-02][PUT] 첨부서면 저장
    DOWNLOAD: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/attachments/download`, // [R02J-03][GET] 첨부서면 다운로드
    PREVIEW: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/attachments/preview` // [R02J-04][GET] 첨부서면 Base64 다운로드
  },

  // [R02K] 등기진행-변경사항
  REGISTRY_CHANGE: {
    DETAIL: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/changes`, // [R02K-01][GET] 등기명의인표시변경 상세 조회
    REPLACE: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/changes` // [R02K-02][PUT] 등기명의인표시변경 대체
  },

  // [R02L] 등기진행-경정사항
  REGISTRY_CORRECTION: {
    DETAIL: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/correction`, // [R02L-01][GET] 등기명의인표시경정 상세 조회
    REPLACE: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/correction` // [R02L-02][PUT] 등기명의인표시경정 대체
  },

  // [R02M] 등기진행-말소사항
  REGISTRY_CANCELLATION: {
    DETAIL: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/cancellations`, // [R02M-01][GET] 말소사항 상세 조회
    REPLACE: (applicationId: string | number) =>
      `/api/registry/applications/${applicationId}/cancellations` // [R02M-02][PUT] 말소사항 대체
  },

  // [R02N] 등기진행-행정정보동의
  REGISTRY_ADMIN_CONSENT: {
    LIST: (registryManagementNumber: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/admin-info-requests/list`, // [R02N-01][GET] 행정정보사전동의서 목록 조회
    UPDATE: (registryManagementNumber: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/admin-info-requests`, // [R02N-02][PATCH] 행정정보사전동의서 수정
    DETAIL: (registryManagementNumber: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/admin-info-requests/detail` // [R02N-03][GET] 행정정보사전동의서 상세 조회
  },

  // [R02O] 등기진행-전자서명
  REGISTRY_SIGNATURE: {
    DETAIL: (registryManagementNumber: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/e-signatures/detail`, // [R02O-01][GET] 전자서명 진행 정보 조회
    REQUEST: (registryManagementNumber: string | number, eSignatureId: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/e-signatures/${eSignatureId}/request`, // [R02O-02][POST] 전자서명 요청
    COMPLETE: (registryManagementNumber: string | number, eSignatureId: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/e-signatures/${eSignatureId}/complete`, // [R02O-03][POST] 전자서명 완료
    RE_REQUEST: (registryManagementNumber: string | number, eSignatureId: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/e-signatures/${eSignatureId}/re-request`, // [R02O-04][POST] 전자서명 재요청
    LIST: (registryManagementNumber: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/e-signatures/list` // [R02O-05][GET] 전자서명 진행 정보 목록 조회
  },

  // [R02P] 등기진행-세금신고대행
  REGISTRY_TAX_REPORT: {
    DETAIL: (registryManagementNumber: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/tax-agencies/detail`, // [R02P-01][GET] 세금신고 대행 상세 조회
    LIST: (registryManagementNumber: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/tax-agencies/list`, // [R02P-02][GET] 세금신고 대행 목록 조회
    LIST_2: (registryManagementNumber: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/tax-agencies` // [R02P-03][PUT] 세금신고 대행 목록 대체
  },

  // [R02Q] 등기진행-국민주택채권
  REGISTRY_HOUSING_BOND: {
    DETAIL: (registryManagementNumber: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/housing-bonds/detail`, // [R02Q-01][GET] 국민주택채권 상세 조회
    DETAIL_2: (registryManagementNumber: string | number, registryType: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/housing-bonds/${registryType}` // [R02Q-02][PUT] 국민주택채권 상세 저장
  },

  // [R02R] 등기진행-대출금지급계좌
  REGISTRY_LOAN_ACCOUNT: {
    DETAIL: (registryManagementNumber: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/loan-payment-accounts/detail`, // [R02R-01][GET] 대출금 지급계좌 조회
    LIST: (registryManagementNumber: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/loan-payment-accounts/list`, // [R02R-02][GET] 대출금 지급계좌 등록 목록 조회
    SAVE: (registryManagementNumber: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/loan-payment-accounts`, // [R02R-03][PUT] 대출금 지급계좌 일괄 저장
    UPLOAD: (registryManagementNumber: string | number, loanPaymentAccountId: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/loan-payment-accounts/${loanPaymentAccountId}/receipt`, // [R02R-04][POST] 상환영수증 업로드
    DELETE: (registryManagementNumber: string | number, loanPaymentAccountId: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/loan-payment-accounts/${loanPaymentAccountId}/receipt`, // [R02R-05][DELETE] 상환영수증 삭제
    DOWNLOAD: (registryManagementNumber: string | number, loanPaymentAccountId: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/loan-payment-accounts/${loanPaymentAccountId}/receipt` // [R02R-06][GET] 상환영수증 다운로드
  },

  // [R02S] 등기진행-이전/말소권리증
  REGISTRY_TRANSFER_CERTIFICATE: {
    LIST: (registryManagementNumber: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/transfer-cancellation-certificates`, // [R02S-01][GET] 이전/말소등기권리증 목록 조회
    REPLACE: (registryManagementNumber: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/transfer-cancellation-certificates`, // [R02S-02][PUT] 이전/말소등기권리증 대체
    DETAIL: (registryManagementNumber: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/transfer-cancellation-certificates/detail` // [R02S-03][GET] 이전/말소등기권리증 상세 조회
  },

  // [R02T] 등기진행-신청사건
  REGISTRY_CASE: {
    LIST: (registryManagementNumber: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/case-inquiries/list`, // [R02T-01][GET] 신청사건 목록 조회
    UPDATE: (registryManagementNumber: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/case-inquiries`, // [R02T-02][PATCH] 신청사건 수정
    DETAIL: (registryManagementNumber: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/case-inquiries/detail` // [R02T-03][GET] 신청사건 상세 조회
  },

  // [R02U] 등기진행-접수정보
  REGISTRY_RECEIPT: {
    LIST: (registryManagementNumber: string | number) =>
      `/api/registry/applications/${registryManagementNumber}/receipts/list`, // [R02U-01][GET] 등기접수 목록 조회
    UPDATE: (registryManagementNumber: string | number) =>
      `/api/registry/applications/${registryManagementNumber}/receipts`, // [R02U-02][PATCH] 등기접수 수정
    DETAIL: (registryManagementNumber: string | number) =>
      `/api/registry/applications/${registryManagementNumber}/receipts/detail` // [R02U-03][GET] 등기접수 상세 조회
  },

  // [R02W] 등기진행-영수증
  REGISTRY_RECEIPT_DOCUMENT: {
    LIST: (registryManagementNumber: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/receipt-documents/list`, // [R02W-01][GET] 등기 영수증 목록 조회
    DETAIL: (registryManagementNumber: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/receipt-documents/detail`, // [R02W-02][GET] 등기 영수증 상세 조회
    CREATE: (registryManagementNumber: string | number, receiptDocumentId: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/receipt-documents/${receiptDocumentId}/document`, // [R02W-03][POST] 등기 영수증 전자문서 생성
    DELETE: (registryManagementNumber: string | number, receiptDocumentId: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/receipt-documents/${receiptDocumentId}/document`, // [R02W-04][DELETE] 등기 영수증 전자문서 삭제
    DOCUMENT: (registryManagementNumber: string | number, receiptDocumentId: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/receipt-documents/${receiptDocumentId}/document`, // [R02W-05][GET] 등기 영수증 전자문서 조회
    FORM: (registryManagementNumber: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/receipt-documents/detail/form`, // [R02W-06][GET] 등기 영수증 폼 조회
    SAVE: (registryManagementNumber: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/receipt-documents` // [R02W-07][PUT] 등기 영수증 저장
  },

  // [R02X] 등기진행-완료문서
  REGISTRY_COMPLETION: {
    LIST: (registryManagementNumber: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/completion-documents/list`, // [R02X-01][GET] 등기완료 문서 목록 조회
    DETAIL: (registryManagementNumber: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/completion-documents/detail`, // [R02X-02][GET] 등기완료 문서 상세 조회
    UPLOAD: (registryManagementNumber: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/completion-documents/full-certificate/uploads`, // [R02X-03][POST] 등기사항전부증명서 문서 업로드
    UPLOAD_2: (registryManagementNumber: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/completion-documents/post-certificate/uploads`, // [R02X-04][POST] 사후등기필정보 문서 업로드
    PREVIEW_BASE64: (registryManagementNumber: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/completion-documents/post-certificate/preview`, // [R02X-06][GET] 등기사항전부증명서/사후등기필정보 Base64 보기
    DELETE_FULL: (registryManagementNumber: string | number, fileName: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/completion-documents/full-certificate/${fileName}`, // [R02X-07][DELETE] 등기사항전부증명서 문서 삭제
    DELETE_POST: (registryManagementNumber: string | number, fileName: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/completion-documents/post-certificate/${fileName}` // [R02X-08][DELETE] 사후등기필정보 문서 삭제
  },

  // [R02Y] 등기진행-문서
  REGISTRY_PROGRESS_DOCUMENT: {
    TEMP_UPLOAD: (registryManagementNumber: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/documents/temp`, // [R02Y-01][POST] 문서 임시 업로드
    LIST: (registryManagementNumber: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/documents`, // [R02Y-02][GET] 문서 목록 조회
    SAVE: (registryManagementNumber: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/documents`, // [R02Y-03][POST] 문서 저장
    DELETE: (registryManagementNumber: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/documents`, // [R02Y-04][DELETE] 문서 삭제
    DOWNLOAD: (registryManagementNumber: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/documents/download`, // [R02Y-05][GET] 문서 다운로드
    DOWNLOAD_BASE64: (registryManagementNumber: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/documents/download/base64`, // [R02Y-06][GET] 문서 Base64 다운로드
    DELETE_2: (registryManagementNumber: string | number, applicationId: string | number) =>
      `/api/registry/progress/${registryManagementNumber}/applications/${applicationId}/documents` // [R02Y-07][DELETE] 신청번호 기준 문서 삭제
  },

  // [R03] 등기일정관리
  REGISTRY_SCHEDULE: {
    LIST: '/api/registry/progress/schedules' // [R03-01][GET] 등기일정 목록 조회
  },

  // [RPAC] RPA 사용자 PC 작업
  RPA: {
    CREATE: (registryManagementNumber: string | number) =>
      `/api/registry/rpa/user-tasks/${registryManagementNumber}/full-certificate-view`, // [RPAC-01][POST] 등기사항전부증명서 열람 작업 등록
    CREATE_2: (registryManagementNumber: string | number) =>
      `/api/registry/rpa/user-tasks/${registryManagementNumber}/property-description`, // [RPAC-02][POST] 부동산의표시 생성 작업 등록
    CREATE_3: (registryManagementNumber: string | number) =>
      `/api/registry/rpa/user-tasks/${registryManagementNumber}/registration-password`, // [RPAC-03][POST] 등기필정보 비밀번호 조회 작업 등록
    CREATE_4: (registryManagementNumber: string | number) =>
      `/api/registry/rpa/user-tasks/${registryManagementNumber}/etax-acquisition`, // [RPAC-04][POST] 이택스 취득세 작업 등록
    CREATE_5: (registryManagementNumber: string | number) =>
      `/api/registry/rpa/user-tasks/${registryManagementNumber}/etax-registration`, // [RPAC-05][POST] 이택스 등록면허세 작업 등록
    CREATE_6: (registryManagementNumber: string | number) =>
      `/api/registry/rpa/user-tasks/${registryManagementNumber}/wetax-acquisition`, // [RPAC-06][POST] 위택스 취득세 작업 등록
    CREATE_7: (registryManagementNumber: string | number) =>
      `/api/registry/rpa/user-tasks/${registryManagementNumber}/wetax-registration`, // [RPAC-07][POST] 위택스 등록면허세 작업 등록
    CREATE_8: (registryManagementNumber: string | number) =>
      `/api/registry/rpa/user-tasks/${registryManagementNumber}/registration-case`, // [RPAC-08][POST] 등기 신청사건 조회 작업 등록
    CREATE_9: (registryManagementNumber: string | number) =>
      `/api/registry/rpa/user-tasks/${registryManagementNumber}/admin-consent`, // [RPAC-09][POST] 행정정보 동의요청 작업 등록
    CREATE_10: (registryManagementNumber: string | number) =>
      `/api/registry/rpa/user-tasks/${registryManagementNumber}/registration-application`, // [RPAC-10][POST] 등기신청서 작성 작업 등록
    USER_TASKS: (taskToken: string | number) => `/api/registry/rpa/user-tasks/${taskToken}`, // [RPAC-11][GET] RPA 작업 조회
    RESULT: (taskToken: string | number) => `/api/registry/rpa/user-tasks/${taskToken}/result`, // [RPAC-12][PATCH] RPA 작업 결과 전달
    CREATE_11: (registryManagementNumber: string | number) =>
      `/api/registry/rpa/user-tasks/${registryManagementNumber}/full-certificate-issue` // [RPAC-13][POST] 등기사항전부증명서 발급 작업 등록
  }
} as const
