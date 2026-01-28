// ============================================================================
// 공통 API 응답 타입
// ============================================================================
export type { ApiResponse } from '@/types/api/common.types'

// ============================================================================
// 공통 타입
// ============================================================================
export * from '@/types/api/common.types'

// ============================================================================
// 에러 타입
// ============================================================================
export type { ApiError } from '@/types/error'
export { isApiError, toApiError } from '@/types/error'

// ============================================================================
// 유틸리티 타입
// ============================================================================
export type {
  CustomSelectEmits,
  CustomSelectProps,
  SelectOption,
  TableColumn
} from '@/types/common'

// ============================================================================
// 다이얼로그 타입
// ============================================================================
export type { AlertOptions, ConfirmOptions, DialogState } from '@/types/dialog'

// ============================================================================
// 클라이언트 상태 관리 타입
// ============================================================================
export type { AuthState, RoleLevelType } from '@/types/store'
export { getRoleLevelValue, hasPermission, UserRoleLevel } from '@/types/store'

// ============================================================================
// 공통코드
// ============================================================================
export type {
  ApiAction,
  Code,
  CodeKey,
  CodeMap,
  CodeResponse,
  EmailDomain,
  GetAdminInfoLinkTimeResponse,
  GetAssignedWorksResponse,
  GetBranchStatusesResponse,
  GetCertificateTypesResponse,
  GetEstimateSelectionStatusesResponse,
  GetEstimateWritingStatusesResponse,
  GetOrganizationStatusesResponse,
  GetOrganizationTypesResponse,
  GetPartyRolesForRequestResponse,
  GetPartyRolesResponse,
  GetPartyTypesResponse,
  GetPaymentStatusesResponse,
  GetProgressStatusesResponse,
  GetProgressTypesResponse,
  GetPropertyTypesResponse,
  GetQualifiedTypesResponse,
  GetQuoteProgressStatusesResponse,
  GetRegistryCausesResponse,
  GetRegistryMethodsResponse,
  GetRegistryTypesForAssignResponse,
  GetRegistryTypesResponse,
  GetSectionsResponse,
  GetSecuredDebtScopeTypesResponse,
  GetUserRoleLevelsResponse,
  GetUserStatusesResponse,
  GetWorkTypesResponse,
  RepresentativePosition,
  RoleLevelCode,
  RoleLevelCodeMap,
  UserPosition
} from '@/types/api/code.types'
export {
  API_ACTIONS,
  codesToMap,
  codesToSelectOptions,
  EMAIL_DOMAINS,
  getCodeDescription,
  REPRESENTATIVE_POSITIONS,
  roleLevelCodesToMap,
  toSelectOptions,
  USER_POSITIONS
} from '@/types/api/code.types'

// ============================================================================
// 인증
// ============================================================================
export type {
  EmailVerifyRequest,
  EmailVerifyResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  OrganizationCreateRequest,
  OrganizationCreateResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  SetPasswordRequest,
  SignUpRequest,
  SignUpResponse,
  TokenRefreshRequest,
  TokenRefreshResponse,
  ValidateEmailTokenRequest,
  ValidateEmailTokenResponse,
  VerifyEmail_1Request
} from '@/types/api/auth.types'

// ============================================================================
// 사용자
// ============================================================================
export type {
  ApproveUserParams,
  ApproveUserResponse,
  AssignedBankInfo,
  CheckDuplicateEmailQuery,
  CheckDuplicateEmailResponse,
  CheckDuplicateLoginIdQuery,
  CheckDuplicateLoginIdResponse,
  CreateUserRequest,
  CreateUserResponse,
  GetAssignableUsersQuery,
  GetAssignableUsersResponse,
  GetProfileResponse,
  GetUserDetailParams,
  GetUserDetailResponse,
  SearchUsersQuery,
  SearchUsersResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  UpdateUserParams,
  UpdateUserRequest,
  UpdateUserResponse,
  UserAssignableResponse,
  UserAssignedBankSummaryResponse,
  UserCreateRequest,
  UserCreateResponse,
  UserDetailResponse,
  UserResponse,
  UserSelfUpdateRequest,
  UserStatus,
  UserUpdateRequest,
  VerifyEmailParams,
  VerifyEmailResponse
} from '@/types/api/user.types'

// ============================================================================
// 금융기관
// ============================================================================
export type {
  BankResponse,
  GetBankParams,
  GetBankResponse,
  GetBanksResponse
} from '@/types/api/bank.types'

// ============================================================================
// 주소
// ============================================================================
export type {
  AddressAutocompleteResponse,
  AddressItem,
  AddressSearchResponseSwagger,
  GetAddressSuggestionsQuery,
  GetAddressSuggestionsResponse,
  GetRegistryOfficesQuery,
  GetRegistryOfficesResponse,
  RegistryOfficeDetailResponse,
  RegistryOfficeResponse,
  SearchAddressesQuery,
  SearchAddressesResponse
} from '@/types/api/address.types'

// ============================================================================
// 기관
// ============================================================================
export * from '@/types/api/organization.types'

// ============================================================================
// 지점
// ============================================================================
export * from '@/types/api/branch.types'
export * from '@/types/api/branch-bank.types'
export * from '@/types/api/branch-document.types'
export * from '@/types/api/branch-payment.types'
export * from '@/types/api/branch-prepaid.types'
export * from '@/types/api/branch-registry.types'

// ============================================================================
// 알림
// ============================================================================
export * from '@/types/api/notification.types'

// ============================================================================
// 공지사항
// ============================================================================
export * from '@/types/api/notice.types'

// ============================================================================
// 등기
// ============================================================================
export * from '@/types/api/registry-admin-consent.types'
export * from '@/types/api/registry-attachment.types'
export * from '@/types/api/registry-cancellation.types'
export * from '@/types/api/registry-case.types'
export * from '@/types/api/registry-certificate.types'
export * from '@/types/api/registry-change.types'
export * from '@/types/api/registry-completion.types'
export * from '@/types/api/registry-contract.types'
export * from '@/types/api/registry-correction.types'
export * from '@/types/api/registry-dashboard.types'
export * from '@/types/api/registry-debt-tax.types'
export * from '@/types/api/registry-housing-bond.types'
export * from '@/types/api/registry-loan-account.types'
export * from '@/types/api/registry-prior-loan.types'
export * from '@/types/api/registry-progress.types'
export * from '@/types/api/registry-progress-document.types'
export * from '@/types/api/registry-property.types'
export * from '@/types/api/registry-quote.types'
export * from '@/types/api/registry-receipt.types'
export * from '@/types/api/registry-receipt-document.types'
export * from '@/types/api/registry-request-document.types'
export * from '@/types/api/registry-schedule.types'
export * from '@/types/api/registry-signature.types'
export * from '@/types/api/registry-tax.types'
export * from '@/types/api/registry-tax-report.types'
export * from '@/types/api/registry-test.types'
export * from '@/types/api/registry-transfer-certificate.types'
export * from '@/types/api/registry-type.types'

// ============================================================================
// RPA
// ============================================================================
export * from '@/types/api/rpa.types'

// ============================================================================
// 외부 링크
// ============================================================================
export type { ExternalLinks } from '@/constants/externalLinks'
