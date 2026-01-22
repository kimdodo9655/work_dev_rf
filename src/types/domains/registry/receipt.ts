/**
 * 접수정보 관련 타입 정의
 * @file src/types/domains/registry/receipt.ts
 *
 * OpenAPI Schema 기반으로 생성됨
 * 생성일: 2025-01-16
 */

/**
 * 접수정보 항목
 * Schema: ReceiptItem
 */
export interface ReceiptItem {
  /** 신청서 ID */
  applicationId: number
  /** 자격자 ID */
  qualifiedId?: number
  /** 접수번호 */
  receiptNumber?: string
  /** 접수일자 */
  receiptDate?: string
  /** 작성번호 */
  creationNumber?: string
  /** 작성년도 */
  creationYear?: string
}

/**
 * 신청서 접수정보 항목
 * Schema: ApplicationReceiptItem
 */
export interface ApplicationReceiptItem {
  /** 신청서 ID */
  applicationId: number
  /** 등기 유형 */
  registryType: string
  /** 등기 원인 */
  registryCause: string
  /** 등기 진행 방식 */
  registryMethod: string
  /** 접수 등기소 */
  establishmentJurisdictionOffice: string
  /** 접수번호 */
  receiptNumber?: string
  /** 접수일자 */
  receiptDate?: string
  /** 작성번호 */
  creationNumber?: string
  /** 작성년도 */
  creationYear?: string
}

/**
 * 접수정보 목록 아이템
 * Schema: ApplicationReceiptListItem
 */
export interface ReceiptListItem {
  /** 등기 유형 */
  registryType: string
  /** 등기 진행 방식 */
  registryMethod: string
  /** 접수 등기소 */
  establishmentJurisdictionOffice: string
  /** 접수번호 */
  receiptNumber?: string
  /** 접수일자 */
  receiptDate?: string
  /** 작성번호 */
  creationNumber?: string
}

/**
 * 접수정보 목록 응답
 * Schema: RegistryApplicationReceiptListResponse
 * API: GET /api/registry/applications/{managementNumber}/receipts
 */
export interface ReceiptListResponse {
  /** 등기 접수 정보 목록 */
  applicationReceipt: ReceiptListItem[]
}

/**
 * 지점 인터넷등기소 계정 정보
 * Schema: BranchRegistryCredentialResponse
 */
export interface BranchRegistryCredential {
  /** 지점 인터넷등기소 아이디 고유번호 */
  credentialId: number
  /** 지점 ID */
  branchId: number
  /** 자격자 구분 */
  qualifiedType: string
  /** 자격자 구분 설명 */
  qualifiedTypeDescription: string
  /** 자격자 성명 */
  qualifiedName: string
  /** 인터넷등기소 로그인 아이디 */
  registryLoginId: string
  /** 인터넷등기소 로그인 비밀번호 */
  registryPassword: string
}

/**
 * 접수정보 상세 응답
 * Schema: RegistryApplicationReceiptResponse
 * API: GET /api/registry/applications/{managementNumber}/receipts/details
 */
export interface ReceiptDetailResponse {
  /** 등기 접수 정보 */
  applicationReceiptItems: ApplicationReceiptItem[]
  /** 지점 인터넷등기소 계정 정보 */
  branchRegistryCredentials: BranchRegistryCredential
}

/**
 * 접수정보 저장 요청
 * Schema: RegistryApplicationReceiptReplaceRequest
 * API: PUT /api/registry/applications/{managementNumber}/receipts
 */
export interface ReceiptSaveRequest {
  /** 등기 접수 정보 목록 */
  receiptItems: ReceiptItem[]
}

/**
 * 사건 조회 항목
 * Schema: CaseInquiryItem
 */
export interface CaseInquiryItem {
  /** 접수번호 */
  receiptNumber: string
  /** 접수일자 */
  receiptDate: string
  /** 접수년도 */
  receiptYear: string
  /** 사건명 */
  caseName: string
  /** 처리 상태 */
  status: string
  /** 처리 일자 */
  processedDate?: string
  /** 등기 완료 여부 */
  isCompleted: boolean
}

/**
 * 사건 조회 목록 항목
 * Schema: CaseInquiryListItem
 */
export interface CaseInquiryListItem {
  /** 접수번호 */
  receiptNumber: string
  /** 접수일자 */
  receiptDate: string
  /** 사건명 */
  caseName: string
  /** 처리 상태 */
  status: string
  /** 등기 완료 여부 */
  isCompleted: boolean
}

/**
 * 사건 조회 결과 래퍼
 * Schema: CaseInquiryResultWrapperItem
 */
export interface CaseInquiryResultWrapper {
  /** 조회 성공 여부 */
  success: boolean
  /** 사건 정보 */
  caseInfo?: CaseInquiryItem
  /** 에러 메시지 */
  errorMessage?: string
}

/**
 * 사건 조회 목록 응답
 * Schema: RegistryProgressCaseInquiryListResponse
 * API: GET /api/registry/progress/{managementNumber}/case-inquiries
 */
export interface CaseInquiryListResponse {
  /** 사건 조회 목록 */
  caseInquiries: CaseInquiryListItem[]
}

/**
 * 사건 조회 요청
 * Schema: RegistryProgressCaseInquiryRequest
 * API: POST /api/registry/progress/{managementNumber}/case-inquiries
 */
export interface CaseInquiryRequest {
  /** 접수번호 */
  receiptNumber: string
  /** 접수년도 */
  receiptYear: string
  /** 자격자 ID */
  qualifiedId: number
}

/**
 * 사건 조회 응답
 * Schema: RegistryProgressCaseInquiryResponse
 */
export interface CaseInquiryResponse {
  /** 사건 조회 결과 */
  result: CaseInquiryResultWrapper
}

/**
 * 등기 사건 조회 RPA 작업 요청
 * Schema: RegistrationCaseQueryTaskRequest
 * API: POST /api/registry/rpa/user-tasks/{managementNumber}/registration-case
 */
export interface RegistrationCaseQueryTaskRequest {
  /** 접수번호 */
  receiptNumber: string
  /** 접수년도 */
  receiptYear: string
}
