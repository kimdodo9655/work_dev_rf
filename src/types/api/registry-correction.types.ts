/**
 * REGISTRY_CORRECTION API Types
 * @generated 2025-01-27
 */

/**
 * R02L-01
 * GET /api/registry/applications/{applicationId}/correction
 */
export interface GetDetailedApplicationCorrectionsParams {
  applicationId: number
}

export type GetDetailedApplicationCorrectionsResponse = RegistryApplicationCorrectionResponse

/**
 * R02L-02
 * PUT /api/registry/applications/{applicationId}/correction
 */
export interface ReplaceApplicationCorrectionsParams {
  applicationId: number
}

export type ReplaceApplicationCorrectionsRequest = RegistryApplicationCorrectionReplaceRequest

export type ReplaceApplicationCorrectionsResponse = RegistryApplicationCorrectionResponse

// ==================== Schemas ====================

/** 계약당사자 옵션 항목 (경정) */
export interface RegistryApplicationCorrectionPartyItem {
  id?: number
  progressPartyId?: number
  partyRole?: string
  partyType?: 'DOMESTIC' | 'OVERSEAS_KOREAN' | 'FOREIGNER' | 'CORPORATION'
  name?: string
  registrationNumber?: string
  contact?: string
  handlingBranch?: string
  nationality?: string
  representativeType?: 'DOMESTIC' | 'OVERSEAS_KOREAN' | 'FOREIGNER' | 'CORPORATION'
  representativePosition?: string
  representativeName?: string
  representativeNationality?: string
  address?: string
  addressDetail?: string
}

/** 등기신청인 항목 (경정 조회용) */
export interface CorrectionApplicantItem {
  applicantId?: number
  progressPartyId?: number
  partyRole?: string
  partyType?: 'DOMESTIC' | 'OVERSEAS_KOREAN' | 'FOREIGNER' | 'CORPORATION'
  name?: string
  registrationNumber?: string
  contact?: string
  handlingBranch?: string
  nationality?: string
  representativeType?: 'DOMESTIC' | 'OVERSEAS_KOREAN' | 'FOREIGNER' | 'CORPORATION'
  representativePosition?: string
  representativeName?: string
  representativeNationality?: string
  address?: string
  addressDetail?: string
}

/** 부동산 소유자 항목 (경정) */
export interface CorrectionPropertyOwnerItem {
  propertyUniqueNumber?: string
  progressPartyId?: number
  section?: 'GAP' | 'EUL'
  rankNumber?: string
  receiptNumber?: string
  ownerAddress?: string
  correctionCount?: number
}

/** 경정사항 항목 (조회) */
export interface CorrectionItem {
  changeId?: number
  propertyUniqueNumber?: string
  correctionType?: string
  correctionItem?: string
  section?: 'GAP' | 'EUL'
  rankNumber?: string
  receiptNumber?: string
  registryAddress?: string
  name?: string
  registrationNumber?: string
  handlingBranch?: string
  nationality?: string
  registryName?: string
  registryRegistrationNumber?: string
}

/** 등기신청인 정보 (저장용) */
export interface ApplicantCorrectionReqItem {
  id: number
  progressPartyId: number
}

/** 경정사항 항목 (저장용) */
export interface CorrectionReqItem {
  propertyUniqueNumber?: string
  registryCauseDate?: string
  correctionType?: string
  correctionItem?: string
  section?: 'GAP' | 'EUL'
  rankNumber?: string
  receiptNumber?: string
  name?: string
  registrationNumber?: string
  handlingBranch?: string
  /** 등기상 국적 */
  registryNationality?: string
  registryAddress?: string
  registryPartyType?: 'DOMESTIC' | 'OVERSEAS_KOREAN' | 'FOREIGNER' | 'CORPORATION'
  registryName?: string
  registryRegistrationNumber?: string
}

/** 등기명의인표시경정 전체 교체 요청 */
export interface RegistryApplicationCorrectionReplaceRequest {
  applicantItems: ApplicantCorrectionReqItem[]
  /** 등기원인일자 */
  registryCauseDate: string
  correctionItems: CorrectionReqItem[]
}

/** 등기명의인표시경정 조회 응답 */
export interface RegistryApplicationCorrectionResponse {
  /** 계약당사자 목록 (드롭다운 옵션) */
  partiesOptions?: RegistryApplicationCorrectionPartyItem[]
  applicantItems?: CorrectionApplicantItem[]
  /** 기본 항목 (동적 object) */
  basicItems?: Record<string, unknown>
  propertyOwnerOptions?: CorrectionPropertyOwnerItem[]
  /** 경정항목 옵션 */
  correctionOptions?: string[]
  correctionsItems?: CorrectionItem[]
}
