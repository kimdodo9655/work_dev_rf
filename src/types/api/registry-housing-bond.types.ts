/**
 * 문서 경로: `@/src/types/api/registry-housing-bond.types.ts`
 * 문서 제목: 타입 정의: registry-housing-bond-types
 */

/**
 * REGISTRY_HOUSING_BOND API Types
 * @generated 2025-01-27
 */

import type { BondPropertyItemResponse, HousingBondResponse, ObligorInfo } from './common.types'

/**
 * R02Q-01
 * GET /api/registry/progress/{registryManagementNumber}/housing-bonds/detail
 */
export interface GetHousingBondDetailsParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type GetHousingBondDetailsResponse = ProgressHousingBondResponse

/**
 * R02Q-03
 * GET /api/registry/progress/{registryManagementNumber}/housing-bonds/list
 */
export interface GetHousingBondListParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type GetHousingBondListResponse = RegistryProgressHousingBondListResponse

/**
 * R02Q-02
 * PUT /api/registry/progress/{registryManagementNumber}/housing-bonds
 */
export interface SaveHousingBondParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type SaveHousingBondRequest = ProgressHousingBondSaveRequest

export type SaveHousingBondResponse = ProgressHousingBondResponse

/** 등기유형별 국민주택채권 저장 요청 */
export interface ProgressHousingBondSaveRequest {
  /** 등기유형별 국민주택채권 저장 항목 목록 */
  items: ProgressHousingBondSaveItem[]
}

export type ProgressHousingBondSaveItem = Record<string, unknown>

// ==================== Schemas ====================

/** 등기유형별 국민주택채권 정보 */
export interface HousingBondCase {
  /** 신청서 ID */
  applicationId?: number
  /** 등기유형 */
  registryType?:
    | 'OWNERSHIP_TRANSFER'
    | 'MORTGAGE'
    | 'SURFACE_RIGHT'
    | 'CHANGE'
    | 'CORRECTION'
    | 'MORTGAGE_CANCELLATION'
    | 'SURFACE_RIGHT_CANCELLATION'
  /** 등기원인 */
  registryCause?:
    | 'TRADE'
    | 'ESTABLISHMENT_CONTRACT'
    | 'ADDRESS_CHANGE'
    | 'ROAD_NAME_ADDRESS'
    | 'APPLICATION_ERROR'
    | 'TERMINATION'
  /** 매입대상금액 */
  purchaseTargetAmount?: number
  /** 매입구분 */
  purchaseType?: 'PURCHASE' | 'DISCOUNT' | 'EXEMPTION'
  /** 채권매입금액 */
  bondPurchaseAmount?: number
  /** 면제사유 */
  exemptionReason?: string
  /** 채권할인금액 */
  bondDiscountAmount?: number
  /** 국민주택채권번호 */
  housingBondNumber?: string
  /** 채권할인율 */
  bondDiscountRate?: number
  /** 자동작성 가능 여부 */
  autoGenerationAvailable?: boolean
  housingBond?: HousingBondResponse
  /** 부동산별 국민주택채권 목록 */
  properties?: BondPropertyItemResponse[]
  /** 등기의무자 정보 */
  obligors?: ObligorInfo[]
}

/** 등기진행 국민주택채권 조회 응답 */
export interface ProgressHousingBondResponse {
  /** 등기관리번호 */
  registryManagementNumber?: string
  /** 국민주택채권 자동작성 가능 여부 */
  autoGenerationAvailable?: boolean
  /** 등기유형별 국민주택채권 목록 */
  cases?: HousingBondCase[]
}

/** 국민주택채권 목록 응답 */
export interface RegistryProgressHousingBondListResponse {
  /** 등기관리번호 */
  registryManagementNumber?: string
  /** 국민주택채권 목록 행 */
  rows?: HousingBondListRow[]
}

/** 국민주택채권 목록 행 정보 */
export interface HousingBondListRow {
  /** 신청서 ID */
  applicationId?: number
  /** 등기유형(설명) */
  registryType?: string
  /** 매입 구분 (채권할인/채권면제) */
  purchaseType?: string
  /** 매입대상금액 */
  purchaseTargetAmount?: number
  /** 채권매입금액 */
  bondPurchaseAmount?: number
  /** 채권할인금액 (채권면제 시 '-') */
  bondDiscountAmount?: string
  /** 국민주택채권번호 (채권면제 시 '-') */
  housingBondNumber?: string
}
