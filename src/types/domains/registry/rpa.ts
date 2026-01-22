/**
 * RPA 자동화 작업 관련 타입 정의
 * @file src/types/domains/registry/rpa.ts
 *
 * OpenAPI Schema 기반으로 생성됨
 * 생성일: 2025-01-16
 */

/**
 * RPA 작업 생성 응답
 * Schema: RpaUserTaskCreateResponse
 */
export interface RpaUserTaskCreateResponse {
  /** 작업 토큰 */
  taskToken: string
  /** 작업 유형 */
  taskType: string
  /** 등기관리번호 */
  registryManagementNumber: string
  /** 생성일시 */
  createdAt: string
}

/**
 * RPA 작업 상세 응답
 * Schema: RpaUserTaskResponse
 * API: GET /api/registry/rpa/user-tasks/{taskToken}
 */
export interface RpaUserTaskResponse {
  /** 작업 토큰 */
  taskToken: string
  /** 작업 유형 */
  taskType: string
  /** 등기관리번호 */
  registryManagementNumber: string
  /** 작업 상태 (PENDING, IN_PROGRESS, COMPLETED, FAILED) */
  status: string
  /** 요청 데이터 */
  requestData?: Record<string, any>
  /** 결과 데이터 */
  resultData?: Record<string, any>
  /** 에러 메시지 */
  errorMessage?: string
  /** 생성일시 */
  createdAt: string
  /** 완료일시 */
  completedAt?: string
}

/**
 * RPA 작업 결과 전달 요청
 * Schema: RpaUserTaskResultRequest
 * API: PATCH /api/registry/rpa/user-tasks/{taskToken}/result
 */
export interface RpaUserTaskResultRequest {
  /** 작업 상태 (COMPLETED, FAILED) */
  status: 'COMPLETED' | 'FAILED'
  /** 결과 데이터 */
  resultData?: Record<string, any>
  /** 에러 메시지 */
  errorMessage?: string
}

/**
 * 등기사항전부증명서 열람/발급 작업 요청
 * Schema: FullCertificateTaskRequest
 * API: POST /api/registry/rpa/user-tasks/{registryManagementNumber}/full-certificate
 */
export interface FullCertificateTaskRequest {
  /** 부동산 고유번호 목록 */
  propertyUniqueNumbers: string[]
  /** 발급 목적 */
  issuancePurpose?: string
}

/**
 * 부동산의표시 생성 작업 요청
 * Schema: PropertyDescriptionTaskRequest
 * API: POST /api/registry/rpa/user-tasks/{registryManagementNumber}/property-description
 */
export interface PropertyDescriptionTaskRequest {
  /** 부동산 고유번호 */
  propertyUniqueNumber: string
}

/**
 * 등기필정보 비밀번호 조회 작업 요청
 * Schema: RegistrationPasswordTaskRequest
 * API: POST /api/registry/rpa/user-tasks/{registryManagementNumber}/registration-password
 */
export interface RegistrationPasswordTaskRequest {
  /** 등기필정보 번호 */
  registrationNumber: string
}

/**
 * 이택스 취득세 작업 요청
 * Schema: EtaxAcquisitionTaskRequest
 * API: POST /api/registry/rpa/user-tasks/{registryManagementNumber}/etax-acquisition
 */
export interface EtaxAcquisitionTaskRequest {
  /** 신고 유형 */
  reportType: string
  /** 취득 일자 */
  acquisitionDate: string
}

/**
 * 이택스 등록면허세 작업 요청
 * Schema: EtaxRegistrationTaskRequest
 * API: POST /api/registry/rpa/user-tasks/{registryManagementNumber}/etax-registration
 */
export interface EtaxRegistrationTaskRequest {
  /** 신고 유형 */
  reportType: string
  /** 접수 일자 */
  receiptDate: string
}

/**
 * 위택스 취득세 작업 요청
 * Schema: WetaxAcquisitionTaskRequest
 * API: POST /api/registry/rpa/user-tasks/{registryManagementNumber}/wetax-acquisition
 */
export interface WetaxAcquisitionTaskRequest {
  /** 신고 유형 */
  reportType: string
  /** 취득 일자 */
  acquisitionDate: string
}

/**
 * 위택스 등록면허세 작업 요청
 * Schema: WetaxRegistrationTaskRequest
 * API: POST /api/registry/rpa/user-tasks/{registryManagementNumber}/wetax-registration
 */
export interface WetaxRegistrationTaskRequest {
  /** 신고 유형 */
  reportType: string
  /** 접수 일자 */
  receiptDate: string
}

/**
 * 등기 신청사건 조회 작업 요청
 * Schema: RegistrationCaseQueryTaskRequest
 * API: POST /api/registry/rpa/user-tasks/{registryManagementNumber}/registration-case
 */
export interface RegistrationCaseQueryTaskRequest {
  /** 접수번호 */
  receiptNumber: string
  /** 접수년도 */
  receiptYear: string
}

/**
 * 행정정보 동의요청 작업 요청
 * Schema: AdminConsentTaskRequest
 * API: POST /api/registry/rpa/user-tasks/{registryManagementNumber}/admin-consent
 */
export interface AdminConsentTaskRequest {
  /** 동의 대상자 정보 */
  consentTargets: ConsentTarget[]
}

/**
 * 동의 대상자 정보
 */
export interface ConsentTarget {
  /** 성명 */
  name: string
  /** 주민등록번호 */
  registrationNumber: string
  /** 연락처 */
  phone: string
}

/**
 * 등기신청서 작성 작업 요청
 * Schema: RegistrationApplicationTaskRequest
 * API: POST /api/registry/rpa/user-tasks/{registryManagementNumber}/registration-application
 */
export interface RegistrationApplicationTaskRequest {
  /** 신청서 ID */
  applicationId: number
  /** 등기 유형 */
  registryType: string
}

/**
 * RPA 작업 유형
 */
export enum RpaTaskType {
  /** 등기사항전부증명서 열람/발급 */
  FULL_CERTIFICATE = 'FULL_CERTIFICATE',
  /** 부동산의표시 생성 */
  PROPERTY_DESCRIPTION = 'PROPERTY_DESCRIPTION',
  /** 등기필정보 비밀번호 조회 */
  REGISTRATION_PASSWORD = 'REGISTRATION_PASSWORD',
  /** 이택스 취득세 */
  ETAX_ACQUISITION = 'ETAX_ACQUISITION',
  /** 이택스 등록면허세 */
  ETAX_REGISTRATION = 'ETAX_REGISTRATION',
  /** 위택스 취득세 */
  WETAX_ACQUISITION = 'WETAX_ACQUISITION',
  /** 위택스 등록면허세 */
  WETAX_REGISTRATION = 'WETAX_REGISTRATION',
  /** 등기 신청사건 조회 */
  REGISTRATION_CASE = 'REGISTRATION_CASE',
  /** 행정정보 동의요청 */
  ADMIN_CONSENT = 'ADMIN_CONSENT',
  /** 등기신청서 작성 */
  REGISTRATION_APPLICATION = 'REGISTRATION_APPLICATION'
}

/**
 * RPA 작업 상태
 */
export enum RpaTaskStatus {
  /** 대기 중 */
  PENDING = 'PENDING',
  /** 진행 중 */
  IN_PROGRESS = 'IN_PROGRESS',
  /** 완료 */
  COMPLETED = 'COMPLETED',
  /** 실패 */
  FAILED = 'FAILED'
}
