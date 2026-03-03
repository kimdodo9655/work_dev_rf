/**
 * 문서 경로: `@/src/api/endpoints/organization.ts`
 * 문서 제목: organization 구현 파일
 */

export const ORGANIZATION = {
  DETAIL: (organizationId: string | number) => `/api/organizations/${organizationId}`,
  OPTIONS: '/api/organizations/options',
  CHECK_REGISTRATION_NUMBER: '/api/organizations/check-registration-number'
} as const
