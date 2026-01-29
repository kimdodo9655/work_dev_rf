/**
 * REGISTRY_SIGNATURE API Types
 * @generated 2025-01-27
 */

/**
 * R02O-01
 * GET /api/registry/progress/{registryManagementNumber}/e-signatures/detail
 */
export interface GetDetailedESignaturesQuery {
  /** 이전/설정 구분유형 */
  registryType: 'OWNERSHIP_TRANSFER' | 'MORTGAGE_REGISTRATION'
}

export interface GetDetailedESignaturesParams {
  /** 등기관리번호 (15자리) */
  registryManagementNumber: string
}

export type GetDetailedESignaturesResponse = RegistryProgressESignatureResponse

/**
 * R02O-02
 * POST /api/registry/progress/{registryManagementNumber}/e-signatures/{eSignatureId}/request
 */
export interface RequestESignatureParams {
  /** 등기관리번호 (15자리) */
  registryManagementNumber: string
  /** 전자서명 ID */
  eSignatureId: number
}

export type RequestESignatureResponse = RegistryProgressESignatureResponse

/**
 * R02O-03
 * POST /api/registry/progress/{registryManagementNumber}/e-signatures/{eSignatureId}/complete
 */
export interface CompleteESignatureParams {
  /** 등기관리번호 (15자리) */
  registryManagementNumber: string
  /** 전자서명 ID */
  eSignatureId: number
}

export type CompleteESignatureRequest = RegistryProgressESignatureCompleteRequest

export type CompleteESignatureResponse = RegistryProgressESignatureResponse

/**
 * R02O-04
 * POST /api/registry/progress/{registryManagementNumber}/e-signatures/{eSignatureId}/re-request
 */
export interface ReRequestESignatureParams {
  /** 등기관리번호 (15자리) */
  registryManagementNumber: string
  /** 전자서명 ID */
  eSignatureId: number
}

export type ReRequestESignatureResponse = RegistryProgressESignatureResponse

/**
 * R02O-05
 * GET /api/registry/progress/{registryManagementNumber}/e-signatures/list
 */
export interface GetESignaturesQuery {
  /** 이전/설정 구분유형 */
  registryType: 'OWNERSHIP_TRANSFER' | 'MORTGAGE_REGISTRATION'
}

export interface GetESignaturesParams {
  /** 등기관리번호 (15자리) */
  registryManagementNumber: string
}

export type GetESignaturesResponse = RegistryProgressESignatureResponse

// ==================== Schemas ====================

/** 전자서명 완료 요청 */
export interface RegistryProgressESignatureCompleteRequest {
  /** 인증서 만료일 */
  certificateExpiryDate?: string
  /** 전자서명 검증 결과 */
  verificationResult?: string
}

/** 전자서명 대상 서류 */
export interface RegistryProgressESignatureDocumentResponse {
  /** 문서 ID */
  documentId?: number
  /** 문서명 */
  documentName?: string
}

/** 전자서명 진행 정보 */
export interface RegistryProgressESignatureResponse {
  /** 전자서명 ID */
  eSignatureId?: number
  /** 당사자 구분 코드 */
  partyRole?: string
  /** 당사자 구분명 */
  partyRoleName?: string
  /** 성명(명칭) */
  name?: string
  /** 서명 방식 코드 */
  signatureMethod?: 'DIRECT' | 'DELEGATED'
  /** 서명 방식명 */
  signatureMethodName?: string
  /** 서명 상태 코드 */
  signatureStatus?: string
  /** 서명 상태명 */
  signatureStatusName?: string
  /** 서명 요청일시 */
  signatureRequestedAt?: string
  /** 서명 완료일시 */
  signatureCompletedAt?: string
  /** 인증서 만료일 */
  certificateExpiryDate?: string
  /** 검증 결과 */
  verificationResult?: string
  /** 등기유형 */
  registryType?: 'OWNERSHIP_TRANSFER' | 'MORTGAGE_REGISTRATION'
  /** 전자서명 대상 서류 목록 */
  documents?: RegistryProgressESignatureDocumentResponse[]
}
