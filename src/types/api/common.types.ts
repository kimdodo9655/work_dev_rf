/**
 * 공통 타입 정의
 * @file common.types.ts
 * @generated 2025-01-27
 */

// ============================================================================
// API 공통 응답
// ============================================================================

/**
 * 공통 API 응답 래퍼 (제네릭)
 * @template T - 응답 데이터 타입
 */
export interface ApiResponse<T> {
  status: number
  code: string
  title: string
  message: string
  data: T
}

export interface ApiResultVoid {
  status?: number
  code?: string
  title?: string
  message?: string
  data?: Record<string, any>
}

// ============================================================================
// Enum 타입들
// ============================================================================

/** 기관 구분 */
export type OrganizationType =
  | 'LEGAL_SCRIVENER_OFFICE'
  | 'JOINT_LEGAL_SCRIVENER'
  | 'LEGAL_SCRIVENER_CORPORATION'
  | 'LAW_OFFICE'
  | 'JOINT_LAW_OFFICE'
  | 'LAW_CORPORATION'
  | 'LAW_COOPERATIVE'

/** 자격자 구분 */
export type QualifiedType = 'LEGAL_SCRIVENER' | 'LAWYER'

/** 등기 유형 */
export type RegistryTypeForAssign = 'OWNERSHIP_TRANSFER' | 'MORTGAGE_REGISTRATION'

/** 권한 코드 */
export type RoleLevel = 'SUPER_ADMIN' | 'ADMIN' | 'ORGANIZATION_ADMIN' | 'BRANCH_ADMIN' | 'USER'

/** Action 타입 */
export type ActionType = 'ADD' | 'MODIFY' | 'DELETE'

/** 등기 방법 */
export type RegistryMethod = 'ONLINE' | 'OFFLINE'

// ============================================================================
// 공통 엔티티
// ============================================================================

/** 지점 항목 */
export interface BranchItem {
  branchId?: number
  branchName?: string
  businessRegistrationNumber?: string
}

/** 사용자 항목 */
export interface UserItem {
  userId?: number
  userName?: string
  loginId?: string
}

/** 배정 금융기관 항목 */
export interface BranchAssignedBankItem {
  registryType?: RegistryTypeForAssign
  bankCode?: string
  bankName?: string
}

/** 사용자 배정 금융기관 항목 */
export interface UserAssignedBankItem {
  registryType: RegistryTypeForAssign
  bankCode: string
}

/** 당사자 항목 */
export interface PartyItem {
  partyId?: number
  partyName?: string
  partyType?: string
}

/** 부동산 정보 */
export interface PropertyInfo {
  propertyId?: number
  address?: string
  propertyType?: string
}

/** 채무자 정보 */
export interface ObligorInfo {
  obligorId?: number
  obligorName?: string
}

/** 신청인 항목 */
export interface ApplicantItem {
  applicantId?: number
  applicantName?: string
}

/** 소유자 항목 */
export interface PropertyOwnerItem {
  ownerId?: number
  ownerName?: string
}

// ============================================================================
// 문서 관련 공통 타입
// ============================================================================

/** 문서 목록 응답 */
export interface DocumentListResponse {
  documents?: DocumentItem[]
}

/** 문서 항목 */
export interface DocumentItem {
  documentId?: number
  fileName?: string
  fileSize?: number
  uploadedAt?: string
}

/** 문서 업로드 응답 */
export interface DocumentUploadResponse {
  documentId?: number
  fileName?: string
  fileUrl?: string
}

/** 문서 저장 요청 */
export interface DocumentSaveRequest {
  documentIds?: number[]
  category?: string
}

/** 문서 저장 응답 */
export interface DocumentSaveResponse {
  savedDocuments?: number[]
  message?: string
}

/** 문서 Base64 다운로드 응답 */
export interface DocumentDownloadBase64Response {
  fileName?: string
  base64Data?: string
  mimeType?: string
}

// ============================================================================
// 기타 공통 응답
// ============================================================================

/** 등기소 인증 정보 */
export interface BranchRegistryCredentialResponse {
  credentialId?: number
  registryOfficeId?: number
  username?: string
}

/** 선불카드 응답 */
export interface BranchPrepaidCardResponse {
  cardId?: number
  cardNumber?: string
  balance?: number
}

/** 계약 당사자 상세 */
export interface ContractPartyDetail {
  partyId?: number
  partyName?: string
  partyRole?: string
  partyType?: string
}

/** 계약 당사자 응답 */
export interface ContractPartyResponse {
  parties?: ContractPartyDetail[]
}

/** 진행 당사자 옵션 */
export interface ProgressPartyOption {
  partyId?: number
  partyName?: string
}

/** 당사자 교체 요청 */
export interface RegistryApplicationPartyReplaceRequest {
  oldPartyId?: number
  newPartyId?: number
}

// ============================================================================
// 채권/세금 공통 타입
// ============================================================================

/** 등록면허세 요청 */
export interface FilingFeeRequest {
  feeAmount?: number
  feeType?: string
}

/** 등록면허세 응답 */
export interface FilingFeeResponse {
  calculatedFee?: number
  feeType?: string
}

/** 세금 정보 요청 */
export interface TaxInfoRequest {
  taxType?: string
  taxAmount?: number
}

/** 세금 정보 응답 */
export interface TaxInfoResponse {
  taxType?: string
  calculatedTax?: number
}

/** 채권 부동산 항목 */
export interface BondPropertyItem {
  propertyId?: number
  propertyAddress?: string
}

/** 채권 부동산 항목 응답 */
export interface BondPropertyItemResponse {
  properties?: BondPropertyItem[]
}

/** 채권 부동산 수정 요청 */
export interface BondPropertyUpdateRequest {
  propertyIds?: number[]
}

/** 채권 구분 요청 */
export interface BondSectionRequest {
  sectionType?: string
}

/** 주택채권 요청 */
export interface HousingBondRequest {
  bondAmount?: number
  bondType?: string
}

/** 주택채권 응답 */
export interface HousingBondResponse {
  calculatedBond?: number
  bondType?: string
}
