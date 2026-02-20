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
  branchName: string
  businessRegistrationNumber: string
  phone: string
  extension?: string
  address: string
  qualifiedType: 'LEGAL_SCRIVENER' | 'LAWYER'
  qualifiedName: string
  businessLicenseFileName: string
  insuranceCertificateFileName?: string
}

/** 사용자 항목 */
export interface UserItem {
  name: string
  position: string
  roleLevel: number
  phone: string
  extension?: string
  email: string
  loginId: string
  password: string
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
  propertyClassification?: string
  propertyCount?: number
  propertyAddress?: string
  propertyArea?: number
  seniorRepaymentCount?: number
}

/** 채무자 정보 */
export interface ObligorInfo {
  obligorCount?: number
  eSignatureStatus?: string
  certificateStatus?: string
  addressChangeCount?: number
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

/** 문서 목록 응답 (단건) */
export interface DocumentListResponse {
  /** 문서 종류 코드 */
  documentType?: string
  /** 문서 종류명 */
  documentTypeName?: string
  /** 파일명 */
  fileName?: string
  /** 파일 경로 */
  filePath?: string
  /** 파일 크기 (bytes) */
  fileSize?: number
  /** 업로드 일시 */
  uploadedAt?: string
}

/** 문서 임시 업로드 응답 */
export interface DocumentUploadResponse {
  /** 임시 파일명 (저장 시 사용) */
  tempFileName?: string
  /** 파일 경로 */
  filePath?: string
  /** 파일 크기 (bytes) */
  fileSize?: number
  /** 업로드 일시 */
  uploadedAt?: string
}

/** 문서 저장 요청 */
export interface DocumentSaveRequest {
  /** 임시 업로드 파일명 */
  tempFileName: string
  /** 기존 파일 백업 여부 */
  backup: boolean
}

/** 문서 저장 응답 */
export interface DocumentSaveResponse {
  /** 문서 종류 코드 */
  documentType?: string
  /** 파일명 */
  fileName?: string
  /** 파일 경로 */
  filePath?: string
  /** 파일 크기 (bytes) */
  fileSize?: number
  /** 저장 일시 */
  savedAt?: string
}

/** 문서 Base64 다운로드 응답 */
export interface DocumentDownloadBase64Response {
  /** 파일명 */
  fileName?: string
  /** 파일 크기 (bytes) */
  fileSize?: number
  /** MIME 타입 */
  mimeType?: string
  /** Base64 인코딩 데이터 */
  base64Data?: string
}

// ============================================================================
// 기타 공통 응답
// ============================================================================

/** 인터넷등기소 아이디 응답 */
export interface BranchRegistryCredentialResponse {
  /** 인증정보 고유번호 */
  credentialId?: number
  /** 지점 ID */
  branchId?: number
  qualifiedType?: QualifiedType
  /** 자격자 구분 설명 */
  qualifiedTypeDescription?: string
  /** 자격자명 */
  qualifiedName?: string
  /** 인터넷등기소 로그인 아이디 */
  registryLoginId?: string
  /** 인터넷등기소 비밀번호 */
  registryPassword?: string
}

/** 선불지급수단 응답 */
export interface BranchPrepaidCardResponse {
  /** 선불지급수단 고유번호 */
  id?: number
  /** 지점 ID */
  branchId?: number
  /** 카드번호 */
  cardNumber?: string
  /** 카드 비밀번호 */
  cardPassword?: string
  /** 사용처 */
  usageAgency?: string
  /** 사용목적 */
  usagePurpose?: string
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
  /** 소유형태 */
  ownershipType?: 'SOLE' | 'CO_OWNERSHIP' | 'JOINT_OWNERSHIP'
  /** 소유형태명 */
  ownershipTypeName?: string
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

/** 당사자 항목 요청 (계약 당사자 교체용) */
export interface RegistryApplicationPartyItem {
  action: ActionType
  partyId?: number
  progressPartyId?: number
  partyRole?: string
  partyType?: 'DOMESTIC' | 'OVERSEAS_KOREAN' | 'FOREIGNER' | 'CORPORATION'
  name?: string
  registrationNumber?: string
  contact?: string
  nationality?: string
  email?: string
  address?: string
  addressDetail?: string
  representativeType?: 'DOMESTIC' | 'OVERSEAS_KOREAN' | 'FOREIGNER' | 'CORPORATION'
  representativePosition?: string
  representativeName?: string
  representativeNationality?: string
  isSameAsDebtor?: boolean
  ownershipType?: 'SOLE' | 'CO_OWNERSHIP' | 'JOINT_OWNERSHIP'
  transferShareDenominator?: number
  transferShareNumerator?: number
  handlingBranch?: string
}

/** 당사자 교체 요청 */
export interface RegistryApplicationPartyReplaceRequest {
  /** 계약당사자 정보 목록 */
  partyItems: RegistryApplicationPartyItem[]
}

// ============================================================================
// 채권/세금 공통 타입
// ============================================================================

/** 등록면허세 요청 */
export interface FilingFeeRequest {
  /** 납부여부 */
  paymentStatus: 'PAYMENT' | 'EXEMPTION'
  /** 면제사유 */
  exemptionReason?: string
  /** 등기방식 */
  registryMethod: 'ELECTRONIC' | 'E_FORM' | 'PAPER'
  /** 등기건수 */
  registryCount?: number
  /** 수수료 */
  applicationFee?: number
}

/** 등록면허세 응답 */
export interface FilingFeeResponse {
  applicationId?: number
  paymentStatus?: 'PAYMENT' | 'EXEMPTION'
  exemptionReason?: string
  registryMethod?: 'ELECTRONIC' | 'E_FORM' | 'PAPER'
  registryCount?: number
  applicationFee?: number
}

/** 세금 정보 요청 */
export interface TaxInfoRequest {
  paymentStatus: 'PAYMENT' | 'EXEMPTION'
  exemptionReason?: string
  acquisitionTax?: number
  registrationLicenseTax?: number
  educationTax?: number
  ruralSpecialTax?: number
  paymentAgency?: string
  paymentAmount?: number
  taxNumber?: string
  electronicPaymentNumber?: string
}

/** 세금 정보 응답 */
export interface TaxInfoResponse {
  applicationId?: number
  paymentStatus?: 'PAYMENT' | 'EXEMPTION'
  exemptionReason?: string
  acquisitionTax?: number
  registrationLicenseTax?: number
  educationTax?: number
  ruralSpecialTax?: number
  paymentAgency?: string
  paymentAmount?: number
  taxNumber?: string
  electronicPaymentNumber?: string
  totalAmount?: number
  registryType?:
    | 'OWNERSHIP_TRANSFER'
    | 'MORTGAGE'
    | 'SURFACE_RIGHT'
    | 'CHANGE'
    | 'CORRECTION'
    | 'MORTGAGE_CANCELLATION'
    | 'SURFACE_RIGHT_CANCELLATION'
}

/** 채권 부동산 항목 (저장 요청용) */
export interface BondPropertyItem {
  /** 부동산 고유번호 */
  propertyId: string
  request: BondPropertyUpdateRequest
}

/** 채권 부동산 항목 (조회 응답) */
export interface BondPropertyItemResponse {
  propertyId?: string
  propertyType?: 'LAND' | 'BUILDING' | 'COLLECTIVE_BUILDING'
  propertyAddress?: string
  officialLandPrice?: number
  area?: number
  standardMarketPrice?: number
  bondPurchaseType?: 'PURCHASE' | 'DISCOUNT' | 'EXEMPTION'
  bondExemptionReason?: string
  bondPurchaseAmount?: number
}

/** 채권 부동산 수정 요청 */
export interface BondPropertyUpdateRequest {
  /** 국민주택채권 매입 구분 */
  bondPurchaseType: 'PURCHASE' | 'DISCOUNT' | 'EXEMPTION'
  /** 감면 사유 */
  bondExemptionReason?: string
  /** 채권 매입 금액 */
  bondPurchaseAmount?: number
  /** 공시지가 */
  officialLandPrice?: number
  /** 면적 */
  area?: number
  /** 시가표준액 */
  standardMarketPrice?: number
}

/** 주택채권 요청 */
export interface HousingBondRequest {
  /** 국민주택채권 매입 구분 */
  purchaseType: 'PURCHASE' | 'DISCOUNT' | 'EXEMPTION'
  /** 감면 사유 */
  exemptionReason?: string
  /** 할인율 */
  discountRate?: number
  /** 채권할인금액 */
  bondDiscountAmount?: number
  /** 채권매입금액 */
  bondPurchaseAmount?: number
  /** 주택채권번호 */
  housingBondNumber?: string
}

/** 주택채권 조회 응답 */
export interface HousingBondResponse {
  applicationId?: number
  registryManagementNumber?: string
  purchaseType?: 'PURCHASE' | 'DISCOUNT' | 'EXEMPTION'
  exemptionReason?: string
  discountRate?: number
  bondDiscountAmount?: number
  bondPurchaseAmount?: number
  housingBondNumber?: string
  maximumCreditAmount?: number
}

/** 채권 구분 저장 요청 */
export interface BondSectionRequest {
  application: HousingBondRequest
  properties: BondPropertyItem[]
}
