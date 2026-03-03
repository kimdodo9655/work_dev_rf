export const USER = {
  PROFILE: '/api/users/profile',
  SEARCH: '/api/users/search',
  DETAIL: (userId: string | number) => `/api/users/${userId}`,
  UPDATE: (userId: string | number) => `/api/users/${userId}`,
  CREATE: '/api/users',
  APPROVE: (userId: string | number) => `/api/users/${userId}/approve`,
  EMAIL_VERIFY: (userId: string | number) => `/api/users/${userId}/email-verify`,
  ASSIGNABLE: '/api/users/assignable',
  ASSIGNED_BANKS: '/api/users/assigned-banks',
  CHECK_LOGIN_ID: '/api/users/check-login-id',
  CHECK_EMAIL: '/api/users/check-email',
  UPDATE_PROFILE: '/api/users/profile'
} as const
