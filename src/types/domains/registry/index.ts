/**
 * 등기 도메인 타입 통합 Export
 * @file src/types/domains/registry/index.ts
 *
 * OpenAPI Schema 기반으로 생성됨
 * 생성일: 2025-01-16
 */

// ============================================================================
// 견적 (Estimate)
// ============================================================================
export type {
  EstimateDetail,
  EstimateInfo,
  EstimateListItem,
  EstimateListParams,
  EstimateSubmitRequest,
  EstimateSubmitResponse,
  EstimateSummary,
  FeeDetails,
  LegalAgentInfo,
  ObligeeInfo,
  ObligorInfo,
  PropertyInfo,
  PublicChargeDetails,
  RegistryInfo
} from './estimate'

// ============================================================================
// 진행 (Progress)
// ============================================================================
export type {
  AssignManagerRequest,
  DailySchedule,
  ProgressListParams,
  ProgressSchedules,
  ProgressStatistics,
  ProgressStatusCount,
  ProgressSummary,
  RegistryProgressBasic,
  RegistryProgressListItem,
  RegistryProgressLoan,
  ScheduleItem,
  ScheduleParams,
  TodayProgress
} from './progress'

// ============================================================================
// 신청서 (Application)
// ============================================================================
export type {
  LegalAgentInfo as ApplicationLegalAgentInfo,
  MortgageInfo,
  OwnershipTransferSummary,
  RegistryApplicationCreateRequest,
  RegistryApplicationDeleteRequest,
  RegistryApplicationDocument,
  RegistryApplicationDocumentSection,
  RegistryApplicationForm,
  RegistryApplicationUpdateRequest
} from './application'

// ============================================================================
// 계약 (Contract)
// ============================================================================
export type {
  ContractPartyDetail,
  ContractPartyReplaceRequest,
  ContractPartyResponse,
  InterimPayment,
  InterimPaymentResponse,
  MortgageContractRequest,
  MortgageContractResponse,
  OwnershipContractRequest,
  OwnershipContractResponse,
  ProgressPartyOption,
  SecuredDebtScopeRequest,
  SecuredDebtScopeResponse,
  SurfaceRightContractRequest,
  SurfaceRightContractResponse,
  SurfaceRightPartyOption
} from './contract'

// ============================================================================
// 부동산 & 세금 (Property & Tax)
// ============================================================================
export type {
  BondPropertyRequest,
  BondPropertyResponse,
  FilingFeeRequest,
  FilingFeeResponse,
  MortgageFinancialResponse,
  MortgageFinancialSaveRequest,
  OwnershipTaxResponse,
  OwnershipTaxSaveRequest,
  PropertyItem,
  PropertyReplaceRequest,
  PropertyUniqueNumberOption,
  RegistryApplicationPropertyResponse,
  StampTaxRequest,
  StampTaxResponse,
  TaxInfoRequest,
  TaxInfoResponse
} from './property-tax'

// ============================================================================
// RPA (자동화)
// ============================================================================
export type {
  AdminConsentTaskRequest,
  ConsentTarget,
  EtaxAcquisitionTaskRequest,
  EtaxRegistrationTaskRequest,
  FullCertificateTaskRequest,
  PropertyDescriptionTaskRequest,
  RegistrationApplicationTaskRequest,
  RegistrationCaseQueryTaskRequest,
  RegistrationPasswordTaskRequest,
  RpaUserTaskCreateResponse,
  RpaUserTaskResponse,
  RpaUserTaskResultRequest,
  WetaxAcquisitionTaskRequest,
  WetaxRegistrationTaskRequest
} from './rpa'
export { RpaTaskStatus, RpaTaskType } from './rpa'

// ============================================================================
// 권리증/증명서 (Certificate)
// ============================================================================
export type {
  BranchPrepaidCardOption,
  CancellationCertificateDetailResponse,
  CancellationCertificateItem,
  CancellationCertificateListItem,
  CancellationCertificateListResponse,
  CancellationCertificateSaveRequest,
  FullCertificateItem,
  PostCertificateItem,
  PropertyOwnerCertificateItem,
  PropertyOwnerCertificateItemResponse,
  PropertyOwnerCertificateResponse,
  PropertyOwnerCertificateSaveRequest,
  TransferCancellationCertificateResponse
} from './certificate'

// ============================================================================
// 행정정보 동의 (Admin Info)
// ============================================================================
export type {
  AdminConsentTaskRequest as AdminConsentRpaRequest,
  AdminConsentStatus,
  AdminConsentTarget,
  AdminInfoRequestDetailResponse,
  AdminInfoRequestItem,
  AdminInfoRequestListItem,
  AdminInfoRequestListResponse,
  AdminInfoRequestSaveRequest,
  BasicInfoItem,
  InputInfoItem
} from './admin-info'

// ============================================================================
// 첨부서면 (Attachment)
// ============================================================================
export type {
  AttachmentItem,
  AttachmentItemResponse,
  AttachmentListResponse,
  AttachmentOption,
  AttachmentSaveRequest,
  DocumentDownloadResponse,
  DocumentListItem,
  DocumentSaveRequest,
  DocumentSaveResponse,
  DocumentUploadResponse
} from './attachment'
export { AttachmentType, SubmissionMethod } from './attachment'

// ============================================================================
// 접수정보 (Receipt)
// ============================================================================
export type {
  ApplicationReceiptItem,
  BranchRegistryCredential,
  CaseInquiryItem,
  CaseInquiryListItem,
  CaseInquiryListResponse,
  CaseInquiryRequest,
  CaseInquiryResponse,
  CaseInquiryResultWrapper,
  RegistrationCaseQueryTaskRequest as CaseQueryRpaRequest,
  ReceiptDetailResponse,
  ReceiptItem,
  ReceiptListItem,
  ReceiptListResponse,
  ReceiptSaveRequest
} from './receipt'
