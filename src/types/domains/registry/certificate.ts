/**
 * 권리증/증명서 관련 타입 정의
 * @file src/types/domains/registry/certificate.ts
 *
 * OpenAPI Schema 기반으로 생성됨
 * 생성일: 2025-01-16
 */

/**
 * 선불지급수단 옵션
 * Schema: BranchPrepaidCardResponse
 */
export interface BranchPrepaidCardOption {
  /** 선불지급수단 ID */
  prepaidCardId: number
  /** 카드명 */
  cardName: string
  /** 카드번호 */
  cardNumber: string
  /** 잔액 */
  balance: number
}

/**
 * 등기사항전부증명서 항목
 * Schema: FullCertificateItem
 * API: GET /api/registry/progress/{managementNumber}/full-certificates
 */
export interface FullCertificateItem {
  /** 부동산 고유번호 */
  propertyUniqueNumber: string
  /** 부동산 구분 */
  propertyType: string
  /** 부동산 주소 */
  propertyAddress: string
  /** 관할 등기소 */
  jurisdictionRegistryOffice: string
  /** 파일 경로 (업로드된 경우) */
  filePath?: string
  /** 선불지급수단 옵션 목록 */
  prepaidCardOptions: BranchPrepaidCardOption[]
}

/**
 * 말소/이전 권리증 항목
 * Schema: CancellationCertificateItem
 */
export interface CancellationCertificateItem {
  /** 진행부동산소유자 ID */
  progressPropertyOwnerId: number
  /** 부동산 고유번호 */
  propertyUniqueNumber: string
  /** 등기 유형 */
  registryType: string
  /** 등기 원인 */
  registryCause: string
  /** 성명(명칭) */
  name: string
  /** 해당 구 (갑구/을구) */
  section?: string
  /** 순위번호 */
  rankNumber?: string
  /** 접수번호 */
  receiptNumber?: string
  /** 접수일자 */
  receiptDate?: string
  /** 등기권리증 구분 */
  certificateType?: string
  /** 일련번호 */
  certificateSerialNumber?: string
  /** 비밀번호 */
  certificatePassword?: string
  /** 비밀번호 일련번호 */
  certificatePasswordSequence?: string
}

/**
 * 말소/이전 권리증 목록 아이템
 * Schema: CancellationCertificateListItem
 */
export interface CancellationCertificateListItem {
  /** 부동산 고유번호 */
  propertyUniqueNumber: string
  /** 등기 유형 */
  registryType: string
  /** 성명(명칭) */
  name: string
  /** 접수번호 */
  receiptNumber?: string
  /** 접수일자 */
  receiptDate?: string
  /** 등기권리증 구분 */
  certificateType?: string
}

/**
 * 소유자 권리증 항목
 * Schema: PropertyOwnerCertificateItem
 */
export interface PropertyOwnerCertificateItem {
  /** 소유자 ID (당사자 ID) */
  ownerId: number
  /** 부동산 고유번호 */
  propertyUniqueNumber: string
  /** 등기권리증 구분 */
  certificateType: string
  /** 구분 (갑구/을구) */
  section: string
  /** 순위번호 */
  rankNumber: string
  /** 접수번호 */
  receiptNumber: string
  /** 접수일자 */
  receiptDate: string
  /** 일련번호 */
  certificateSerialNumber?: string
  /** 비밀번호 */
  certificatePassword?: string
  /** 비밀번호 순번 */
  certificatePasswordSequence?: string
  /** 보유지분 분자 */
  holdingShareNumerator: number
  /** 보유지분 분모 */
  holdingShareDenominator: number
  /** 이전지분 분자 */
  transferShareNumerator: number
  /** 이전지분 분모 */
  transferShareDenominator: number
}

/**
 * 소유자 권리증 항목 응답
 * Schema: PropertyOwnerCertificateItemResponse
 * API: GET /api/registry/applications/{applicationId}/property-owner-certificate
 */
