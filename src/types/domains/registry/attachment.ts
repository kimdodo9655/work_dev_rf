/**
 * 첨부서면 관련 타입 정의
 * @file src/types/domains/registry/attachment.ts
 *
 * OpenAPI Schema 기반으로 생성됨
 * 생성일: 2025-01-16
 */

/**
 * 첨부서면 항목
 * Schema: AttachmentReplaceItem
 */
export interface AttachmentItem {
  /** 첨부서면 명칭 */
  attachmentName: string
  /** 제출방식 (UPLOAD: 업로드, REFERENCE: 원용, HTML: HTML양식, ADDITIONAL: 부가정보) */
  submissionMethod: string
  /** 통수 (제출방식에 따라 필수) */
  quantity?: number
  /** 임시파일명 (제출방식이 UPLOAD인 경우 필수) */
  tempFileName?: string
  /** 원용정보 (제출방식이 REFERENCE인 경우 필수) */
  referenceMethod?: string
  /** HTML양식 (제출방식이 HTML인 경우 필수) */
  htmlForm?: string
  /** 부가정보 (제출방식이 ADDITIONAL인 경우 필수) */
  additionalInfo?: string
}

/**
 * 첨부서면 항목 응답
 * Schema: RegistryApplicationAttachmentItemResponse
 */
export interface AttachmentItemResponse {
  /** 첨부서면 ID */
  attachmentId: number
  /** 첨부서면 명칭 */
  attachmentName: string
  /** 제출방식 */
  submissionMethod: string
  /** 통수 */
  quantity?: number
  /** 파일 경로 */
  filePath?: string
  /** 원용정보 */
  referenceMethod?: string
  /** HTML양식 */
  htmlForm?: string
  /** 부가정보 */
  additionalInfo?: string
}

/**
 * 첨부서면 옵션
 */
export interface AttachmentOption {
  /** 옵션 값 */
  value: string
  /** 옵션 라벨 */
  label: string
  /** 설명 */
  description?: string
}

/**
 * 첨부서면 목록 응답
 * Schema: RegistryApplicationAttachmentResponse
 * API: [R02J-01] GET /api/registry/applications/{applicationId}/attachments
 * API: [R02J-02] PUT /api/registry/applications/{applicationId}/attachments
 */
export interface AttachmentListResponse {
  /** 첨부서면 목록 */
  items: AttachmentItemResponse[]
  /** 첨부서면 옵션 목록 */
  fileRequestDocumentTypeOptions: AttachmentOption[]
  /** 제출방식 옵션 목록 */
  submissionMethodOptions: AttachmentOption[]
  /** 원용정보 옵션 목록 */
  referenceMethodOptions: AttachmentOption[]
}

/**
 * 첨부서면 저장 요청
 * Schema: RegistryApplicationAttachmentReplaceRequest
 * API: [R02J-02] PUT /api/registry/applications/{applicationId}/attachments
 */
export interface AttachmentSaveRequest {
  /** 첨부서면 정보 목록 */
  attachmentItems: AttachmentItem[]
}

/**
 * 문서 업로드 응답
 * Schema: DocumentUploadResponse
 * API: [P02F-01] POST /api/organizations/{organizationId}/branches/{branchId}/documents/temp
 * API: [R02Y-01] POST /api/registry/progress/{registryManagementNumber}/documents/temp
 */
export interface DocumentUploadResponse {
  /** 임시 파일명 (문서 저장 시 사용) */
  tempFileName: string
  /** 임시 파일 경로 */
  filePath: string
  /** 파일 크기 (bytes) */
  fileSize: number
  /** 업로드 시각 */
  uploadedAt: string
}

/**
 * 문서 다운로드 응답 (Base64)
 * Schema: DocumentDownloadBase64Response
 * API: [P02F-06] GET /api/organizations/{organizationId}/branches/{branchId}/documents/download/base64
 * API: [R00D-05] GET /api/registry/requests/{requestNumber}/documents/{fileName}/base64
 * API: [R02J-04] GET /api/registry/applications/{applicationId}/attachments/preview
 *      ... 외 3개
 */
export interface DocumentDownloadResponse {
  /** 파일명 */
  fileName: string
  /** Base64 인코딩된 파일 데이터 */
  base64Data: string
  /** MIME 타입 */
  mimeType: string
  /** 파일 크기 (bytes) */
  fileSize: number
}

/**
 * 문서 목록 항목
 * Schema: DocumentListResponse
 * API: [P02F-02] GET /api/organizations/{organizationId}/branches/{branchId}/documents
 * API: [R00D-01] GET /api/registry/requests/{requestNumber}/documents
 */
export interface DocumentListItem {
  /** 문서 종류 코드 */
  documentType: string
  /** 문서 종류명 */
  documentTypeName: string
  /** 파일명 */
  fileName: string
  /** 파일 경로 */
  filePath: string
  /** 파일 크기 (bytes) */
  fileSize: number
  /** 업로드 시각 */
  uploadedAt: string
}

/**
 * 문서 저장 요청
 * Schema: DocumentSaveRequest
 * API: [P02F-03] POST /api/organizations/{organizationId}/branches/{branchId}/documents
 * API: [R02Y-03] POST /api/registry/progress/{registryManagementNumber}/documents
 */
export interface DocumentSaveRequest {
  /** 문서 종류 */
  documentType: string
  /** 임시 파일명 (업로드 응답에서 받은 값) */
  tempFileName: string
  /** 문서명 (선택) */
  documentName?: string
}

/**
 * 문서 저장 응답
 * Schema: DocumentSaveResponse
 * API: [P02F-03] POST /api/organizations/{organizationId}/branches/{branchId}/documents
 * API: [R00D-02] POST /api/registry/requests/{requestNumber}/documents
 * API: [R02Y-03] POST /api/registry/progress/{registryManagementNumber}/documents
 */
export interface DocumentSaveResponse {
  /** 문서 ID */
  documentId: number
  /** 문서 종류 */
  documentType: string
  /** 파일명 */
  fileName: string
  /** 파일 경로 */
  filePath: string
  /** 저장 일시 */
  savedAt: string
}

/**
 * 제출방식 코드
 */
export enum SubmissionMethod {
  /** 업로드 */
  UPLOAD = 'UPLOAD',
  /** 원용 */
  REFERENCE = 'REFERENCE',
  /** HTML 양식 */
  HTML = 'HTML',
  /** 부가정보 */
  ADDITIONAL = 'ADDITIONAL'
}

/**
 * 첨부서면 종류 코드
 */
export enum AttachmentType {
  /** 계약서 */
  CONTRACT = 'CONTRACT',
  /** 위임장 */
  POWER_OF_ATTORNEY = 'POWER_OF_ATTORNEY',
  /** 인감증명서 */
  SEAL_CERTIFICATE = 'SEAL_CERTIFICATE',
  /** 주민등록등본 */
  RESIDENT_REGISTRATION = 'RESIDENT_REGISTRATION',
  /** 법인등기부등본 */
  CORPORATE_REGISTRATION = 'CORPORATE_REGISTRATION',
  /** 등기권리증 */
  REGISTRATION_CERTIFICATE = 'REGISTRATION_CERTIFICATE',
  /** 취득세 납부서 */
  ACQUISITION_TAX_RECEIPT = 'ACQUISITION_TAX_RECEIPT',
  /** 국민주택채권 매입증명서 */
  HOUSING_BOND_CERTIFICATE = 'HOUSING_BOND_CERTIFICATE',
  /** 기타 */
  OTHER = 'OTHER'
}
