/**
 * REGISTRY_PROGRESS API Types
 * @generated 2025-01-27
 */

/**
 * R02B-01
 * GET /api/registry/progress
 */
export interface SearchRegistryProgresssListQuery {
  /** 업무구분 */
  workType: 'ALL' | 'ESTABLISHMENT' | 'TRANSFER_AND_ESTABLISHMENT' | 'CANCELLATION'
  /** 배정업무 */
  assignedWork:
    | 'ALL'
    | '설정'
    | '말소,설정'
    | '이전'
    | '말소,이전'
    | '설정(이전연계)'
    | '이전,설정'
    | '말소,이전,설정'
  /** 등기방식 */
  registryMethod: 'ALL' | '전자' | 'E-from' | '서면' | '혼합'
  /** 업무담당자 ID */
  managerUserId: 'ALL'
  /** 등기의뢰일자 시작 */
  registryRequestStartDate: string
  /** 등기의뢰일자 종료 */
  registryRequestEndDate: string
  /** 등기접수일자 시작 */
  registryReceiptStartDate: string
  /** 등기접수일자 종료 */
  registryReceiptEndDate: string
  /** 진행상태 */
  progressStatus:
    | 'ALL'
    | 'ASSIGN_MANAGER'
    | 'INSPECT_REGISTRY_INFO'
    | 'REQUEST_RESUBMISSION'
    | 'REGISTER_APPLICATION_INFO'
    | 'REQUEST_ADMIN_INFO_CONSENT'
    | 'OBLIGOR_E_SIGNATURE'
    | 'OBLIGEE_E_SIGNATURE'
    | 'TAX_DECLARATION_AGENCY'
    | 'PURCHASE_HOUSING_BOND'
    | 'REGISTER_LOAN_ACCOUNT'
    | 'WAITING_LOAN_PAYMENT'
    | 'LOAN_PAYMENT_COMPLETED'
    | 'REGISTER_TRANSFER_CERTIFICATE'
    | 'CREATE_APPLICATION'
    | 'INTERNET_REGISTRY_E_SIGNATURE'
    | 'REQUEST_CASE_DELEGATION'
    | 'WAITING_CASE_DELEGATION'
    | 'CASE_DELEGATION_COMPLETED'
    | 'REGISTRY_RECEIVED'
    | 'CREATE_COST_STATEMENT'
    | 'REGISTER_COMPLETION_DOCUMENTS'
    | 'SUBMIT_COMPLETION_DOCUMENTS'
    | 'REGISTRY_COMPLETED'
    | 'REGISTRY_CANCELLED'
  /** 부동산 및 신청번호 검색 */
  searchKeyword?: string
  /** 페이지 번호 */
  page: number
  /** 페이지 크기 */
  size: number
}

export type SearchRegistryProgresssListResponse = RegistryProgressResponse

/**
 * R02B-02
 * GET /api/registry/progress/{registryManagementNumber}/basic-info
 */
export interface GetRegistryProgressBasicInfoParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type GetRegistryProgressBasicInfoResponse = RegistryProgressBasicResponse

/**
 * R02B-03
 * PATCH /api/registry/progress/{registryManagementNumber}/assign-manager
 */
export interface PatchRegistryProgressAssignManagerParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type PatchRegistryProgressAssignManagerRequest = AssignManagerRequest

export type PatchRegistryProgressAssignManagerResponse = RegistryProgressResponse

/**
 * R02B-04
 * GET /api/registry/progress/{registryManagementNumber}/loan-info
 */
export interface GetRegistryProgressLoanInfoParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type GetRegistryProgressLoanInfoResponse = RegistryProgressLoanResponse

/**
 * R02B-05
 * GET /api/registry/progress/{registryManagementNumber}/ownership-transfer
 */
export interface GetRegistryProgressOwnershipTransferParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type GetRegistryProgressOwnershipTransferResponse = RegistryProgressOwnershipTransferResponse

