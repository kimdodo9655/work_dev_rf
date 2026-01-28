/**
 * REGISTRY_CORRECTION API Types
 * @generated 2025-01-27
 */

import type { ApplicantItem, PartyItem, PropertyOwnerItem } from './common.types'

/**
 * R02L-01
 * GET /api/registry/applications/{applicationId}/correction
 */
export interface GetDetailedApplicationCorrectionsParams {
  /** 신청서ID */
  applicationId: number
}

export type GetDetailedApplicationCorrectionsResponse = RegistryApplicationCorrectionResponse

/**
 * R02L-02
 * PUT /api/registry/applications/{applicationId}/correction
 */
export interface ReplaceApplicationCorrectionsParams {
  /** 신청서ID */
  applicationId: number
}

export type ReplaceApplicationCorrectionsRequest = RegistryApplicationCorrectionReplaceRequest

export type ReplaceApplicationCorrectionsResponse = RegistryApplicationCorrectionResponse

// ==================== Schemas ====================

/** 등기신청인 정보 */
export interface ApplicantCorrectionReqItem {
  /** 신청인 ID */
  id: number
  /** 진행 당사자 ID (FK) */
  progressPartyId: number
}

/** 경정사항 정보 */
export interface CorrectionItem {
  /** 경정사항 ID */
  changeId?: number
  /** 부동산 고유번호 */
  propertyUniqueNumber?: string
  /** 등기원인일자 */
  registryCauseDate?: string
  /** 경정구분 */
  correctionType?: string
  /** 경정항목 */
  correctionItem?: 'NAME' | 'REGISTRATION_NUMBER' | 'HANDLING_BRANCH' | 'NATIONALITY' | 'ADDRESS'
  /** 해당구 */
  section?: 'GAP' | 'EUL'
  /** 순위번호 */
  rankNumber?: string
  /** 접수일자 */
  receiptDate?: string
  /** 접수번호 */
  receiptNumber?: string
  /** 등기상주소 */
  registryAddress?: string
  /** 성명 */
  name?: string
  /** (주민)등록번호 */
  registrationNumber?: string
  /** 취급지점 */
  handlingBranch?: string
  /** 국적 */
  nationality?: string
}

/** 경정사항 정보 */
export interface CorrectionReqItem {
  /** 부동산 고유번호 */
  propertyUniqueNumber?: string
  /** 등기원인일자 */
  registryCauseDate?: string
  /** 경정구분 */
  correctionType?: string
  /** 경정항목 */
  correctionItem?: 'NAME' | 'REGISTRATION_NUMBER' | 'HANDLING_BRANCH' | 'NATIONALITY' | 'ADDRESS'
  /** 해당구 */
  section?: 'GAP' | 'EUL'
  /** 순위번호 */
  rankNumber?: string
  /** 접수일자 */
  receiptDate?: string
  /** 접수번호 */
  receiptNumber?: string
  /** 성명(상호) */
  name?: string
  /** (주민)등록번호 */
  registrationNumber?: string
  /** 취급지점 */
  handlingBranch?: string
  /** 국적 */
  nationality?: string
  /** 등기상주소 */
  registryAddress?: string
}

/** 등기명의인표시경정 정보 전체 교체 요청 */
export interface RegistryApplicationCorrectionReplaceRequest {
  /** 등기신청인 정보 목록 */
  applicantItems: ApplicantCorrectionReqItem[]
  /** 변경사항 정보 목록 */
  correctionItems: CorrectionReqItem[]
}

/** 등기명의인표시경정 */
export interface RegistryApplicationCorrectionResponse {
  /** 경정항목 목록 */
  correctionOption?: string[]
  /** 계약당사자 목록 */
  parties?: PartyItem[]
  /** 등기신청인 목록 */
  applicantItems?: ApplicantItem[]
  /** 부동산 소유자 상세정보 */
  propertyOwners?: PropertyOwnerItem[]
  /** 경정사항 목록 */
  correctionsItems?: CorrectionItem[]
}
