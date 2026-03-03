export const ORGANIZATION = {
  DETAIL: (organizationId: string | number) => `/api/organizations/${organizationId}`,
  OPTIONS: '/api/organizations/options',
  CHECK_REGISTRATION_NUMBER: '/api/organizations/check-registration-number'
} as const