/**
 * R02B-06
 * GET /api/registry/progress/{registryManagementNumber}/mortgage
 */
export interface GetRegistryProgressMortgageParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type GetRegistryProgressMortgageResponse = RegistryProgressMortgageResponse

/**
 * R02B-07
 * GET /api/registry/progress/{registryManagementNumber}/legal-agent
 */
export interface GetRegistryProgressLegalAgentQuery {
  /** 조회할 등기유형 (MORTGAGE 또는 OWNERSHIP_TRANSFER) */
  registryType:
    | 'OWNERSHIP_TRANSFER'
    | 'MORTGAGE'
    | 'SURFACE_RIGHT'
    | 'CHANGE'
    | 'CORRECTION'
    | 'MORTGAGE_CANCELLATION'
    | 'SURFACE_RIGHT_CANCELLATION'
}

export interface GetRegistryProgressLegalAgentParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type GetRegistryProgressLegalAgentResponse = RegistryProgressLegalAgentResponse

/**
 * R02B-08
 * GET /api/registry/progress/{registryManagementNumber}/process
 */
export interface GetRegistryProgressProcessParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type GetRegistryProgressProcessResponse = RegistryProgressProcessResponse

/**
 * R02B-09
 * PATCH /api/registry/progress/{registryManagementNumber}/process/change
 */
export interface ChangeRegistryProgressProcessParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export interface ChangeRegistryProgressProcessQuery {
  /** 변경할 등기진행상태(nexstep) */
  newStatus:
    | 'ASSIGN_MANAGER'
    | 'INSPECT_REGISTRY_INFO'
    | 'REQUEST_RESUBMISSION'
    | 'REGISTER_APPLICATION_INFO'
    | 'REQUEST_ADMIN_INFO_CONSENT'
    | 'OBLIGOR_E_SIGNATURE'
    | 'OBLIGEE_E_SIGNATURE'
    | 'TAX_DECLARATION_AGENCY'
    | 'PURCHASE_HOUSING_BOND'
    | 'REGISTER_LOAN_ACCOUNT'
    | 'WAITING_LOAN_PAYMENT'
    | 'LOAN_PAYMENT_COMPLETED'
    | 'REGISTER_TRANSFER_CERTIFICATE'
    | 'CREATE_APPLICATION'
    | 'INTERNET_REGISTRY_E_SIGNATURE'
    | 'REQUEST_CASE_DELEGATION'
    | 'WAITING_CASE_DELEGATION'
    | 'CASE_DELEGATION_COMPLETED'
    | 'REGISTRY_RECEIVED'
    | 'CREATE_COST_STATEMENT'
    | 'REGISTER_COMPLETION_DOCUMENTS'
    | 'SUBMIT_COMPLETION_DOCUMENTS'
    | 'REGISTRY_COMPLETED'
    | 'REGISTRY_CANCELLED'
}

export type ChangeRegistryProgressProcessResponse = void

// ==================== Schemas ====================

/** 등기진행 - 업무담당자 배정 요청 */
export interface AssignManagerRequest {
  /** 담당자 일련번호 */
  managerUserId: number
}

/** 등기진행유형 */
export type ProgressType = 'TYPE_01' | 'TYPE_02' | 'TYPE_04' | 'TYPE_05' | 'TYPE_07'

/** 등기진행 업무 프로세스 조회 응답 */
export interface RegistryProgressProcessResponse {
  /** 등기관리번호 */
  registryManagementNumber?: string
  /** 등기 진행 유형 */
  progressType?: string
  /** 등기 진행 유형 설명 */
  progressTypeDescription?: string
  /** 등기 방식 */
  registryMethod?: string
  /** 등기 방식 설명 */
  registryMethodDescription?: string
  /** 현재 진행 상태 */
  currentStatus?: string
  /** 현재 진행 상태 설명 */
  currentStatusDescription?: string
  /** 단계 목록 */
  steps?: ProcessStepResponse[]
}

