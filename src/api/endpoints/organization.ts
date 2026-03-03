/**
 * 문서 경로: `@/src/api/endpoints/organization.ts`
 * 문서 제목: API 엔드포인트: organization
 */

export const ORGANIZATION = {
  DETAIL: (organizationId: string | number) => `/api/organizations/${organizationId}`,
  OPTIONS: '/api/organizations/options',
  CHECK_REGISTRATION_NUMBER: '/api/organizations/check-registration-number'
} as const
