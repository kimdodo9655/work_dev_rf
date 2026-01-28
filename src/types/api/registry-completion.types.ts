/**
 * REGISTRY_COMPLETION API Types
 * @generated 2025-01-27
 */

import type {
  ApiResultVoid,
  BranchPrepaidCardResponse,
  DocumentDownloadBase64Response,
  DocumentSaveResponse
} from './common.types'

/**
 * R02X-01
 * GET /api/registry/progress/{registryManagementNumber}/completion-documents/list
 */
export interface GetCompleteDocumentsParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type GetCompleteDocumentsResponse = ApiResultRegistryCompleteDocumentListResponse

/**
 * R02X-02
 * GET /api/registry/progress/{registryManagementNumber}/completion-documents/detail
 */
export interface GetDetailedCompleteDocumentsParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type GetDetailedCompleteDocumentsResponse = ApiResultRegistryCompleteDocumentResponse

/**
 * R02X-03
 * POST /api/registry/progress/{registryManagementNumber}/completion-documents/full-certificate/uploads
 */
export interface UploadCompleteFullDocumentQuery {
  /** 부동산고유번호 */
  propertyUniqueNumber: string
}

export interface UploadCompleteFullDocumentParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export interface UploadCompleteFullDocumentRequest {
  /** 업로드할 파일 */
  file: string
}

export type UploadCompleteFullDocumentResponse = ApiResultDocumentSaveResponse

/**
 * R02X-04
 * POST /api/registry/progress/{registryManagementNumber}/completion-documents/post-certificate/uploads
 */
export interface UploadCompletePostDocumentQuery {
  /** 등기유형 */
  registryType: string
  /** 부동산고유번호 */
  propertyUniqueNumber: string
  /** 권리자ID */
  partyId: number
}

export interface UploadCompletePostDocumentParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export interface UploadCompletePostDocumentRequest {
  /** 업로드할 파일 */
  file: string
}

export type UploadCompletePostDocumentResponse = ApiResultDocumentSaveResponse

/**
 * R02X-06
 * GET /api/registry/progress/{registryManagementNumber}/completion-documents/post-certificate/preview
 */
export interface ViewCompleteDocumentQuery {
  /** 파일명 */
  fileName: string
}

export interface ViewCompleteDocumentParams {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type ViewCompleteDocumentResponse = DocumentDownloadBase64Response

/**
 * R02X-07
 * DELETE /api/registry/progress/{registryManagementNumber}/completion-documents/full-certificate/{fileName}
 */
export interface DeleteDocument_2Query {
  /** 부동산고유번호 */
  propertyUniqueNumber: string
}

export interface DeleteDocument_2Params {
  /** 등기관리번호 */
  registryManagementNumber: string
  /** 파일명 */
  fileName: string
}

export type DeleteDocument_2Response = ApiResultVoid

/**
 * R02X-08
 * DELETE /api/registry/progress/{registryManagementNumber}/completion-documents/post-certificate/{fileName}
 */
export interface DeletePostCetificateDocumentQuery {
  /** 부동산고유번호 */
  propertyUniqueNumber: string
}

export interface DeletePostCetificateDocumentParams {
  /** 등기관리번호 */
  registryManagementNumber: string
  /** 파일명 */
  fileName: string
}

export type DeletePostCetificateDocumentResponse = ApiResultVoid

// ==================== Schemas ====================

export interface ApiResultDocumentSaveResponse {
  status?: number
  code?: string
  title?: string
  message?: string
  data?: DocumentSaveResponse
}

export interface ApiResultRegistryCompleteDocumentListResponse {
  status?: number
  code?: string
  title?: string
  message?: string
  data?: RegistryCompleteDocumentListResponse
}

export interface ApiResultRegistryCompleteDocumentResponse {
  status?: number
  code?: string
  title?: string
  message?: string
  data?: RegistryCompleteDocumentResponse
}

/** 등기완료문서 목록 상세 정보 */
export interface CompleteDocumentListItem {
  /** 권리자ID */
  partyId?: number
  /** 문서명 */
  documentName?: string
  /** 부동산고유번호 */
  propertyUniqueNumber?: string
  /** 등기유형 */
  registryType?: string
  /** 등기권리자 */
  obligeeName?: string
  /** 파일경로 (업로드된 경우) */
  filePath?: string
}

/** 등기사항전부증명서 항목 */
export interface FullCertificateItem {
  /** 부동산고유번호 */
  propertyUniqueNumber?: string
  /** 부동산구분 */
  propertyType?: 'LAND' | 'BUILDING' | 'COLLECTIVE_BUILDING'
  /** 관할등기소 */
  jurisdictionRegistryOffice?: string
  /** 부동산주소 */
  propertyAddress?: string
  /** 선불지급수단 옵션 목록 */
  prepaidCardOptions?: BranchPrepaidCardResponse[]
  /** 파일경로 (업로드된 경우) */
  fileName?: string
}

/** 사후 등기필정보 항목 */
export interface PostCertificateItem {
  /** 부동산고유번호 */
  propertyUniqueNumber?: string
  /** 문서명 */
  documentName?: string
  /** 등기유형 */
  registryType?:
    | 'OWNERSHIP_TRANSFER'
    | 'MORTGAGE'
    | 'SURFACE_RIGHT'
    | 'CHANGE'
    | 'CORRECTION'
    | 'MORTGAGE_CANCELLATION'
    | 'SURFACE_RIGHT_CANCELLATION'
  /** 등기권리자ID */
  progressPartyId?: number
  /** 등기권리자 */
  obligeeName?: string
  /** 파일경로 (업로드된 경우) */
  filePath?: string
}

/** 등기완료문서 목록 조회 응답 */
export interface RegistryCompleteDocumentListResponse {
  /** 등기완료문서 정보 목록 */
  completeDocument?: CompleteDocumentListItem[]
}

/** 등기완료문서 상세 조회 */
export interface RegistryCompleteDocumentResponse {
  /** 등기사항전부증명서 업로드 목록 */
  fullCertificates?: FullCertificateItem[]
  /** 사후 등기필정보 업로드 목록 */
  postCertificates?: PostCertificateItem[]
}
