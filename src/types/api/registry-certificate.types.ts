/**
 * REGISTRY_CERTIFICATE API Types
 * @generated 2025-01-27
 */

/**
 * R02G-01
 * GET /api/registry/applications/{applicationId}/certificates
 */
export interface GetDetailedPropertyOwnerCertificateParams {
  /** 신청서ID */
  applicationId: number
}

export type GetDetailedPropertyOwnerCertificateResponse =
  RegistryApplicationPropertyOwnerCertificateResponse

/**
 * R02G-02
 * PUT /api/registry/applications/{applicationId}/certificates
 */
export interface ReplaceApplicationPropertyOwnerCertificateParams {
  /** 신청서ID */
  applicationId: number
}

export type ReplaceApplicationPropertyOwnerCertificateRequest =
  RegistryApplicationPropertyOwnerCertificateReplaceRequest

export type ReplaceApplicationPropertyOwnerCertificateResponse =
  RegistryApplicationPropertyOwnerCertificateResponse

// ==================== Schemas ====================

/** 당사자(의무자) 옵션 */
export interface PartyOption {
  /** 당사자ID */
  partyId?: number
  /** 진행 계약 당사자ID */
  progressPartyId?: number
  /** 성명 */
  name?: string
}

/** 등기권리증 정보 항목 */
export interface PropertyOwnerCertificateItem {
  /** 부동산고유번호 */
  propertyUniqueNumber: string
  /** 소유자아이디(당사자ID) */
  ownerId: number
  /** 보유지분 분모 */
  holdingShareDenominator: number
  /** 보유지분 분자 */
  holdingShareNumerator: number
  /** 이전지분 분모 */
  transferShareDenominator: number
  /** 이전지분 분자 */
  transferShareNumerator: number
  /** 구분 (갑구/을구) */
  section: 'GAP' | 'EUL'
  /** 순위번호 */
  rankNumber: string
  /** 접수일자 */
  receiptDate: string
  /** 접수번호 */
  receiptNumber: string
  /** 등기권리증 구분 */
  certificateType:
    | 'REGISTRY_CERT_INFO'
    | 'REGISTRY_CERTIFICATE'
    | 'CONFIRMATION_DOCUMENT'
    | 'PRIOR_REGISTRY_LINK'
  /** 일련번호 */
  certificateSerialNumber?: string
  /** 비밀번호 순번 */
  certificatePasswordSequence?: string
  /** 비밀번호 */
  certificatePassword?: string
}

/** 등기권리증 정보 조회 */
export interface PropertyOwnerCertificateItemResponse {
  /** 부동산고유번호 */
  propertyUniqueNumber?: string
  /** 보유지분 분모 */
  holdingShareDenominator?: number
  /** 보유지분 분자 */
  holdingShareNumerator?: number
  /** 이전지분 분모 */
  transferShareDenominator?: number
  /** 이전지분 분자 */
  transferShareNumerator?: number
  /** 진행 부동산 소유자 고유번호 */
  progressPropertyOwnerId?: number
  /** 진행 당사자 참조 ID */
  progressPartyId?: number
  /** 구분 */
  section?: string
  /** 순위번호 */
  rankNumber?: string
  /** 접수일자 */
  receiptDate?: string
  /** 접수번호 */
  receiptNumber?: string
  /** 등기권리증 구분 */
  certificateType?: string
  /** 일련번호 */
  certificateSerialNumber?: string
  /** 비밀번호 */
  certificatePassword?: string
}

/** 부동산고유번호 옵션 */
export interface PropertyUniqueNumberOption {
  /** 신청서ID */
  applicationId?: number
  /** 부동산고유번호 */
  propertyUniqueNumber?: string
}

/** 등기권리증 정보 전체 교체 요청 */
export interface RegistryApplicationPropertyOwnerCertificateReplaceRequest {
  /** 등기권리증 정보 목록 */
  certificateItems: PropertyOwnerCertificateItem[]
}

/** 등기권리증 정보 조회 */
export interface RegistryApplicationPropertyOwnerCertificateResponse {
  /** 등기권리증 목록 */
  items?: PropertyOwnerCertificateItemResponse[]
  /** 부동산 고유번호 옵션 (부동산 테이블) */
  propertyUniqueNumberOptions?: PropertyUniqueNumberOption[]
  /** 소유자(성명) 옵션 (의무자) */
  ownerOptions?: PartyOption[]
  /** 해당구 옵션 (Enum) */
  sectionOptions?: string[]
  /** 등기권리증 구분 옵션 (Enum) */
  certificateTypeOptions?: string[]
}
