/**
 * 등기 신청서 관련 타입 정의
 * @file src/types/domains/registry/application.ts
 *
 * OpenAPI Schema 기반으로 생성됨
 * 생성일: 2025-01-16
 */

/**
 * 등기 신청서 생성 요청
 * Schema: RegistryApplicationCreateRequest
 * API: POST /api/registry/applications/{registryManagementNumber}
 */
export interface RegistryApplicationCreateRequest {
  /** 등기 유형 */
  registryType: string
  /** 등기 원인 */
  registryCause: string
  /** 등기 방식 (ELECTRONIC: 전자, E_FORM: 전자서식, PAPER: 서면) */
  registryMethod: string
  /** 행정정보 연계 시점 */
  adminInfoLinkTime?: string
}

/**
 * 등기 신청서 수정 요청
 * Schema: RegistryApplicationUpdateRequest
 * API: PATCH /api/registry/applications/{registryManagementNumber}
 */
export interface RegistryApplicationUpdateRequest {
  /** 등기 유형 */
  registryType: string
  /** 등기 방식 */
  registryMethod: string
  /** 행정정보 연계 시점 */
  adminInfoLinkTime?: string
}

/**
 * 등기 신청서 양식 아이템
 * Schema: RegistryApplicationFormResponse
 * API: GET /api/registry/applications/{registryManagementNumber}/tabs
 */
export interface RegistryApplicationForm {
  /** 신청서 ID */
  applicationId: number
  /** 등기관리번호 */
  registryManagementNumber: string
  /** 등기 유형 코드 */
  registryType: string
  /** 등기 유형 라벨 */
  registryTypeLabel: string
}

/**
 * 등기 신청서 문서 섹션
 * Schema: RegistryApplicationDocumentSectionResponse
 */
export interface RegistryApplicationDocumentSection {
  /** 섹션 ID */
  sectionId: string
  /** 섹션명 */
  sectionName: string
  /** 완성 여부 */
  isCompleted: boolean
  /** 필수 여부 */
  isRequired: boolean
}

/**
 * 등기 신청서 전자문서 응답
 * Schema: RegistryApplicationDocumentResponse
 * API: GET /api/registry/applications/{applicationId}/documents
 */
export interface RegistryApplicationDocument {
  /** 신청서 ID */
  applicationId: number
  /** 등기관리번호 */
  registryManagementNumber: string
  /** 등기 유형 */
  registryType: string
  /** 등기 원인 */
  registryCause: string
  /** 등기 방식 */
  registryMethod: string
  /** 행정정보 연계 시점 */
  adminInfoLinkTime?: string
  /** 등기유형별 섹션 목록 */
  sections: RegistryApplicationDocumentSection[]
}

/**
 * 근저당권설정 정보 응답
 * Schema: RegistryApplicationMortgageInfoResponse
 * API: GET /api/registry/applications/mortgages/{registryManagementNumber}/info
 */
export interface MortgageInfo {
  /** 등기 유형명 */
  registryTypeName: string
  /** 등기 원인명 */
  registryCauseName: string
  /** 등기 방식명 */
  registryMethodName: string
  /** 채권최고액 */
  maximumCreditAmount: number
  /** 지상권 여부 (O: 있음, X: 없음) */
  surfaceRightYn: string
  /** 지상권 존속기간 */
  durationPeriod?: string
}

/**
 * 소유권이전 요약 정보
 * Schema: OwnershipTransferSummaryResponse
 * API: GET /api/registry/applications/{applicationId}/ownership-transfer
 */
export interface OwnershipTransferSummary {
  /** 등기 유형 */
  registryType: string
  /** 등기 원인 */
  registryCause: string
  /** 등기 방식 */
  registryMethod: string
  /** 매매가액 */
  tradeAmount?: string
  /** 견적서 작성자 (지점 자격자명) */
  estimateWriter: string
  /** 견적서 선정일시 (ISO-8601) */
  selectedAt: string
}

/**
 * 법무대리인 정보
 * Schema: LegalAgentInfo
 */
export interface LegalAgentInfo {
  /** 법무사명 */
  name: string
  /** 법무사 사무소명 */
  officeName: string
  /** 법무사 등록번호 */
  registrationNumber: string
  /** 사무소 주소 */
  address: string
  /** 전화번호 */
  phone: string
}

/**
 * 등기 신청서 삭제 요청
 * API: DELETE /api/registry/applications/{registryManagementNumber}
 */
export interface RegistryApplicationDeleteRequest {
  /** 신청서 ID */
  applicationId: number
}
