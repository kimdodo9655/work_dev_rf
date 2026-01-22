/**
 * 행정정보 사전동의 관련 타입 정의
 * @file src/types/domains/registry/admin-info.ts
 *
 * OpenAPI Schema 기반으로 생성됨
 * 생성일: 2025-01-16
 */

/**
 * 행정정보 사전동의서 항목
 * Schema: AdminInfoRequestItem
 */
export interface AdminInfoRequestItem {
  /** 신청서 ID */
  applicationId: number
  /** 자격자 ID */
  qualifiedId: number
  /** 행정정보 연계 시점 */
  adminInfoLinkTime: string
  /** 접수 등기소 */
  receiptOffice: string
  /** 접수번호 */
  receiptNumber: string
  /** 접수일자 */
  receiptDate: string
  /** 작성 ID */
  creationId: string
  /** 작성번호 */
  creationNumber: string
  /** 작성년도 */
  creationYear: string
  /** 작성원인 */
  creationCause: string
}

/**
 * 행정정보 사전동의 목록 아이템
 * Schema: ApplicationAdminInfoRequestListItem
 */
export interface AdminInfoRequestListItem {
  /** 행정정보 사전동의서 ID */
  adminInfoRequestId: number
  /** 신청서 ID */
  applicationId: number
  /** 등기 유형 */
  registryType: string
  /** 등기 원인 */
  registryCause: string
  /** 등기 진행 방식 */
  registryMethod: string
  /** 접수 등기소 */
  establishmentJurisdictionOffice: string
  /** 작성번호 */
  creationNumber: string
  /** 작성년도 */
  creationYear: string
}

/**
 * 행정정보 사전동의 목록 응답
 * Schema: RegistryApplicationAdminInfoRequestListResponse
 * API: GET /api/registry/applications/{managementNumber}/admin-info-requests
 */
export interface AdminInfoRequestListResponse {
  /** 행정정보 사전동의요구서 목록 */
  applicationAdminInfoRequest: AdminInfoRequestListItem[]
}

/**
 * 행정정보 사전동의 저장 요청
 * Schema: RegistryApplicationAdminInfoRequestRequest
 * API: PUT /api/registry/applications/{managementNumber}/admin-info-requests
 */
export interface AdminInfoRequestSaveRequest {
  /** 행정정보 사전동의서 정보 목록 */
  adminInfoRequestItems: AdminInfoRequestItem[]
}

/**
 * 기본 정보 항목
 * Schema: BasicInfoItem
 */
export interface BasicInfoItem {
  /** 항목 ID */
  id: string
  /** 항목명 */
  name: string
  /** 값 */
  value: string
  /** 설명 */
  description?: string
}

/**
 * 입력 정보 항목
 * Schema: InputInfoItem
 */
export interface InputInfoItem {
  /** 필드 ID */
  fieldId: string
  /** 필드명 */
  fieldName: string
  /** 필드 타입 (text, number, date, select) */
  fieldType: string
  /** 값 */
  value?: string
  /** 필수 여부 */
  required: boolean
  /** 옵션 목록 (select 타입인 경우) */
  options?: Array<{ value: string; label: string }>
  /** 플레이스홀더 */
  placeholder?: string
  /** 유효성 검사 규칙 */
  validation?: {
    pattern?: string
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
  }
}

/**
 * 행정정보 사전동의 상세 응답
 * Schema: RegistryApplicationAdminInfoRequestResponse
 * API: GET /api/registry/applications/{managementNumber}/admin-info-requests/{adminInfoRequestId}
 */
export interface AdminInfoRequestDetailResponse {
  /** 행정정보 사전동의요구서 정보 */
  adminInfoRequestItems: BasicInfoItem[]
  /** 행정정보 사전동의요구서 입력 정보 */
  adminInfoRequestInputItems: InputInfoItem[]
}

/**
 * 행정정보 동의 RPA 작업 요청
 * Schema: AdminConsentTaskRequest
 * API: POST /api/registry/rpa/user-tasks/{managementNumber}/admin-consent
 */
export interface AdminConsentTaskRequest {
  /** 신청서 ID */
  applicationId: number
}

/**
 * 행정정보 동의 대상자
 */
export interface AdminConsentTarget {
  /** 대상자 ID */
  targetId: number
  /** 성명 */
  name: string
  /** 주민등록번호 */
  registrationNumber: string
  /** 연락처 */
  phone: string
  /** 이메일 */
  email?: string
  /** 동의 여부 */
  consented: boolean
  /** 동의 일시 */
  consentedAt?: string
}

/**
 * 행정정보 동의 현황
 */
export interface AdminConsentStatus {
  /** 전체 대상자 수 */
  totalCount: number
  /** 동의 완료 수 */
  consentedCount: number
  /** 동의율 (%) */
  consentRate: number
  /** 대상자 목록 */
  targets: AdminConsentTarget[]
}
