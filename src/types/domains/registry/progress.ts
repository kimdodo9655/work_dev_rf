/**
 * 등기 진행 관련 타입 정의
 * @file src/types/domains/registry/progress.ts
 *
 * OpenAPI Schema 기반으로 생성됨
 * 생성일: 2025-01-16
 */

/**
 * 등기 진행 기본 정보
 * Schema: RegistryProgressBasicResponse
 * API: [R02B-02] GET /api/registry/progress/{registryManagementNumber}/basic-info
 */
export interface RegistryProgressBasic {
  /** 등기관리번호 */
  registryManagementNumber: string
  /** 업무 구분 */
  workType: string
  /** 배정 업무 */
  assignedWork: string
  /** 진행 상태 */
  progressStatus: string
  /** 접수일자 */
  registryReceiptDate: string
  /** 등기서류 건수 */
  attachmentCnt: number
  /** 상환/말소 주체 */
  repaymentCancellationSubject: string
  /** 상환/말소 건수 */
  repaymentCancellationSubjectCnt: number
}

/**
 * 등기 진행 목록 아이템
 * Schema: RegistryProgressResponse
 * API: [R02B-01] GET /api/registry/progress
 * API: [R02B-03] PATCH /api/registry/progress/{registryManagementNumber}/assign-manager
 */
export interface RegistryProgressListItem {
  /** 번호 */
  rowNum: number
  /** 등기관리번호 */
  registryManagementNumber: string
  /** 등기신청번호 */
  registryRequestNumber: string
  /** 업무 구분 */
  workType: string
  /** 배정 업무 */
  assignedWork: string
  /** 진행 상태 */
  progressStatus: string
  /** 등기 방식 */
  registryMethod: string
  /** 부동산 표시 */
  propertyAddress: string
  /** 등기의뢰일자 */
  registryRequestDate: string
  /** 등기접수일자 */
  registryReceiptDate?: string
  /** 업무담당자 */
  managerUserName?: string
}

/**
 * 대출 금융기관 정보
 * Schema: RegistryProgressLoanResponse
 * API: [R02B-04] GET /api/registry/progress/{registryManagementNumber}/loan-info
 */
export interface RegistryProgressLoan {
  /** 등기신청번호 */
  registryRequestNumber: string
  /** 금융기관명 */
  bankName: string
  /** 지점명 */
  branchName: string
  /** 담당자명 */
  managerName: string
  /** 담당자 전화번호 */
  managerPhone: string
  /** 담당자 전달사항 */
  managerMessage?: string
  /** 등기의뢰일자 */
  createdAt: string
}

/**
 * 나의 진행현황 요약
 * Schema: RegistryProgressSummaryResponse
 * API: [R02A-01] GET /api/registry/progress/summary
 */
export interface ProgressSummary {
  /** 업무 배정 건수 */
  assignedCount: number
  /** 업무 진행 건수 */
  inProgressCount: number
  /** 완료/취소 건수 */
  completedCount: number
}

/**
 * 진행 상태별 통계 아이템
 * Schema: ProgressStatusCount
 */
export interface ProgressStatusCount {
  /** 진행 상태 코드 */
  progressStatus: string
  /** 진행 상태 설명 */
  progressStatusDescription: string
  /** 건수 */
  count: number
}

/**
 * 진행 상태별 업무현황
 * Schema: RegistryProgressStatisticsResponse
 * API: [R02A-04] GET /api/registry/progress/statistics
 */
export interface ProgressStatistics {
  /** 진행 상태별 통계 목록 */
  statusCounts: ProgressStatusCount[]
}

/**
 * 오늘의 접수사건 아이템
 * Schema: RegistryProgressTodayResponse
 * API: [R02A-02] GET /api/registry/progress/today
 */
export interface TodayProgress {
  /** 등기신청번호 */
  registryManagementNumber: string
  /** 접수일자 */
  registryReceiptDate: string
  /** 담당자명 */
  userName: string
}

