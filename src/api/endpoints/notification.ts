/**
 * 문서 경로: `@/src/api/endpoints/notification.ts`
 * 문서 제목: notification 구현 파일
 */

export const NOTIFICATION = {
  LIST: '/api/notifications',
  CREATE: '/api/notifications',
  READ: (id: string | number) => `/api/notifications/${id}/read`,
  CLEAR_ALL: '/api/notifications/clear-all'
} as const
