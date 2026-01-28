/**
 * REGISTRY_HOUSING_BOND API Types
 * @generated 2025-01-27
 */

import type {
  BondPropertyItemResponse,
  BondSectionRequest,
  HousingBondResponse,
  ObligorInfo
} from './common.types'

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
 * R02Q-02
 * PUT /api/registry/progress/{registryManagementNumber}/housing-bonds/{registryType}
 */
export interface SaveHousingBondParams {
  /** 등기관리번호 */
  registryManagementNumber: string
  /** 대상 등기유형 */
  registryType:
    | 'OWNERSHIP_TRANSFER'
    | 'MORTGAGE'
    | 'SURFACE_RIGHT'
    | 'CHANGE'
    | 'CORRECTION'
    | 'MORTGAGE_CANCELLATION'
    | 'SURFACE_RIGHT_CANCELLATION'
}

export type SaveHousingBondRequest = BondSectionRequest

export type SaveHousingBondResponse = ProgressHousingBondResponse

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
  /** 채권매입금액 */
  bondPurchaseAmount?: number
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
