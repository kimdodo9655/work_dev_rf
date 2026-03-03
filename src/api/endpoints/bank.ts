/**
 * 문서 경로: `@/src/api/endpoints/bank.ts`
 * 문서 제목: API 엔드포인트: bank
 */

export const BANK = {
  LIST: '/api/banks',
  DETAIL: (code: string | number) => `/api/banks/${code}`
} as const
