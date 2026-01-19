// ============================================================================
// 공통 API 타입
// ============================================================================
export type { ApiResponse, PaginatedResponse } from '@/types/api'

// ============================================================================
// 에러 관련 타입
// ============================================================================
export type { ApiError } from '@/types/error'
export { isApiError, toApiError } from '@/types/error'

// ============================================================================
// 공통 유틸리티 타입
// ============================================================================
export type {
  CustomSelectEmits,
  CustomSelectProps,
  SelectOption,
  TableColumn
} from '@/types/common'

// ============================================================================
// 도메인: 공통코드
// ============================================================================
export type {
  Code,
  CodeKey,
  CodeMap,
  CodeResponse,
  RoleLevelCode,
  RoleLevelCodeMap
} from '@/types/domains/code'
export { API_ACTIONS, EMAIL_DOMAINS, toSelectOptions, USER_POSITIONS } from '@/types/domains/code'

// ============================================================================
// 도메인: 인증
// ============================================================================
export type {
  AuthState,
  LoginData,
  LoginRequest,
  RefreshData,
  RefreshRequest,
  UserRoleCodeType
} from '@/types/domains/auth'
export {
  getUserRoleCode,
  getUserRoleLevel,
  UserRoleCode,
  UserRoleLevel
} from '@/types/domains/auth'

// ============================================================================
// 도메인: 금융기관
// ============================================================================
export type { Bank, BankList } from '@/types/domains/bank'

// ============================================================================
// 외부 링크 타입
// ============================================================================
export type { ExternalLinks } from '@/constants/externalLinks'

// ============================================================================
// 도메인: 주소
// ============================================================================
export type {
  AddressAutocompleteParams,
  AddressAutocompleteResponse,
  AddressItem,
  AddressSearchParams,
  AddressSearchResponse,
  RegistryOffice,
  RegistryOfficeList,
  ScrollInfo
} from '@/types/domains/address'