/**
 * 일일 일정 정보
 * Schema: DailySchedule
 */
export interface DailySchedule {
  /** 날짜 (yyyy-MM-dd) */
  date: string
  /** 해당 날짜의 일정 목록 */
  schedules: ScheduleItem[]
}

/**
 * 일정 아이템
 * Schema: ScheduleItem
 */
export interface ScheduleItem {
  /** 등기관리번호 */
  registryManagementNumber: string
  /** 업무 구분 */
  workType: string
  /** 진행 상태 */
  progressStatus: string
  /** 부동산 주소 */
  propertyAddress: string
  /** 예정일자 */
  scheduledDate: string
}

/**
 * 등기일정 목록 응답
 * Schema: RegistryProgressSchedulesResponse
 * API: [R03-01] GET /api/registry/progress/schedules
 */
export interface ProgressSchedules {
  /** 일정 목록 (날짜별) */
  schedules: DailySchedule[]
}

/**
 * 업무담당자 배정 요청
 * Schema: AssignManagerRequest
 * API: [R02B-03] PATCH /api/registry/progress/{registryManagementNumber}/assign-manager
 */
export interface AssignManagerRequest {
  /** 사용자 ID */
  userId: number
}

/**
 * 등기 진행 목록 조회 파라미터
 */
export interface ProgressListParams {
  /** 검색 키워드 */
  keyword?: string
  /** 업무 구분 */
  workType?: string
  /** 배정 업무 */
  assignedWork?: string
  /** 진행 상태 */
  progressStatus?: string
  /** 담당자 ID */
  managerUserId?: number
  /** 시작 일자 (yyyy-MM-dd) */
  startDate?: string
  /** 종료 일자 (yyyy-MM-dd) */
  endDate?: string
  /** 페이지 번호 */
  page?: number
  /** 페이지 크기 */
  size?: number
  /** 정렬 기준 */
  sort?: string
}

/**
 * 등기 일정 조회 파라미터
 */
export interface ScheduleParams {
  /** 시작 날짜 (yyyy-MM-dd) */
  startDate: string
  /** 종료 날짜 (yyyy-MM-dd) */
  endDate: string
  /** 업무 구분 (선택) */
  workType?: string
  /** 진행 상태 (선택) */
  progressStatus?: string
}

/**
 * 전자서명 테이블 응답
 * Schema: RegistryProgressESignatureTableResponse
 * @since 2025-01-22 - 신규 추가
 */
export interface RegistryProgressESignatureTableResponse {
  /** 전자서명 ID */
  eSignatureId?: number
  /** 당사자 구분명 */
  partyRoleName?: string
  /** 성명(명칭) */
  name?: string
  /** 서명 방식명 */
  signatureMethodName?: string
  /** 서명 요청 일시 */
  signatureRequestedAt?: string
  /** 서명 완료 일시 */
  signatureCompletedAt?: string
  /** 전자서명 상태명 */
  statusName?: string
  /** 상세 버튼 노출 여부 */
  detailAvailable?: boolean
}

// ============================================================================
// 세금신고 대행 (R02P)
// ============================================================================

/**
 * 세금신고 대행 정보
 * Schema: RegistryTaxAgencyResponse
 * API: [R02P-01] GET /api/registry/progress/{registryManagementNumber}/tax-agencies/detail
 * API: [R02P-02] GET /api/registry/progress/{registryManagementNumber}/tax-agencies/list
 * API: [R02P-03] PUT /api/registry/progress/{registryManagementNumber}/tax-agencies
 */
export interface RegistryTaxAgency {
  /** 세금신고 대행 ID */
  taxAgencyId?: number
  /** 등기관리번호 */
  registryManagementNumber?: string
  /** 업무프로세스명 */
  processName?: string
  /** 담당자명 */
  managerName?: string
  /** 상태 */
  status?: string
  /** 비고 */
  note?: string
}