/** 프로세스 단계 정보 */
export interface ProcessStepResponse {
  /** 단계 코드 */
  step?: string
  /** 단계 제목 */
  stepTitle?: string
  /** 단계 설명 */
  stepDescription?: string
  /** 현재 단계 여부 */
  isCurrentStep?: boolean
  /** 해당 단계에서 가능한 액션 목록 */
  actions?: ProcessActionResponse[]
}

/** 프로세스 액션 정보 */
export interface ProcessActionResponse {
  /** 액션 코드 */
  action?: string
  /** 액션 설명 */
  actionDescription?: string
  /** 다음 진행 상태 */
  nextStatus?: string
  /** 다음 진행 상태 설명 */
  nextStatusDescription?: string
}

/** 업무 기본 정보 조회 조회 */
export interface RegistryProgressBasicResponse {
  /** 등기관리번호 */
  registryManagementNumber?: string
  /** 접수일자 */
  registryReceiptDate?: string
  /** 진행상태 */
  progressStatus?: string
  /** 배정업무 */
  assignedWork?: string
  /** 업무구분 */
  workType?: string
  progressType?: ProgressType
  /** 등기서류건수 */
  attachmentCnt?: number
  /** 상환/말소 주체 */
  repaymentCancellationSubject?: string
  /** 상환/말소 건수 */
  repaymentCancellationSubjectCnt?: number
}

/** 법무대리인 정보 */
export interface RegistryProgressLegalAgentResponse {
  /** 법무대리인 기관명 */
  legalAgentName?: string
  /** 법무대리인 담당자명 */
  managerName?: string
  /** 법무대리인 담당자 직통번호 */
  directPhoneNumber?: string
}

/** 등기 진행 현황 대출 금융기관 정보 조회 */
export interface RegistryProgressLoanResponse {
  /** 금융기관명 */
  bankName?: string
  /** 지점명 */
  branchName?: string
  /** 등기신청번호 */
  registryRequestNumber?: string
  /** 담당자명 */
  managerName?: string
  /** 담당자직책 */
  managerPosition?: string
  /** 담당자전화번호 */
  managerPhone?: string
  /** 등기의뢰일자 */
  createdAt?: string
  /** 담당자전달사항 */
  managerMessage?: string
}

/** 근저당권설정 정보 */
export interface RegistryProgressMortgageResponse {
  /** 등기 유형 */
  registryTypeName?: string
  /** 등기 원인 */
  registryCauseName?: string
  /** 채권최고액 */
  maximumCreditAmount?: number
  /** 등기 방식 */
  registryMethodName?: string
  /** 지상권 여부 (O/X) */
  surfaceRightYn?: string
  /** 지상권 존속기간 */
  durationPeriod?: string
}

/** 소유권이전 정보 */
export interface RegistryProgressOwnershipTransferResponse {
  /** 등기유형 */
  registryType?: string
  /** 등기원인 */
  registryCause?: string
  /** 매매가액 */
  tradeAmount?: number
  /** 등기방식 */
  registryMethod?: string
  /** 견적서 작성자 */
  estimateWriter?: string
  /** 견적서 선정일시 (ISO-8601) */
  selectedAt?: string
}

/** 등기 진행 현황 */
export interface RegistryProgressResponse {
  /** 번호 */
  rowNum?: number
  /** 등기신청번호 */
  registryRequestNumber?: string
  /** 등기관리번호 */
  registryManagementNumber?: string
  /** 업무구분 */
  workType?: string
  /** 배정업무 */
  assignedWork?: string
  /** 등기방식 */
  registryMethod?: string
  /** 부동산표시 */
  propertyAddress?: string
  /** 등기의뢰일자 */
  registryRequestDate?: string
  /** 등기접수일자 */
  registryReceiptDate?: string
  /** 업무담당자 */
  managerUserName?: string
  /** 진행상태 */
  progressStatus?: string
}
