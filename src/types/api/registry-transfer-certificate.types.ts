/**
 * REGISTRY_TRANSFER_CERTIFICATE API Types
 * @generated 2025-01-27
 */

/**
 * R02S-01
 * GET /api/registry/progress/{registryManagementNumber}/transfer-cancellation-certificates
 */
export interface GetProgressCancellationCertificatesParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type GetProgressCancellationCertificatesResponse =
  RegistryProgressCancellationCertificateListResponse

/**
 * R02S-02
 * PUT /api/registry/progress/{registryManagementNumber}/transfer-cancellation-certificates
 */
export interface ReplaceProgressCancellationCertificatesParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type ReplaceProgressCancellationCertificatesRequest =
  RegistryProgressCancellationCertificateRequest

export type ReplaceProgressCancellationCertificatesResponse =
  RegistryProgressCancellationCertificateResponse

/**
 * R02S-03
 * GET /api/registry/progress/{registryManagementNumber}/transfer-cancellation-certificates/detail
 */
export interface GetDetailedProgressCancellationCertificatesParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type GetDetailedProgressCancellationCertificatesResponse =
  RegistryProgressCancellationCertificateResponse

// ==================== Schemas ====================

/** 말소 등기권리증 정보 전체 교체 요청 */
export interface CancellationCertificateItem {
  /** 등기유형 */
  registryType:
    | 'OWNERSHIP_TRANSFER'
    | 'MORTGAGE'
    | 'SURFACE_RIGHT'
    | 'CHANGE'
    | 'CORRECTION'
    | 'MORTGAGE_CANCELLATION'
    | 'SURFACE_RIGHT_CANCELLATION'
  /** 진행부동산소유자아이디 */
  progressPropertyOwnerId: number
  /** 등기원인 */
  registryCause: string
  /** 부동산고유번호 */
  propertyUniqueNumber: string
  /** 성명(명칭) */
  name: string
  /** 해당구 (갑구/을구) */
  section?: 'GAP' | 'EUL'
  /** 순위번호 */
  rankNumber?: string
  /** 접수일자 */
  receiptDate?: string
  /** 접수번호 */
  receiptNumber?: string
  /** 등기권리증 구분 */
  certificateType?:
    | 'REGISTRY_CERT_INFO'
    | 'REGISTRY_CERTIFICATE'
    | 'CONFIRMATION_DOCUMENT'
    | 'PRIOR_REGISTRY_LINK'
  /** 일련번호 */
  certificateSerialNumber?: string
  /** 비밀번호일련번호 */
  certificatePasswordSequence?: string
  /** 비밀번호 */
  certificatePassword?: string
}

/** 이전/말소 등기권리증 목록 조회 */
export interface CancellationCertificateListItem {
  /** 등기유형 */
  registryType?: string
  /** 부동산고유번호 */
  propertyUniqueNumber?: string
  /** 성명(명칭) */
  name?: string
  /** 접수일자 */
  receiptDate?: string
  /** 접수번호 */
  receiptNumber?: string
  /** 등기권리증 구분 */
  certificateType?:
    | 'REGISTRY_CERT_INFO'
    | 'REGISTRY_CERTIFICATE'
    | 'CONFIRMATION_DOCUMENT'
    | 'PRIOR_REGISTRY_LINK'
}

/** 말소 등기권리증 목록 조회 */
export interface RegistryProgressCancellationCertificateListResponse {
  /** 권리증 목록 */
  certificates?: CancellationCertificateListItem[]
}

/** 이전/말소 등기권리증 정보 전체 교체 요청 */
export interface RegistryProgressCancellationCertificateRequest {
  /** 이전/말소 등기권리증 정보 목록 */
  cancellationCertificateItems: CancellationCertificateItem[]
}

/** 이전/말소 등기권리증 정보 조회 */
export interface RegistryProgressCancellationCertificateResponse {
  /** 등기유형 옵션 */
  registryTypeOptions?: string[]
  /** 부동산 고유번호 옵션 */
  propertyUniqueNumberOptions?: string[]
  /** 소유자(성명) 옵션 (등록된 소유자) */
  ownerOptions?: string[]
  /** 해당구 옵션 (Enum) */
  sectionOptions?: string[]
  /** 등기권리증 구분 옵션 (Enum) */
  certificateTypeOptions?: string[]
  /** 등기권리증 목록 */
  items?: TransferCancellationCertificateResponse[]
}

/** 이전/말소 등기권리증 정보 응답 */
export interface TransferCancellationCertificateResponse {
  /** 등기유형 */
  registryType?: string
  /** 부동산소유자아이디 */
  progressPropertyOwnerId?: number
  /** 등기원인 */
  registryCause?: string
  /** 부동산 고유번호 */
  propertyUniqueNumber?: string
  /** 소유자명 */
  name?: string
  /** 해당 구 (갑구/을구) */
  section?: 'GAP' | 'EUL'
  /** 순위번호 */
  rankNumber?: string
  /** 접수일자 */
  receiptDate?: string
  /** 접수번호 */
  receiptNumber?: string
  /** 등기권리증 구분 */
  certificateType?:
    | 'REGISTRY_CERT_INFO'
    | 'REGISTRY_CERTIFICATE'
    | 'CONFIRMATION_DOCUMENT'
    | 'PRIOR_REGISTRY_LINK'
  /** 일련번호 */
  certificateSerialNumber?: string
  /** 비밀번호 순서 */
  certificatePasswordSequence?: string
  /** 비밀번호 */
  certificatePassword?: string
  /** 비밀번호사용여부 */
  isUseCertificatePassword?: boolean
}