export interface PropertyOwnerCertificateItemResponse {
  /** 진행 부동산 소유자 고유번호 */
  progressPropertyOwnerId: number
  /** 진행 당사자 참조 ID */
  progressPartyId: number
  /** 부동산 고유번호 */
  propertyUniqueNumber: string
  /** 등기권리증 구분 */
  certificateType: string
  /** 구분 (갑구/을구) */
  section: string
  /** 순위번호 */
  rankNumber: string
  /** 접수번호 */
  receiptNumber: string
  /** 접수일자 */
  receiptDate: string
  /** 일련번호 */
  certificateSerialNumber?: string
  /** 비밀번호 */
  certificatePassword?: string
  /** 보유지분 분자 */
  holdingShareNumerator: number
  /** 보유지분 분모 */
  holdingShareDenominator: number
  /** 이전지분 분자 */
  transferShareNumerator: number
  /** 이전지분 분모 */
  transferShareDenominator: number
}

/**
 * 이전/말소 권리증 상세 응답
 * Schema: TransferCancellationCertificateResponse
 */
export interface TransferCancellationCertificateResponse {
  /** 부동산소유자 ID */
  progressPropertyOwnerId: number
  /** 부동산 고유번호 */
  propertyUniqueNumber: string
  /** 등기 유형 */
  registryType: string
  /** 등기 원인 */
  registryCause: string
  /** 소유자명 */
  name: string
  /** 해당 구 (갑구/을구) */
  section?: string
  /** 순위번호 */
  rankNumber?: string
  /** 접수번호 */
  receiptNumber?: string
  /** 접수일자 */
  receiptDate?: string
  /** 등기권리증 구분 */
  certificateType?: string
  /** 일련번호 */
  certificateSerialNumber?: string
  /** 비밀번호 */
  certificatePassword?: string
  /** 비밀번호 순서 */
  certificatePasswordSequence?: string
  /** 비밀번호 사용 여부 */
  isUseCertificatePassword: boolean
}

/**
 * 말소 권리증 목록 응답
 * Schema: RegistryProgressCancellationCertificateListResponse
 * API: GET /api/registry/progress/{managementNumber}/cancellation-certificates
 */
export interface CancellationCertificateListResponse {
  /** 권리증 목록 */
  certificates: CancellationCertificateListItem[]
}

/**
 * 말소 권리증 상세 응답
 * Schema: RegistryProgressCancellationCertificateResponse
 * API: GET /api/registry/progress/{managementNumber}/cancellation-certificates/details
 */
export interface CancellationCertificateDetailResponse {
  /** 등기권리증 목록 */
  items: TransferCancellationCertificateResponse[]
  /** 부동산 고유번호 옵션 */
  propertyUniqueNumberOptions: string[]
  /** 소유자(성명) 옵션 */
  ownerOptions: string[]
  /** 등기 유형 옵션 */
  registryTypeOptions: string[]
  /** 등기권리증 구분 옵션 */
  certificateTypeOptions: string[]
  /** 해당 구 옵션 (갑구/을구) */
  sectionOptions: string[]
}

/**
 * 말소 권리증 저장 요청
 * Schema: RegistryProgressCancellationCertificateRequest
 * API: PUT /api/registry/progress/{managementNumber}/cancellation-certificates
 */
export interface CancellationCertificateSaveRequest {
  /** 이전/말소 등기권리증 정보 목록 */
  cancellationCertificateItems: CancellationCertificateItem[]
}

/**
 * 우편발송 권리증 항목
 * Schema: PostCertificateItem
 */
export interface PostCertificateItem {
  /** 부동산 고유번호 */
  propertyUniqueNumber: string
  /** 등기 유형 */
  registryType: string
  /** 등기권리자 */
  obligeeName: string
  /** 문서명 */
  documentName: string
  /** 파일 경로 (업로드된 경우) */
  filePath?: string
}

/**
 * 소유자 권리증 저장 요청
 * Schema: RegistryApplicationPropertyOwnerCertificateReplaceRequest
 * API: PUT /api/registry/applications/{applicationId}/property-owner-certificate
 */
export interface PropertyOwnerCertificateSaveRequest {
  /** 소유자 권리증 항목 목록 */
  propertyOwnerCertificateItems: PropertyOwnerCertificateItem[]
}

/**
 * 소유자 권리증 응답
 * Schema: RegistryApplicationPropertyOwnerCertificateResponse
 * API: GET /api/registry/applications/{applicationId}/property-owner-certificate
 */
export interface PropertyOwnerCertificateResponse {
  /** 소유자 권리증 항목 목록 */
  items: PropertyOwnerCertificateItemResponse[]
  /** 등기권리증 구분 옵션 */
  certificateTypeOptions: string[]
}
