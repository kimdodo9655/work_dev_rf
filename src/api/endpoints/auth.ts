/**
 * 문서 경로: `@/src/api/endpoints/auth.ts`
 * 문서 제목: auth 구현 파일
 */

export const AUTH = {
  SIGNUP: '/api/auth/signup',
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  REFRESH: '/api/auth/refresh',
  EMAIL_VERIFY_VALIDATE: '/api/auth/email-verify/validate',
  EMAIL_VERIFY: '/api/auth/email-verify',
  PASSWORD: '/api/auth/password'
} as const
