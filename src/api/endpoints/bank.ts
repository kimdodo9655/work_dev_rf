/**
 * 문서 경로: `@/src/api/endpoints/bank.ts`
 * 문서 제목: bank 구현 파일
 */

export const BANK = {
  LIST: '/api/banks',
  DETAIL: (code: string | number) => `/api/banks/${code}`
} as const
