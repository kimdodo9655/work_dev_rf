/**
 * 문서 경로: `@/src/types/api/registry-type.types.ts`
 * 문서 제목: 타입 정의: registry-type-types
 */

/**
 * REGISTRY_TYPE API Types
 * @generated 2025-01-27
 */

import type { ApiResultVoid, RegistryApplicationRole, RegistryMethod } from './common.types'
import type {
  ContractPartyReplaceResponse,
  MortgageContractSaveResponse,
  OwnershipContractSaveResponse,
  RegistryCertificateFormResponse,
  SurfaceRightContractSaveResponse
} from './registry-contract.types'
import type { TaxSection } from './registry-receipt-document.types'
import type { RegistryProgressTaxAgencyListResponse } from './registry-tax-report.types'

/**
 * R02D-02
 * POST /api/registry/applications
 */
export type CreateRegistryApplicationRequest = RegistryApplicationCreateRequest

export type CreateRegistryApplicationResponse = ApiResultVoid

/**
 * R02D-03
 * DELETE /api/registry/applications/{applicationId}
 */
export interface DeleteRegistryApplicationParams {
  /** 신청서ID */
  applicationId: number
}

export type DeleteRegistryApplicationResponse = ApiResultVoid

/**
 * R02D-04
 * PATCH /api/registry/applications/{applicationId}
 */
export interface UpdateRegistryApplicationParams {
  /** 신청서ID */
  applicationId: number
}

export type UpdateRegistryApplicationRequest = RegistryApplicationUpdateRequest

export type UpdateRegistryApplicationResponse = ApiResultVoid

/**
 * R02D-08
 * GET /api/registry/applications/tabs
 */
export interface GetRegistryApplicationFormsQuery {
  /** 등기관리번호 */
  registryManagementNumber: string
}

export type GetRegistryApplicationFormsResponse = RegistryApplicationFormResponse

/**
 * R02D-09
 * GET /api/registry/applications/{applicationId}/documents
 */
export interface GetApplicationDocumentsParams {
  /** 신청서 ID */
  applicationId: number
}

export type GetApplicationDocumentsResponse = RegistryApplicationDocumentResponse

/**
 * R02D-10
 * GET /api/registry/applications/{applicationId}/forms/unified
 */
export interface GetUnifiedApplicationFormParams {
  /** 신청서 ID */
  applicationId: number
}

export type GetUnifiedApplicationFormResponse = UnifiedApplicationFormResponse

// ==================== Schemas ====================

/** 행정정보 연계 시점 */
export type AdminInfoLinkTime = 'BEFORE_SUBMISSION' | 'AFTER_SUBMISSION'

export interface RegistryApplicationCreateRequest {
  /** 등기 관리번호 */
  registryManagementNumber: string
  registryType: RegistryType
  registryCause: RegistryCause
  registryMethod: RegistryMethod
  adminInfoLinkTime: AdminInfoLinkTime
}

/** 등기신청서 전자문서 응답 */
export interface RegistryApplicationDocumentResponse {
  /** 신청서 ID */
  applicationId?: number
  /** 등기관리번호 */
  registryManagementNumber?: string
  /** 등기유형 */
  registryType?: string
  /** 등기원인 */
  registryCause?: string
  /** 등기방식 */
  registryMethod?: string
  /** 행정정보 연계 시점 */
  adminInfoLinkTime?: string
  /** 등기유형별 섹션 목록 */
  sections?: RegistryApplicationDocumentSectionResponse[]
}

/** 등기신청서 전자문서 섹션 정보 */
export interface RegistryApplicationDocumentSectionResponse {
  /** 섹션 코드 */
  code?: string
  /** 섹션 제목 */
  title?: string
}

export interface RegistryApplicationFormResponse {
  applicationId?: number
  registryManagementNumber?: string
  dataSource?: 'REQUEST' | 'MANUAL'
  registryType?: string
  /** 등기 역할 */
  registryRole?: RegistryApplicationRole
  registryCause?: string
  registryMethod?: RegistryMethod
  adminInfoLinkTime?: string
}

export interface RegistryApplicationUpdateRequest {
  registryMethod: RegistryMethod
  adminInfoLinkTime: AdminInfoLinkTime
}

/** 등기신청서 - 말소사항정보 */
export interface ApplicationCancellationFormResponse {
  /** 말소사항 */
  cancellationContent?: string
}

/** 등기신청서 - 등기필정보 */
export interface ApplicationCertificateFormResponse {
  /** 부동산 고유번호 */
  propertyUniqueNumber?: string
  /** 성명(명칭) */
  ownerName?: string
  /** 일련번호 */
  certificateSerialNumber?: string
  /** 비밀번호 (순번 2자리 + 비밀번호조합) */
  certificatePassword?: string
  /** 등기권리증 지분정보 목록 */
  shares?: CertificateShareResponse[]
  /** 등기필정보목록 */
  registryCertificate?: RegistryCertificateFormResponse[]
}

/** 등기신청서 - 등기명의인표시변경 */
export interface ApplicationChangeFormResponse {
  /** 변경사항 */
  changeContent?: string
  applicant?: ChangeApplicantInfoResponse
}

