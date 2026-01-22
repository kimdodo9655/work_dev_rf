/**
 * 타입 통합 Export
 * @file src/types/index.ts
 *
 * 최신 OpenAPI 스펙(api-docs.json) 기반 + 프로젝트 커스텀 타입
 * 생성일: 2025-01-21
 * 수정일: 2025-01-21 (API 문서 기반 재검증)
 */

// ============================================================================
// 공통 API 타입
// ============================================================================
export type { ApiResponse, Pageable, PageRequest, PaginatedResponse, Sort } from './api'

// ============================================================================
// 에러 관련 타입 (프로젝트 커스텀)
// ============================================================================
export type { ApiError } from './error'
export { isApiError, toApiError } from './error'

// ============================================================================
// 공통 유틸리티 타입 (프로젝트 커스텀)
// ============================================================================
export type { CustomSelectEmits, CustomSelectProps, SelectOption, TableColumn } from './common'

// ============================================================================
// 다이얼로그 타입 (프로젝트 커스텀)
// ============================================================================
export type { AlertOptions, ConfirmOptions, DialogState } from './dialog'

// ============================================================================
// 도메인: Address (주소)
// ============================================================================
export type {
  AddressAutocompleteParams,
  AddressAutocompleteResponse,
  AddressItem,
  AddressSearchParams,
  AddressSearchResponse,
  PageInfo,
  RegistryOffice,
  RegistryOfficeList,
  ScrollInfo
} from './domains/address'

// ============================================================================
// 도메인: Auth (인증)
// ============================================================================
export type {
  AuthState,
  LoginData,
  LoginRequest,
  RefreshData,
  RefreshRequest,
  UserRoleCodeType
} from './domains/auth'
export { getUserRoleCode, getUserRoleLevel, UserRoleCode, UserRoleLevel } from './domains/auth'

// ============================================================================
// 도메인: Bank (금융기관)
// ============================================================================
export type { Bank, BankList } from './domains/bank'

// ============================================================================
// 도메인: Code (공통코드)
// ============================================================================
export type {
  Code,
  CodeKey,
  CodeMap,
  CodeResponse,
  RoleLevelCode,
  RoleLevelCodeMap
} from './domains/code'
export {
  API_ACTIONS,
  EMAIL_DOMAINS,
  REPRESENTATIVE_POSITIONS,
  toSelectOptions,
  USER_POSITIONS
} from './domains/code'

// ============================================================================
// 도메인: Branch (지점)
// ============================================================================
export type {
  AssignedBankInfo,
  BranchAssignedBank,
  BranchAssignedBankItem,
  BranchAssignedBankResponse,
  BranchCreateRequest,
  BranchCreateResponse,
  BranchDetailResponse,
  BranchItem,
  BranchListParams,
  BranchOption,
  BranchPaymentAccount,
  BranchRegistryCredential,
  BranchUpdateRequest,
  RegistryTypeForAssign,
  UserAssignedBank,
  UserAssignedBankItem
} from './domains/branch'

// ============================================================================
// 도메인: Notification (알림 & 공지사항)
// ============================================================================
export type {
  Notice,
  NotificationCreateRequest,
  NotificationDetail,
  NotificationListResponse
} from './domains/notification'

// ============================================================================
// 도메인: Organization (기관)
// ============================================================================
export type {
  OrganizationCreateRequest,
  OrganizationCreateResponse,
  OrganizationDetailResponse,
  OrganizationItem,
  OrganizationListParams,
  OrganizationOption,
  OrganizationUpdateRequest
} from './domains/organization'

// ============================================================================
// 도메인: User (사용자)
// ============================================================================
export type {
  UserAssignable,
  UserAssignedBankSummary,
  UserCreateRequest,
  UserCreateResponse,
  UserDetailResponse,
  UserItem,
  UserListItem,
  UserListParams,
  UserSelfUpdateRequest,
  UserUpdateRequest
} from './domains/user'

// ============================================================================
// 도메인: Registry - 견적 (Estimate)
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
} from './domains/registry'

// ============================================================================
// 도메인: Registry - 진행 (Progress)
// ============================================================================
export type {
  AssignManagerRequest,
  DailySchedule,
  ProgressListParams,
  ProgressSchedules,
  ProgressStatistics,
  ProgressStatusCount,
  ProgressSummary,
  RegistryLoanPaymentAccount,
  RegistryLoanPaymentAccountDetailResponse,
  RegistryLoanPaymentAccountListResponse,
  RegistryLoanPaymentAccountReceiptUploadResponse,
  RegistryLoanPaymentAccountSaveRequest,
  RegistryProgressBasic,
  RegistryProgressESignatureTableResponse,
  RegistryProgressListItem,
  RegistryProgressLoan,
  RegistryTaxAgency,
  RegistryTaxAgencyDetailResponse,
  RegistryTaxAgencyListResponse,
  RegistryTaxAgencySaveRequest,
  ScheduleItem,
  ScheduleParams,
  TodayProgress
} from './domains/registry'

// ============================================================================
// 도메인: Registry - 신청서 (Application)
// ============================================================================
export type {
  MortgageInfo,
  OwnershipTransferSummary,
  RegistryApplicationCreateRequest,
  RegistryApplicationDeleteRequest,
  RegistryApplicationDocument,
  RegistryApplicationDocumentSection,
  RegistryApplicationForm,
  RegistryApplicationUpdateRequest
} from './domains/registry'

// ============================================================================
// 도메인: Registry - 계약 (Contract)
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
} from './domains/registry'

// ============================================================================
// 도메인: Registry - 부동산 & 세금 (Property & Tax)
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
} from './domains/registry'

// ============================================================================
// 도메인: Registry - RPA (자동화)
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
} from './domains/registry'
export { RpaTaskStatus, RpaTaskType } from './domains/registry'

// ============================================================================
// 도메인: Registry - 권리증/증명서 (Certificate)
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
} from './domains/registry'

// ============================================================================
// 도메인: Registry - 행정정보 동의 (Admin Info)
// ============================================================================
export type {
  AdminConsentStatus,
  AdminConsentTarget,
  AdminInfoRequestDetailResponse,
  AdminInfoRequestItem,
  AdminInfoRequestListItem,
  AdminInfoRequestListResponse,
  AdminInfoRequestSaveRequest,
  BasicInfoItem,
  InputInfoItem
} from './domains/registry'

// ============================================================================
// 도메인: Registry - 첨부서면 (Attachment)
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
} from './domains/registry'
export { AttachmentType, SubmissionMethod } from './domains/registry'

// ============================================================================
// 도메인: Registry - 접수정보 (Receipt)
// ============================================================================
export type {
  ApplicationReceiptItem,
  CaseInquiryItem,
  CaseInquiryListItem,
  CaseInquiryListResponse,
  CaseInquiryRequest,
  CaseInquiryResponse,
  CaseInquiryResultWrapper,
  ReceiptDetailResponse,
  ReceiptItem,
  ReceiptListItem,
  ReceiptListResponse,
  ReceiptSaveRequest
} from './domains/registry'

// ============================================================================
// 외부 링크 타입 (프로젝트 고유)
// ============================================================================
// 프로젝트에 해당 파일이 없으면 주석 처리하세요
export type { ExternalLinks } from '@/constants/externalLinks'
