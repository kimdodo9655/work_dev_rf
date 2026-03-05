/**
 * 문서 경로: `@/src/api/endpoints/notice.ts`
 * 문서 제목: API 엔드포인트: notice
 */

export const NOTICE = {
  LIST: '/api/notices',
  SEARCH: '/api/notices/search',
  DETAIL: (id: string | number) => `/api/notices/${id}`
} as const
