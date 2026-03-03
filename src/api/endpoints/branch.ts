/**
 * 문서 경로: `@/src/api/endpoints/branch.ts`
 * 문서 제목: branch 구현 파일
 */

export const BRANCH = {
  SEARCH: '/api/branches/search',
  DETAIL: (branchId: string | number) => `/api/branches/${branchId}`,
  UPDATE: (branchId: string | number) => `/api/branches/${branchId}`,
  CREATE: '/api/branches',
  OPTIONS: '/api/branches/options',
  CHECK_BUSINESS_NUMBER: '/api/branches/check-business-number'
} as const

export const BRANCH_BANK = {
  LIST: (branchId: string | number) => `/api/branches/${branchId}/assigned-banks`,
  UPDATE: (branchId: string | number) => `/api/branches/${branchId}/assigned-banks`
} as const

export const BRANCH_PAYMENT = {
  LIST: (branchId: string | number) => `/api/branches/${branchId}/payment-accounts`,
  UPDATE: (branchId: string | number) => `/api/branches/${branchId}/payment-accounts`
} as const

export const BRANCH_REGISTRY = {
  LIST: (branchId: string | number) => `/api/branches/${branchId}/registry-credentials`,
  UPDATE: (branchId: string | number) => `/api/branches/${branchId}/registry-credentials`
} as const

export const BRANCH_PREPAID = {
  LIST: (branchId: string | number) => `/api/branches/${branchId}/prepaid-cards`,
  UPDATE: (branchId: string | number) => `/api/branches/${branchId}/prepaid-cards`
} as const

export const BRANCH_DOCUMENT = {
  TEMP_UPLOAD: (organizationId: string | number, branchId: string | number) =>
    `/api/organizations/${organizationId}/branches/${branchId}/documents/temp`,
  LIST: (organizationId: string | number, branchId: string | number) =>
    `/api/organizations/${organizationId}/branches/${branchId}/documents`,
  SAVE: (organizationId: string | number, branchId: string | number) =>
    `/api/organizations/${organizationId}/branches/${branchId}/documents`,
  DELETE: (organizationId: string | number, branchId: string | number) =>
    `/api/organizations/${organizationId}/branches/${branchId}/documents`,
  DOWNLOAD: (organizationId: string | number, branchId: string | number) =>
    `/api/organizations/${organizationId}/branches/${branchId}/documents/download`,
  DOWNLOAD_BASE64: (organizationId: string | number, branchId: string | number) =>
    `/api/organizations/${organizationId}/branches/${branchId}/documents/download/base64`
} as const
