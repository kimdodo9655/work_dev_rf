/**
 * REGISTRY_PROPERTY API Types
 * @generated 2025-01-27
 */

import type { BranchPrepaidCardResponse } from './common.types'

/**
 * R02F-01
 * GET /api/registry/applications/{applicationId}/properties
 */
export interface GetDetailedApplicationPropertyParams {
  /** 신청서ID */
  applicationId: number
}

export type GetDetailedApplicationPropertyResponse = RegistryApplicationPropertyResponse

/**
 * R02F-02
 * PUT /api/registry/applications/{applicationId}/properties
 */
export interface ReplaceApplicationPropertyParams {
  /** 신청서ID */
  applicationId: number
}

export type ReplaceApplicationPropertyRequest = RegistryApplicationPropertyReplaceRequest

export type ReplaceApplicationPropertyResponse = RegistryApplicationPropertyResponse

// ==================== Schemas ====================

/** 부동산 정보 항목 */
export interface PropertyItem {
  /** 부동산고유번호 */
  propertyUniqueNumber: string
  /** 부동산구분 */
  propertyType: 'LAND' | 'BUILDING' | 'COLLECTIVE_BUILDING'
  /** 관할등기소 */
  jurisdictionRegistryOffice: string
  /** 지상권설정여부 (소유권이전 시 전송여부 상관없음, null 또는 false) */
  isSurfaceRight?: boolean
  /** 부동산주소 */
  propertyAddress: string
  /** 부동산표시 */
  propertyDescription: string
}

/** 부동산 리스트 상세 조회 */
export interface RegistryApplicationPropertyItemResponse {
  /** 등기관리번호 */
  registryManagementNumber?: string
  /** 부동산고유번호 */
  propertyUniqueNumber?: string
  /** 부동산구분 */
  propertyType?: 'LAND' | 'BUILDING' | 'COLLECTIVE_BUILDING'
  /** 부동산주소 */
  propertyAddress?: string
  /** 관할등기소 */
  jurisdictionRegistryOffice?: string
  /** 부동산표시 */
  propertyDescription?: string
  /** 설정등기방식 */
  establishmentRegistryMethod?: 'ELECTRONIC' | 'E_FORM' | 'PAPER'
  /** 설정관할등기소 */
  establishmentJurisdictionOffice?: string
  /** 이전등기방식 */
  transferRegistryMethod?: 'ELECTRONIC' | 'E_FORM' | 'PAPER'
  /** 이전관할등기소 */
  transferJurisdictionOffice?: string
}

/** 부동산 정보 전체 교체 요청 */
export interface RegistryApplicationPropertyReplaceRequest {
  /** 부동산 정보 목록 */
  propertyItems: PropertyItem[]
  officeInfo?: RegistryProgressOfficeUpdateRequest
}

/** 부동산 리스트 조회 */
export interface RegistryApplicationPropertyResponse {
  /** 부동산 목록 */
  items?: RegistryApplicationPropertyItemResponse[]
  /** 선불지급수단 목록 */
  prepaidCardOptions?: BranchPrepaidCardResponse[]
  progressOfficesOptions?: RegistryProgressOfficeResponse
}

/** 등기 진행 접수등기소 정보 조회 */
export interface RegistryProgressOfficeResponse {
  /** 등기관리번호(선행/후행 제외) */
  registryManagementNumberBase?: string
  /** 이전등기방식 */
  transferRegistryMethod?: string
  /** 이전관할등기소 */
  transferJurisdictionOffice?: string
  /** 설정등기방식 */
  establishmentRegistryMethod?: string
  /** 설정관할등기소 */
  establishmentJurisdictionOffice?: string
}

/** 등기 진행 접수등기소 정보 수정 요청 */
export interface RegistryProgressOfficeUpdateRequest {
  /** 이전등기방식 */
  transferRegistryMethod?: 'ELECTRONIC' | 'E_FORM' | 'PAPER'
  /** 이전관할등기소 */
  transferJurisdictionOffice?: string
  /** 설정등기방식 */
  establishmentRegistryMethod?: 'ELECTRONIC' | 'E_FORM' | 'PAPER'
  /** 설정관할등기소 */
  establishmentJurisdictionOffice?: string
}