/**
 * 세금신고 대행 목록 응답
 * Schema: RegistryTaxAgencyListResponse
 * API: [R02P-02] GET /api/registry/progress/{registryManagementNumber}/tax-agencies/list
 */
export interface RegistryTaxAgencyListResponse {
  /** 세금신고 대행 목록 */
  taxAgencies: RegistryTaxAgency[]
}

/**
 * 세금신고 대행 상세 응답
 * Schema: RegistryTaxAgencyDetailResponse
 * API: [R02P-01] GET /api/registry/progress/{registryManagementNumber}/tax-agencies/detail
 */
export interface RegistryTaxAgencyDetailResponse {
  /** 세금신고 대행 정보 */
  taxAgency: RegistryTaxAgency
}

/**
 * 세금신고 대행 저장 요청
 * Schema: RegistryTaxAgencySaveRequest
 * API: [R02P-03] PUT /api/registry/progress/{registryManagementNumber}/tax-agencies
 */
export interface RegistryTaxAgencySaveRequest {
  /** 세금신고 대행 목록 */
  taxAgencies: RegistryTaxAgency[]
}

// ============================================================================
// 대출금 지급계좌 (R02R)
// ============================================================================

/**
 * 대출금 지급계좌 정보
 * Schema: RegistryLoanPaymentAccountResponse
 * API: [R02R-01] GET /api/registry/progress/{registryManagementNumber}/loan-payment-accounts/detail
 * API: [R02R-02] GET /api/registry/progress/{registryManagementNumber}/loan-payment-accounts/list
 * API: [R02R-03] PUT /api/registry/progress/{registryManagementNumber}/loan-payment-accounts
 */
export interface RegistryLoanPaymentAccount {
  /** 대출금 지급계좌 ID */
  loanPaymentAccountId?: number
  /** 등기관리번호 */
  registryManagementNumber?: string
  /** 금융기관명 */
  bankName?: string
  /** 계좌번호 */
  accountNumber?: string
  /** 예금주 */
  accountHolder?: string
  /** 지급금액 */
  paymentAmount?: number
  /** 상환영수증 파일명 */
  receiptFileName?: string
  /** 상환영수증 업로드 일시 */
  receiptUploadedAt?: string
}

/**
 * 대출금 지급계좌 목록 응답
 * Schema: RegistryLoanPaymentAccountListResponse
 * API: [R02R-02] GET /api/registry/progress/{registryManagementNumber}/loan-payment-accounts/list
 */
export interface RegistryLoanPaymentAccountListResponse {
  /** 대출금 지급계좌 목록 */
  loanPaymentAccounts: RegistryLoanPaymentAccount[]
}

/**
 * 대출금 지급계좌 상세 응답
 * Schema: RegistryLoanPaymentAccountDetailResponse
 * API: [R02R-01] GET /api/registry/progress/{registryManagementNumber}/loan-payment-accounts/detail
 */
export interface RegistryLoanPaymentAccountDetailResponse {
  /** 대출금 지급계좌 정보 */
  loanPaymentAccount: RegistryLoanPaymentAccount
}

/**
 * 대출금 지급계좌 저장 요청
 * Schema: RegistryLoanPaymentAccountSaveRequest
 * API: [R02R-03] PUT /api/registry/progress/{registryManagementNumber}/loan-payment-accounts
 */
export interface RegistryLoanPaymentAccountSaveRequest {
  /** 대출금 지급계좌 목록 */
  loanPaymentAccounts: RegistryLoanPaymentAccount[]
}

/**
 * 상환영수증 업로드 응답
 * Schema: RegistryLoanPaymentAccountReceiptUploadResponse
 * API: [R02R-04] POST /api/registry/progress/{registryManagementNumber}/loan-payment-accounts/{loanPaymentAccountId}/receipt
 */
export interface RegistryLoanPaymentAccountReceiptUploadResponse {
  /** 업로드된 파일명 */
  fileName: string
  /** 업로드 일시 */
  uploadedAt: string
}
