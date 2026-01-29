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
  /** 신청서 당사자 ID */
  partyId?: number
  /** 진행 당사자 ID */
  progressPartyId?: number
  /** 신청인 역할 */
  partyRole?: 'REGISTRY_OBLIGOR' | 'REGISTRY_OBLIGEE' | 'DEBTOR'
  /** 신청인 역할명 */
  partyRoleName?: string
  /** 당사자 구분 */
  partyType?: 'DOMESTIC' | 'OVERSEAS_KOREAN' | 'FOREIGNER' | 'CORPORATION'
  /** 당사자 구분명 */
  partyTypeName?: string
  /** 성명/법인명 */
  name?: string
  /** 주민등록번호/사업자등록번호 */
  registrationNumber?: string
  /** 연락처 */
  contact?: string
  /** 국적 */
  nationality?: string
  /** 이메일 */
  email?: string
  /** 주소 */
  address?: string
  /** 상세주소 */
  addressDetail?: string
  /** 대표자 구분 */
  representativeType?: 'DOMESTIC' | 'OVERSEAS_KOREAN' | 'FOREIGNER' | 'CORPORATION'
  /** 대표자 직책 */
  representativePosition?: string
  /** 대표자 성명 */
  representativeName?: string
  /** 대표자 국적 */
  representativeNationality?: string
  /** 채무자와 동일 여부 */
  isSameAsDebtor?: boolean
  /** 이전 지분 분모 */
  transferShareDenominator?: number
  /** 이전 지분 분자 */
  transferShareNumerator?: number
  /** 취급지점 */
  handlingBranch?: string
}

/** 계약 당사자 응답 */
export interface ContractPartyResponse {
  /** 등기의무자 목록 */
  obligors?: ContractPartyDetail[]
  /** 등기권리자 목록 */
  obligees?: ContractPartyDetail[]
  /** 채무자 목록 */
  debtors?: ContractPartyDetail[]
  /** 진행당사자 선택 옵션 */
  progressPartyOptions?: ProgressPartyOption[]
}

/** 진행 당사자 옵션 */
export interface ProgressPartyOption {
  /** 진행당사자 ID */
  progressPartyId?: number
  /** 데이터 출처 */
  dataSource?: 'REQUEST' | 'MANUAL'
  /** 당사자 구분 */
  partyType?: 'DOMESTIC' | 'OVERSEAS_KOREAN' | 'FOREIGNER' | 'CORPORATION'
  /** 성명/법인명 */
  name?: string
  /** 주민등록번호/사업자등록번호 */
  registrationNumber?: string
  /** 연락처 */
  contact?: string
  /** 국적 */
  nationality?: string
  /** 이메일 */
  email?: string
  /** 주소 */
  address?: string
  /** 상세주소 */
  addressDetail?: string
  /** 대표자 구분 */
  representativeType?: 'DOMESTIC' | 'OVERSEAS_KOREAN' | 'FOREIGNER' | 'CORPORATION'
  /** 대표자 직책 */
  representativePosition?: string
  /** 대표자 성명 */
  representativeName?: string
  /** 대표자 국적 */
  representativeNationality?: string
  /** 취급지점 */
  handlingBranch?: string
}

/** 당사자 교체 요청 */
export interface RegistryApplicationPartyReplaceRequest {
  /** 계약당사자 정보 목록 */
  partyItems: PartyItemRequest[]
}

/** 당사자 항목 요청 */
export interface PartyItemRequest {
  /** 신청서 당사자 ID */
  id?: number
  /** 진행 당사자 ID */
  progressPartyId?: number
  /** 신청인구분 */
  partyRole?: string
  /** 등록번호구분 */
  partyType?: 'DOMESTIC' | 'OVERSEAS_KOREAN' | 'FOREIGNER' | 'CORPORATION'
  /** 신청인명 */
  name?: string
  /** 주민등록번호 */
  registrationNumber?: string
  /** 연락처 */
  contact?: string
  /** 국적 */
  nationality?: string
  /** 기본주소 */
  address?: string
  /** 상세주소 */
  addressDetail?: string
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
