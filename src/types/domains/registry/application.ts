/**
 * 등기 신청서 관련 타입 정의
 * @file src/types/domains/registry/application.ts
 *
 * OpenAPI Schema 기반으로 생성됨
 * 생성일: 2025-01-16
 * 수정일: 2025-01-22 - API 방식 변경 (Request Body → Query Parameter)
 */

/**
 * 등기 신청서 생성 요청
 *
 * @deprecated API 방식이 변경되었습니다 (2025-01-22)
 *
 * **변경 사항:**
 * - 이전: Request Body로 JSON 전송
 * - 현재: Query Parameter로 전송
 *
 * **새로운 API 방식:**
 * ```
 * POST /api/registry/applications
 *   ?registryManagementNumber={string}  (필수, 신규 추가)
 *   &registryType={string}              (필수)
 *   &registryCause={string}             (필수)
 *   &registryMethod={string}            (필수)
 *   &adminInfoLinkTime={string}         (필수)
 * ```
 *
 * 이 타입은 하위 호환성을 위해 유지되지만 더 이상 API에서 사용되지 않습니다.
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
 *
 * @deprecated API 방식이 변경되었습니다 (2025-01-22)
 *
 * **변경 사항:**
 * - 이전: Request Body로 JSON 전송
 * - 현재: Query Parameter로 전송
 * - **registryType 파라미터 삭제됨** (등기 유형은 수정 불가)
 *
 * **새로운 API 방식:**
 * ```
 * PATCH /api/registry/applications/{applicationId}
 *   ?registryMethod={string}      (필수)
 *   &adminInfoLinkTime={string}   (필수)
 * ```
 *
 * 이 타입은 하위 호환성을 위해 유지되지만 더 이상 API에서 사용되지 않습니다.
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
 * API: [R02D-08] GET /api/registry/applications/tabs
 */
export interface RegistryApplicationForm {
  /** 신청서 ID */
  applicationId: number
  /** 등기관리번호 */
  registryManagementNumber: string
  /** 데이터 출처 (2025-01-22 추가) */
  dataSource?: string
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
 * API: [R02D-09] GET /api/registry/applications/{applicationId}/documents
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
 * API: [R02D-06] GET /api/registry/applications/mortgages/{registryManagementNumber}/info
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
 * API: [R02D-05] GET /api/registry/applications/{applicationId}/ownership-transfer
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
 */
export interface RegistryApplicationDeleteRequest {
  /** 신청서 ID */
  applicationId: number
}