/** 등기신청서 - 등기명의인표시경정 */
export interface ApplicationCorrectionFormResponse {
  /** 경정사항 */
  correctionContent?: string
  applicant?: CorrectionApplicantInfoResponse
}

/** 등기신청서 - 부동산정보 */
export interface ApplicationPropertyFormResponse {
  /** 부동산의표시 목록 */
  propertyDescription?: string[]
  registryOffice?: RegistryOfficeFormResponse
}

/** 등기신청서 - 첨부문서정보 */
export interface AttachedDocumentResponse {
  /** 문서명 */
  attachmentName?: string
  /** 통수 */
  quantity?: number
}

/** 등기신청서 통합 응답 */
export interface UnifiedApplicationFormResponse {
  registryType?: string
  specialLawAppliedNote?: string
  transferShareDescription?: string
  shareDescription?: string
  registrationPurpose?: string
  agentInfo?: AgentInfoResponse
  contractParties?: ContractPartyReplaceResponse
  ownershipContract?: OwnershipContractSaveResponse
  mortgageContract?: MortgageContractSaveResponse
  surfaceRightContract?: SurfaceRightContractSaveResponse
  mortgageFinancial?: MortgageFinancialSaveResponse
  taxPopup?: TaxPopupSaveResponse
  taxAgency?: RegistryProgressTaxAgencyListResponse
  cancellation?: ApplicationCancellationFormResponse
  attachments?: AttachedDocumentResponse[]
  properties?: ApplicationPropertyFormResponse[]
  correction?: ApplicationCorrectionFormResponse
  change?: ApplicationChangeFormResponse
  certificates?: ApplicationCertificateFormResponse[]
}

/** 등기 원인 */
export type RegistryCause =
  | 'TRADE'
  | 'ESTABLISHMENT_CONTRACT'
  | 'ADDRESS_CHANGE'
  | 'ROAD_NAME_ADDRESS'
  | 'APPLICATION_ERROR'
  | 'TERMINATION'

/** 등기 유형 */
export type RegistryType =
  | 'OWNERSHIP_TRANSFER'
  | 'MORTGAGE'
  | 'SURFACE_RIGHT'
  | 'CHANGE'
  | 'CORRECTION'
  | 'MORTGAGE_CANCELLATION'
  | 'SURFACE_RIGHT_CANCELLATION'

export interface AgentInfoResponse {
  lawFirmName?: string
  qualificationType?: string
  qualifiedPersonName?: string
  phoneNumber?: string
  extensionNumber?: string
  address?: string
}

export interface ApplicationFeeSection {
  applicationFee?: number
  registryCount?: number
  batchPaymentAmount?: number
  exemptionReason?: string
}

export interface CertificateShareResponse {
  progressPartyId?: number
  name?: string
  holdingShareNumerator?: number
  holdingShareDenominator?: number
  transferShareNumerator?: number
  transferShareDenominator?: number
  section?: 'GAP' | 'EUL'
  rankNumber?: string
}

export interface ChangeApplicantInfoResponse {
  name?: string
  registrationNumber?: string
  address?: string
}

export interface CorrectionApplicantInfoResponse {
  name?: string
  registrationNumber?: string
  address?: string
}

export interface MortgageFinancialSaveResponse {
  bondPurchaseType?: 'PURCHASE' | 'DISCOUNT' | 'EXEMPTION'
  bondPurchaseAmount?: number
  bondExemptionReason?: string
  housingBondNumber?: string
  maximumCreditAmount?: number
  registryType?:
    | 'OWNERSHIP_TRANSFER'
    | 'MORTGAGE'
    | 'SURFACE_RIGHT'
    | 'CHANGE'
    | 'CORRECTION'
    | 'MORTGAGE_CANCELLATION'
    | 'SURFACE_RIGHT_CANCELLATION'
  taxTotalAmount?: number
  taxPaymentStatus?: 'PAYMENT' | 'EXEMPTION'
  taxExemptionReason?: string
  registrationLicenseTax?: number
  educationTax?: number
  ruralSpecialTax?: number
  filingFeeAmount?: number
  filingFeePaymentStatus?: 'PAYMENT' | 'EXEMPTION'
  filingFeeExemptionReason?: string
  filingFeeRegistryCount?: number
  filingFeeRegistryMethod?: 'ELECTRONIC' | 'E_FORM' | 'PAPER'
  properties?: PropertyBondSummary[]
}

export interface PropertyBondSummary {
  propertyId?: string
  propertyType?: 'LAND' | 'BUILDING' | 'COLLECTIVE_BUILDING'
  propertyAddress?: string
  standardMarketPrice?: number
  bondPurchaseType?: 'PURCHASE' | 'DISCOUNT' | 'EXEMPTION'
  bondExemptionReason?: string
  bondPurchaseAmount?: number
}

export interface RegistryOfficeFormResponse {
  acceptanceOfficeName?: string
  jurisdictionOfficeName?: string
}

export interface TaxPopupSaveResponse {
  tax?: TaxSection
  applicationFee?: ApplicationFeeSection
}
