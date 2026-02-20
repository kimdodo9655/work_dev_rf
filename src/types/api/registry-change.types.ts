/**
 * REGISTRY_CHANGE API Types
 * @generated 2025-01-27
 */

/**
 * R02K-01
 * GET /api/registry/applications/{applicationId}/changes
 */
export interface GetDetailedApplicationChangesParams {
  applicationId: number
}

export type GetDetailedApplicationChangesResponse = RegistryApplicationChangeResponse

/**
 * R02K-02
 * PUT /api/registry/applications/{applicationId}/changes
 */
export interface ReplaceApplicationChangesParams {
  applicationId: number
}

export type ReplaceApplicationChangesRequest = RegistryApplicationChangeReplaceRequest

export type ReplaceApplicationChangesResponse = RegistryApplicationChangeResponse

// ==================== Schemas ====================

/** 계약당사자 옵션 항목 (변경) */
export interface RegistryApplicationChangePartyItem {
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

/** 등기신청인 항목 (변경 조회용) */
export interface ChangeApplicantItem {
  applicantId?: number
  progressPartyId?: number
  partyRole?: string
  partyType?: 'DOMESTIC' | 'OVERSEAS_KOREAN' | 'FOREIGNER' | 'CORPORATION'
  name?: string
  registrationNumber?: string
  contact?: string
  nationality?: string
  representativeType?: 'DOMESTIC' | 'OVERSEAS_KOREAN' | 'FOREIGNER' | 'CORPORATION'
  representativePosition?: string
  representativeName?: string
  representativeNationality?: string
  address?: string
  addressDetail?: string
}

/** 부동산 소유자 항목 (변경) */
export interface ChangePropertyOwnerItem {
  propertyUniqueNumber?: string
  progressPartyId?: number
  section?: 'GAP' | 'EUL'
  rankNumber?: string
  receiptNumber?: string
  ownerAddress?: string
  changeCount?: number
}

/** 변경사항 항목 (조회) */
export interface ChangeItem {
  changeId?: number
  propertyUniqueNumber?: string
  changeType?: string
  section?: 'GAP' | 'EUL'
  rankNumber?: string
  receiptNumber?: string
  /** 등기상 성명/법인명 */
  registryName?: string
  /** 등기상 등록번호 */
  registryRegistrationNumber?: string
  registryAddress?: string
}

/** 등기신청인 정보 (저장용) */
export interface ApplicantChangeReqItem {
  partyId: number
  progressPartyId: number
}

/** 변경사항 항목 (저장용) */
export interface ChangeReqItem {
  changeId?: number
  propertyUniqueNumber: string
  changeType: string
  section: 'GAP' | 'EUL'
  rankNumber: string
  receiptNumber: string
  registryName: string
  registryRegistrationNumber: string
  registryAddress: string
}

/** 등기명의인표시변경 전체 교체 요청 */
export interface RegistryApplicationChangeReplaceRequest {
  applicantItems: ApplicantChangeReqItem[]
  /** 등기원인일자 */
  registryCauseDate: string
  changeItems: ChangeReqItem[]
}

/** 등기명의인표시변경 조회 응답 */
export interface RegistryApplicationChangeResponse {
  /** 계약당사자 목록 (드롭다운 옵션) */
  partiesOptions?: RegistryApplicationChangePartyItem[]
  applicantItems?: ChangeApplicantItem[]
  /** 기본 항목 (동적 object) */
  basicItems?: Record<string, unknown>
  propertyOptions?: ChangePropertyOwnerItem[]
  /** 등기원인 옵션 */
  registryCauseOptions?: string[]
  changesItems?: ChangeItem[]
}
