/**
 * REGISTRY_CHANGE API Types
 * @generated 2025-01-27
 */

import type { ApplicantItem, PartyItem, PropertyOwnerItem } from './common.types'

/**
 * R02K-01
 * GET /api/registry/applications/{applicationId}/changes
 */
export interface GetDetailedApplicationChangesParams {
  /** 신청서ID */
  applicationId: number
}

export type GetDetailedApplicationChangesResponse = RegistryApplicationChangeResponse

/**
 * R02K-02
 * PUT /api/registry/applications/{applicationId}/changes
 */
export interface ReplaceApplicationChangesParams {
  /** 신청서ID */
  applicationId: number
}

export type ReplaceApplicationChangesRequest = RegistryApplicationChangeReplaceRequest

export type ReplaceApplicationChangesResponse = RegistryApplicationChangeResponse

// ==================== Schemas ====================

/** 등기신청인 정보 */
export interface ApplicantChangeReqItem {
  /** 신청인 ID */
  partyId: number
  /** 진행 당사자 ID (FK) */
  progressPartyId: number
}

/** 변경사항 정보 */
export interface ChangeItem {
  /** 변경사항 ID */
  changeId?: number
  /** 부동산 고유번호 */
  propertyUniqueNumber?: string
  /** 등기원인일자 */
  registryCauseDate?: string
  /** 변경구분 */
  changeType?: string
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
}

/** 변경사항 정보 */
export interface ChangeReqItem {
  /** 변경사항 ID (수정 시 필수) */
  changeId?: number
  /** 부동산 고유번호 */
  propertyUniqueNumber: string
  /** 등기원인일자 */
  registryCauseDate: string
  /** 변경구분 */
  changeType: string
  /** 해당구 */
  section: 'GAP' | 'EUL'
  /** 순위번호 */
  rankNumber: string
  /** 접수일자 */
  receiptDate: string
  /** 접수번호 */
  receiptNumber: string
  /** 등기상주소 */
  registryAddress: string
}

/** 등기명의인표시변경 정보 전체 교체 요청 */
export interface RegistryApplicationChangeReplaceRequest {
  /** 등기신청인 정보 목록 */
  applicantItems: ApplicantChangeReqItem[]
  /** 변경사항 정보 목록 */
  changeItems: ChangeReqItem[]
}

/** 등기명의인표시변경 */
export interface RegistryApplicationChangeResponse {
  /** 계약당사자 목록 (드롭다운 옵션) */
  partiesOptions?: PartyItem[]
  /** 등기신청인 목록 */
  applicantItems?: ApplicantItem[]
  /** 부동산 소유자 목록 */
  propertyOptions?: PropertyOwnerItem[]
  /** 변경사항 목록 */
  changesItems?: ChangeItem[]
}
